/**
 * 碎片化MP4组装worker
 */
import InlineWorker from './InlineWorker';
import RuntimeLog from '../../log/RuntimeLog';
import { IObject } from '../../interface/IGeneral';

let _instance: FMP4Worker;
class FMP4Worker {
    private _worker: InlineWorker = null;

    get worker() {
        return this._worker;
    }

    constructor(sign: any) {
        if (sign !== PrivateClass) throw new Error('class FMP4Worker is singleton, do not use new operator!')
        RuntimeLog.getInstance().log(`FMP4 worker is loading...`);
        this.createWorker();
        RuntimeLog.getInstance().log(`FMP4 worker is loaded`);
    }

    static getInstance() {
        if (!_instance) {
            _instance = new FMP4Worker(PrivateClass);
        }
        return _instance;
    }

    /**
     * 创建worker
     */
    private createWorker() {
        this._worker = new InlineWorker(function () {
            const UINT32_MAX = Math.pow(2, 32) - 1;
            let _self = this;
            let sequence: number = 1;
            let handleQueue: IObject[] = [];
            let handling: boolean = false;

            const methodMap: IObject = {
                'initSegment': (params: IObject) => {
                    let moovMetaData = params.meta;
                    let _buffer = new Buffer();
                    _buffer.write(ftyp());
                    _buffer.write(moov(moovMetaData));
                    _self.postMessage({
                        method: 'initSegment',
                        params: _buffer.buffer
                    })

                    handling = false;
                    checkNextHandle();
                },

                'mediaSegment': (params: IObject) => {
                    let resBuffers: Uint8Array[] = [];
                    let _video_samples: IObject[] = params.samples[0];
                    let _audio_samples: IObject[] = params.samples[1];
                    let start = params.start;
                    let mdatData = params.mdatData;
                    let video_samples = _video_samples.map((item: IObject, idx: number) => {
                        return {
                            size: item.size,
                            duration: item.time.duration,
                            offset: item.time.offset,
                            buffer: new Uint8Array(mdatData.slice(item.offset - start, item.offset - start + item.size)),
                            key: idx === 0
                        }
                    });

                    let audio_samples = _audio_samples.map((item: IObject, idx: number) => {
                        return {
                            size: item.size,
                            duration: item.time.duration,
                            offset: item.time.offset,
                            buffer: new Uint8Array(mdatData.slice(item.offset - start, item.offset - start + item.size)),
                            key: idx === 0
                        }
                    });

                    resBuffers.push(addFragment({
                        id: 1,
                        time: _video_samples[0].time.time,
                        firstFlags: 0x2000000,
                        flags: 0xf01,
                        samples: video_samples
                    }))

                    audio_samples.length && resBuffers.push(addFragment({
                        id: 2,
                        time: (_audio_samples[0] && _audio_samples[0].time && _audio_samples[0].time.time) || 0,
                        firstFlags: 0x00,
                        flags: 0x701,
                        samples: audio_samples
                    }));

                    let bufferSize: number = 0;
                    resBuffers.every((item: Uint8Array) => {
                        bufferSize += item.byteLength;
                        return true;
                    });
                    let buffer: Uint8Array = new Uint8Array(bufferSize);
                    let offset: number = 0;
                    resBuffers.every((item: Uint8Array) => {
                        buffer.set(item, offset);
                        offset += item.byteLength;
                        return true;
                    });

                    _self.postMessage({
                        method: 'mediaSegment',
                        params: buffer
                    })

                    handling = false;
                    checkNextHandle();
                },
            }

            _self.onmessage = (e: IObject) => {
                handleQueue.push(e.data);
                checkNextHandle();
            }

            function checkNextHandle() {
                if (!handleQueue.length || handling) return;

                handling = true;
                let _dataObj = handleQueue.shift();
                let _method = _dataObj.method;
                let _params = _dataObj.params;
                methodMap[_method](_params);
            }

            function addFragment(data: IObject) {
                let buffer = new Buffer();
                buffer.write(moof(data));
                buffer.write(mdat(data));
                return buffer.buffer;
            }

            /**
             * FMP4
             */
            function size(value: number) {
                return Buffer.writeUint32(value);
            }

            function type(name: string) {
                return new Uint8Array([name.charCodeAt(0), name.charCodeAt(1), name.charCodeAt(2), name.charCodeAt(3)]);
            }

            function extension(version: number, flag: number) {
                return new Uint8Array([
                    version,
                    (flag >> 16) & 0xff,
                    (flag >> 8) & 0xff,
                    flag & 0xff
                ])
            }

            function ftyp() {
                let buffer = new Buffer();
                buffer.write(size(24), type('ftyp'), new Uint8Array([
                    0x69, 0x73, 0x6F, 0x6D, // isom,
                    0x0, 0x0, 0x00, 0x01, // minor_version: 0x01
                    0x69, 0x73, 0x6F, 0x6D, // isom
                    0x61, 0x76, 0x63, 0x31 // avc1
                ]));
                return buffer.buffer;
            }

            function mvhd(duration: number, timescale: number) {
                let buffer = new Buffer();
                duration *= timescale;
                const upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
                const lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
                let bytes = new Uint8Array([
                    0x01, // version 1
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // creation_time
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, // modification_time
                    (timescale >> 24) & 0xff,
                    (timescale >> 16) & 0xff,
                    (timescale >> 8) & 0xff,
                    timescale & 0xff, // timescale
                    (upperWordDuration >> 24),
                    (upperWordDuration >> 16) & 0xff,
                    (upperWordDuration >> 8) & 0xff,
                    upperWordDuration & 0xff,
                    (lowerWordDuration >> 24),
                    (lowerWordDuration >> 16) & 0xff,
                    (lowerWordDuration >> 8) & 0xff,
                    lowerWordDuration & 0xff,
                    0x00, 0x01, 0x00, 0x00, // 1.0 rate
                    0x01, 0x00, // 1.0 volume
                    0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, // pre_defined
                    0xff, 0xff, 0xff, 0xff // next_track_ID
                ]);
                buffer.write(size(8 + bytes.length), type('mvhd'), new Uint8Array(bytes));
                return buffer.buffer;
            }

            function tkhd(data: IObject): Uint8Array {
                let buffer = new Buffer();
                let id = data.id;
                let duration = data.duration * data.timeScale;
                let width = data.width;
                let height = data.height;
                let _type = data.type;
                let upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
                let lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
                let content = new Uint8Array([
                    0x01, // version 1
                    0x00, 0x00, 0x07, // flags
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // creation_time
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, // modification_time
                    (id >> 24) & 0xff,
                    (id >> 16) & 0xff,
                    (id >> 8) & 0xff,
                    id & 0xff, // track_ID
                    0x00, 0x00, 0x00, 0x00, // reserved
                    (upperWordDuration >> 24),
                    (upperWordDuration >> 16) & 0xff,
                    (upperWordDuration >> 8) & 0xff,
                    upperWordDuration & 0xff,
                    (lowerWordDuration >> 24),
                    (lowerWordDuration >> 16) & 0xff,
                    (lowerWordDuration >> 8) & 0xff,
                    lowerWordDuration & 0xff,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, // layer
                    0x00, _type === 'video' ? 0x01 : 0x00, // alternate_group
                    _type === 'audio' ? 0x01 : 0x00, 0x00, // non-audio track volume
                    0x00, 0x00, // reserved
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
                    (width >> 8) & 0xff,
                    width & 0xff,
                    0x00, 0x00, // width
                    (height >> 8) & 0xff,
                    height & 0xff,
                    0x00, 0x00 // height
                ]);
                buffer.write(size(8 + content.byteLength), type('tkhd'), content);
                return buffer.buffer;
            }

            function mdhd(timescale: number, duration: number = 0) {
                let buffer = new Buffer();
                duration *= timescale;
                const upperWordDuration = Math.floor(duration / (UINT32_MAX + 1));
                const lowerWordDuration = Math.floor(duration % (UINT32_MAX + 1));
                let content = new Uint8Array([
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, // creation_time
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, // modification_time
                    (timescale >> 24) & 0xff,
                    (timescale >> 16) & 0xff,
                    (timescale >> 8) & 0xff,
                    timescale & 0xff,
                    (upperWordDuration >> 24),
                    (upperWordDuration >> 16) & 0xff,
                    (upperWordDuration >> 8) & 0xff,
                    upperWordDuration & 0xff,
                    (lowerWordDuration >> 24),
                    (lowerWordDuration >> 16) & 0xff,
                    (lowerWordDuration >> 8) & 0xff,
                    lowerWordDuration & 0xff,
                    0x55, 0xc4, // 'und' language
                    0x00, 0x00
                ]);
                buffer.write(size(12 + content.byteLength), type('mdhd'), extension(1, 0), content);
                return buffer.buffer;
            }

            function hdlr(_type: string) {
                let buffer: Buffer = new Buffer();
                let value: number[] = [
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x00, // pre_defined
                    0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x56, 0x69, 0x64, 0x65,
                    0x6f, 0x48, 0x61, 0x6e,
                    0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
                ];
                if (_type === 'audio') {
                    value.splice(8, 4, 0x73, 0x6f, 0x75, 0x6e);
                    value.splice(24, 13, 0x53, 0x6f, 0x75, 0x6e,
                        0x64, 0x48, 0x61, 0x6e,
                        0x64, 0x6c, 0x65, 0x72, 0x00)
                }
                buffer.write(size(8 + value.length), type('hdlr'), new Uint8Array(value));
                return buffer.buffer;
            }

            function vmhd() {
                let buffer = new Buffer();
                buffer.write(size(20), type('vmhd'), new Uint8Array([
                    0x00, // version
                    0x00, 0x00, 0x01, // flags
                    0x00, 0x00, // graphicsmode
                    0x00, 0x00,
                    0x00, 0x00,
                    0x00, 0x00 // opcolor
                ]));
                return buffer.buffer;
            }

            function smhd() {
                let buffer = new Buffer();
                buffer.write(size(16), type('smhd'), new Uint8Array([
                    0x00, // version
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, // balance
                    0x00, 0x00 // reserved
                ]));
                return buffer.buffer;
            }

            function dinf() {
                let buffer = new Buffer();
                let dref = [0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x01, // entry_count
                    0x00, 0x00, 0x00, 0x0c, // entry_size
                    0x75, 0x72, 0x6c, 0x20, // 'url' type
                    0x00, // version 0
                    0x00, 0x00, 0x01 // entry_flags
                ];
                buffer.write(size(36), type('dinf'), size(28), type('dref'), new Uint8Array(dref));
                return buffer.buffer
            }

            function esds(config: number[] = [43, 146, 8, 0]) {
                const configlen: number = config.length;
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags

                    0x03, // descriptor_type
                    0x17 + configlen, // length
                    0x00, 0x01, // es_id
                    0x00, // stream_priority

                    0x04, // descriptor_type
                    0x0f + configlen, // length
                    0x40, // codec : mpeg4_audio
                    0x15, // stream_type
                    0x00, 0x00, 0x00, // buffer_size
                    0x00, 0x00, 0x00, 0x00, // maxBitrate
                    0x00, 0x00, 0x00, 0x00, // avgBitrate

                    0x05 // descriptor_type
                ].concat([configlen]).concat(config).concat([0x06, 0x01, 0x02]));
                buffer.write(size(8 + content.byteLength), type('esds'), content);
                return buffer.buffer;
            }

            function mp4a(data: IObject) {
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, // reserved
                    0x00, 0x01, // data_reference_index
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, data.channelCount, // channelcount
                    0x00, 0x10, // sampleSize:16bits
                    0x00, 0x00, 0x00, 0x00, // reserved2
                    (data.samplerate >> 8) & 0xff,
                    data.samplerate & 0xff, //
                    0x00, 0x00
                ]);
                let _esds: Uint8Array = esds(data.audioConfig as number[]);
                buffer.write(
                    size(8 + content.byteLength + _esds.byteLength),
                    type('mp4a'),
                    content,
                    _esds
                );
                return buffer.buffer
            }

            function avc1(data: IObject) {
                let buffer = new Buffer();
                let _size = 40; // 8(avc1)+8(avcc)+8(btrt)+16(pasp)
                let sps = data.sps;
                let pps = data.pps;
                let width = data.width;
                let height = data.height;
                let hSpacing = data.pixelRatio[0];
                let vSpacing = data.pixelRatio[1];
                let avcc = new Uint8Array([
                    0x01, // version
                    sps[1], // profile
                    sps[2], // profile compatible
                    sps[3], // level
                    0xfc | 3,
                    0xE0 | 1 // 目前只处理一个sps
                ].concat([sps.length >>> 8 & 0xff, sps.length & 0xff]).concat(sps).concat(1).concat([pps.length >>> 8 & 0xff, pps.length & 0xff]).concat(pps));
                let avc1 = new Uint8Array([
                    0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, // reserved
                    0x00, 0x01, // data_reference_index
                    0x00, 0x00, // pre_defined
                    0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, // pre_defined
                    (width >> 8) & 0xff,
                    width & 0xff, // width
                    (height >> 8) & 0xff,
                    height & 0xff, // height
                    0x00, 0x48, 0x00, 0x00, // horizresolution
                    0x00, 0x48, 0x00, 0x00, // vertresolution
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x01, // frame_count
                    0x12,
                    0x64, 0x61, 0x69, 0x6C, // dailymotion/hls.js
                    0x79, 0x6D, 0x6F, 0x74,
                    0x69, 0x6F, 0x6E, 0x2F,
                    0x68, 0x6C, 0x73, 0x2E,
                    0x6A, 0x73, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, // compressorname
                    0x00, 0x18, // depth = 24
                    0x11, 0x11]);// pre_defined = -1
                let btrt = new Uint8Array([
                    0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
                    0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
                    0x00, 0x2d, 0xc6, 0xc0 // avgBitrate
                ]);
                let pasp = new Uint8Array([
                    (hSpacing >> 24), // hSpacing
                    (hSpacing >> 16) & 0xff,
                    (hSpacing >> 8) & 0xff,
                    hSpacing & 0xff,
                    (vSpacing >> 24), // vSpacing
                    (vSpacing >> 16) & 0xff,
                    (vSpacing >> 8) & 0xff,
                    vSpacing & 0xff
                ]);

                buffer.write(
                    size(_size + avc1.byteLength + avcc.byteLength + btrt.byteLength), type('avc1'), avc1,
                    size(8 + avcc.byteLength), type('avcC'), avcc,
                    size(20), type('btrt'), btrt,
                    size(16), type('pasp'), pasp
                );
                return buffer.buffer
            }


            function stsd(data: IObject) {
                let buffer = new Buffer();
                let content: Uint8Array;
                if (data.type === 'audio') {
                    // if (!data.isAAC && data.codec === 'mp4') {
                    //     content = FMP4.mp3(data);
                    // } else {
                    //
                    // }

                    // 支持mp4a
                    content = mp4a(data);
                } else {
                    content = avc1(data);
                }
                buffer.write(
                    size(16 + content.byteLength),
                    type('stsd'),
                    extension(0, 0),
                    new Uint8Array([0x00, 0x00, 0x00, 0x01]),
                    content
                );
                return buffer.buffer
            }

            function stts() {
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, // version
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x00 // entry_count
                ]);
                buffer.write(size(16), type('stts'), content);
                return buffer.buffer;
            };

            function stsc() {
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, // version
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x00 // entry_count
                ]);
                buffer.write(size(16), type('stsc'), content);
                return buffer.buffer
            };

            function stsz() {
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, // version
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x00, // sample_size
                    0x00, 0x00, 0x00, 0x00 // sample_count
                ]);
                buffer.write(size(20), type('stsz'), content);
                return buffer.buffer
            };

            function stco() {
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, // version
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x00 // entry_count
                ]);
                buffer.write(size(16), type('stco'), content);
                return buffer.buffer
            };

            function stbl(data: IObject) {
                let buffer = new Buffer();
                let _size = 8;
                let _stsd = stsd(data);
                let _stts = stts();
                let _stsc = stsc();
                let _stsz = stsz();
                let _stco = stco();
                [_stsd, _stts, _stsc, _stsz, _stco].forEach(item => {
                    _size += item.byteLength
                });
                buffer.write(size(_size), type('stbl'), _stsd, _stts, _stsc, _stsz, _stco);
                return buffer.buffer
            }

            function minf(data: IObject) {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                let _vmhd = data.type === 'video' ? vmhd() : smhd();
                let _dinf = dinf();
                let _stbl = stbl(data);
                [_vmhd, _dinf, _stbl].forEach(item => {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('minf'), _vmhd, _dinf, _stbl);
                return buffer.buffer;
            }

            function mdia(data: IObject): Uint8Array {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                let _mdhd = mdhd(data.timeScale);
                let _hdlr = hdlr(data.type);
                let _minf = minf(data);
                [_mdhd, _hdlr, _minf].forEach(item => {
                    _size += item.byteLength
                });
                buffer.write(size(_size), type('mdia'), _mdhd, _hdlr, _minf);
                return buffer.buffer;
            }

            function videoTrak(data: IObject) {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                let _tkhd = tkhd({
                    id: 1,
                    duration: data.videoDuration || 0xffffffff,
                    timesScale: data.videoTimeScale || 90000,
                    width: data.width,
                    height: data.height,
                    type: 'video'
                });
                let _mdia = mdia({
                    type: 'video',
                    timeScale: data.videoTimeScale || 90000,
                    duration: data.videoDuration || 0xffffffff,
                    sps: data.sps,
                    pps: data.pps,
                    pixelRatio: data.pixelRatio,
                    width: data.width,
                    height: data.height
                });
                [_tkhd, _mdia].forEach((item: Uint8Array) => {
                    _size += item.byteLength
                });
                buffer.write(size(_size), type('trak'), _tkhd, _mdia);
                return buffer.buffer;
            }

            function audioTrak(data: IObject) {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                let _tkhd = tkhd({
                    id: 2,
                    duration: data.audioDuration || 0,
                    timesScale: data.audioTimeScale || 90000,
                    width: 0,
                    height: 0,
                    type: 'audio'
                });
                let _mdia = mdia({
                    type: 'audio',
                    timeScale: data.audioTimeScale || 90000,
                    duration: data.audioDuration || 0,
                    channelCount: data.channelCount,
                    samplerate: data.sampleRate || 90000,
                    audioConfig: data.audioConfig
                });
                [_tkhd, _mdia].forEach(item => {
                    _size += item.byteLength
                });
                buffer.write(size(_size), type('trak'), _tkhd, _mdia);
                return buffer.buffer;
            }

            function trex(id: number) {
                let buffer = new Buffer();
                let content = new Uint8Array([
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    (id >> 24),
                    (id >> 16) & 0xff,
                    (id >> 8) & 0xff,
                    (id & 0xff), // track_ID
                    0x00, 0x00, 0x00, 0x01, // default_sample_description_index
                    0x00, 0x00, 0x00, 0x00, // default_sample_duration
                    0x00, 0x00, 0x00, 0x00, // default_sample_size
                    0x00, 0x01, 0x00, 0x01 // default_sample_flags
                ]);
                buffer.write(size(8 + content.byteLength), type('trex'), content);
                return buffer.buffer
            }

            function mvex(duration: number, timeScale: number): Uint8Array {
                let buffer = new Buffer();
                let mehd = Buffer.writeUint32(duration * timeScale);
                buffer.write(
                    size(88),
                    type('mvex'),
                    size(16),
                    type('mehd'),
                    extension(0, 0),
                    mehd,
                    trex(1),
                    trex(2)
                );
                return buffer.buffer
            }

            function moov(params: IObject) {
                let buffer = new Buffer;
                let _size: number = 8;
                let videoOnly: boolean = params.videoOnly;
                let _timeScale = params.timeScale || 90000;
                let _mvhd: Uint8Array = mvhd(params.duration, _timeScale);
                let trak1: Uint8Array = videoTrak(params);
                let trak2: Uint8Array = audioTrak(params);
                let _mvex: Uint8Array = mvex(params.duration, _timeScale);
                let tempBoxList = videoOnly ? [_mvhd, trak1, _mvex] : [_mvhd, trak1, trak2, _mvex];
                tempBoxList.forEach(item => {
                    _size += item.byteLength
                });
                buffer.write(size(_size), type('moov'), _mvhd, trak1);
                if (!videoOnly) buffer.write(trak2);
                buffer.write(_mvex);
                return buffer.buffer;
            }

            function mfhd() {
                let buffer: Buffer = new Buffer();
                let content: Uint8Array = Buffer.writeUint32(sequence);
                sequence += 1;
                buffer.write(size(16), type('mfhd'), extension(0, 0), content);
                return buffer.buffer;
            }

            function tfhd(id: number) {
                let buffer = new Buffer();
                let content = Buffer.writeUint32(id);
                buffer.write(size(16), type('tfhd'), extension(0, 0), content);
                return buffer.buffer;
            }

            function tfdt(time: number) {
                let buffer: Buffer = new Buffer();
                let upper: number = Math.floor(time / (UINT32_MAX + 1));
                let lower = Math.floor(time % (UINT32_MAX + 1));
                buffer.write(size(20), type('tfdt'), extension(1, 0), Buffer.writeUint32(upper), Buffer.writeUint32(lower));
                return buffer.buffer;
            }

            function sdtp(data: IObject) {
                let buffer = new Buffer();
                buffer.write(size(12 + data.samples.length), type('sdtp'), extension(0, 0));
                data.samples.forEach((item: IObject) => {
                    buffer.write(new Uint8Array(data.id === 1 ? [item.key ? 32 : 16] : [16]));
                });
                return buffer.buffer;
            }

            function trun(data: IObject, sdtpLength: number) {
                let id = data.id;
                let ceil = id === 1 ? 16 : 12;
                let buffer = new Buffer();
                let sampleCount = Buffer.writeUint32(data.samples.length);
                // mdat-header 8
                // moof-header 8
                // mfhd 16
                // traf-header 8
                // thhd 16
                // tfdt 20
                // trun-header 12
                // sampleCount 4
                // data-offset 4
                // samples.length
                let offset = Buffer.writeUint32(8 + 8 + 16 + 8 + 16 + 20 + 12 + 4 + 4 + ceil * data.samples.length + sdtpLength);
                buffer.write(
                    size(20 + ceil * data.samples.length),
                    type('trun'),
                    extension(0, data.flags),
                    sampleCount,
                    offset
                );
                data.samples.forEach((item: IObject) => {
                    buffer.write(Buffer.writeUint32(item.duration));
                    buffer.write(Buffer.writeUint32(item.size));
                    if (id === 1) {
                        buffer.write(Buffer.writeUint32(item.key ? 0x02000000 : 0x01010000));
                        buffer.write(Buffer.writeUint32(item.offset));
                    } else {
                        buffer.write(Buffer.writeUint32(0x1000000));
                    }
                });
                return buffer.buffer;
            }

            function traf(data: IObject) {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                let _tfhd: Uint8Array = tfhd(data.id);
                let _tfdt: Uint8Array = tfdt(data.time);
                let _sdtp: Uint8Array = sdtp(data);
                let _trun: Uint8Array = trun(data, _sdtp.byteLength);
                [_tfhd, _tfdt, _sdtp, _trun].forEach(item => {
                    _size += item.byteLength;
                });
                buffer.write(size(_size), type('traf'), _tfhd, _tfdt, _sdtp, _trun);
                return buffer.buffer;
            }

            function moof(data: IObject) {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                let _mfhd: Uint8Array = mfhd();
                let _traf: Uint8Array = traf(data);
                [_mfhd, _traf].forEach(item => {
                    _size += item.byteLength
                });
                buffer.write(size(_size), type('moof'), _mfhd, _traf);
                return buffer.buffer
            }

            function mdat(data: IObject) {
                let buffer: Buffer = new Buffer();
                let _size: number = 8;
                data.samples.forEach((item: IObject) => {
                    _size += item.size;
                });
                buffer.write(size(_size), type('mdat'));
                data.samples.forEach((item: IObject) => {
                    buffer.write(item.buffer);
                });
                return buffer.buffer;
            }

            /**
             * Utils
             * @param arrays 
             */
            function concatUint8Array(...arrays: Uint8Array[]) {
                let totalLength: number = 0;
                for (const arr of arrays) {
                    totalLength += arr.length;
                }
                const result = new Uint8Array(totalLength);
                let offset: number = 0;
                for (const arr of arrays) {
                    result.set(arr, offset);
                    offset += arr.length;
                }
                return result;
            }

            /**
             * buffer
             */
            class Buffer {
                private _buffer: Uint8Array;

                constructor() {
                    this._buffer = new Uint8Array(0);
                }

                get buffer(): Uint8Array {
                    return this._buffer;
                }

                write(...buffer: Uint8Array[]) {
                    buffer.forEach(item => {
                        if (item) {
                            // this._buffer = NormalUtils.concatTypedArray(Uint8Array, this._buffer, item);
                            this._buffer = concatUint8Array(this._buffer, item);
                        } else {
                            RuntimeLog.getInstance().error('undefined buffer: ', item);
                        }
                    })
                }

                static writeUint32(value: number) {
                    return new Uint8Array([
                        value >> 24,
                        (value >> 16) & 0xff,
                        (value >> 8) & 0xff,
                        value & 0xff
                    ])
                }
            }


        })
    }
}

class PrivateClass {
    //内部类
}

export default FMP4Worker;