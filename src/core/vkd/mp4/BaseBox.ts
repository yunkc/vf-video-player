/**
 * mp4 box组装类
 */
import Stream from "../Stream";
import Box from "./Box";
import UTC from "../UTC";
import {IObject} from "../../../interface/IGeneral";

class BaseBox {
    [key: string]: any;

    static _boxList: string[] = ['moov', 'trak', 'edts', 'mdia', 'minf', 'dinf', 'stbl', 'mvex', 'moof', 'traf', 'mfra'];
    protected _start: number;
    protected _size: number;
    protected _type: string | number;
    protected _data: ArrayBuffer;
    protected _subBox: BaseBox[] = [];

    get start(): number {
        return this._start;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get type(): string | number {
        return this._type;
    }

    set type(value: string | number) {
        this._type = value
    }

    get subBox(): BaseBox[] {
        return this._subBox;
    }

    set subBox(value: BaseBox[]) {
        this._subBox = value;
    }

    get data(): ArrayBuffer {
        return this._data;
    }

    set data(value: ArrayBuffer) {
        this._data = value;
    }

    constructor() {
        //构造函数
    }

    dataReferenceIndex: number;
    width: number | string;
    height: number | string;
    horizresolution: number;
    vertresolution: number;
    frameCount: number;
    depth: number;
    configVersion: number;
    profile: number;
    profileCompatibility: number;
    AVCLevelIndication: number;
    lengthSizeMinusOne: number;
    numOfSequenceParameterSets: number;
    sequenceLength: number;
    ppsCount: number;
    ppsLength: number;
    pps: string[];
    sequence: string[];
    last: string [];
    bufferSizeDB: number;
    maxBitrate: number;
    avgBitrate: number;
    version: number;
    flag: number | number[];
    count: number;
    entries: number[] | IObject[];
    entryCount: number;
    entry: IObject[];
    major_brand: string;
    minor_version: number;
    compatible_brands: string[];
    handleType: string;
    name: string;
    content: number[] | ArrayBuffer;
    create: number;
    modify: number;
    createTime: string;
    modifyTime: string;
    duration: number;
    language: number;
    channelCount: number;
    sampleSize: number;
    sampleRate: number;
    timeScale: number;
    rate: string;
    volume: string | number;
    matrix: string[];
    nextTrackID: number;
    balance: string;
    trackID: number;
    reserverd: number;
    layer: number;
    alternate_group: number;
    location: number[];
    graphicsmode: number;
    opcolor: number[];

    avc1() {
        let stream = new Stream(this.data);
        let self = this;
        stream.skip(6);
        this.dataReferenceIndex = stream.readUint16();
        stream.skip(16);
        this.width = stream.readUint16();
        this.height = stream.readUint16();
        this.horizresolution = stream.readUint32();
        this.vertresolution = stream.readUint32();
        stream.skip(4);
        this.frameCount = stream.readUint16();
        stream.skip(1);
        for (let i = 0; i < 31; i++) {
            String.fromCharCode(stream.readUint8())
        }
        this.depth = stream.readUint16();
        stream.skip(2);
        while (stream.position < stream.buffer.byteLength - 8) {
            let box = new Box();
            box.readHeader(stream);
            self.subBox.push(box);
            box.readBody(stream);
        }
        delete this.data;
        stream = null;
    }

    avcC() {
        let stream = new Stream(this.data);
        this.configVersion = stream.readUint8();
        this.profile = stream.readUint8();
        this.profileCompatibility = stream.readUint8();
        this.AVCLevelIndication = stream.readUint8();
        this.lengthSizeMinusOne = (stream.readUint8() & 3) + 1;
        this.numOfSequenceParameterSets = stream.readUint8() & 31;
        let sequenceLength = stream.readUint16();
        this.sequenceLength = sequenceLength;
        let sequence: string[] = [];
        for (let i = 0; i < sequenceLength; i++) {
            sequence.push(Number(stream.readUint8()).toString(16))
        }

        this.ppsCount = stream.readUint8();
        let ppsLength = stream.readUint16();
        this.ppsLength = ppsLength;
        let pps: string[] = [];
        for (let i = 0; i < ppsLength; i++) {
            pps.push(Number(stream.readUint8()).toString(16))
        }

        this.pps = pps;
        this.sequence = sequence;
        let last: string[] = [];
        let dataViewLength = stream.dataView.byteLength;
        while (stream.position < dataViewLength) {
            last.push(stream.readUint8())
        }
        this.last = last;
        delete this.subBox;
        delete this.data;
        stream = null
    }

    btrt() {
        let stream = new Stream(this.data);
        this.bufferSizeDB = stream.readUint32();
        this.maxBitrate = stream.readUint32();
        this.avgBitrate = stream.readUint32();
        delete this.subBox;
        delete this.data;
        stream = null
    }

    co64() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        let entries: number[] = [];
        this.entries = entries;
        for (let i = 0, count = this.count; i < count; i++) {
            entries.push(stream.readUint64())
        }
        delete this.subBox;
        delete this.data;
        stream = null
    }

    ctts() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.entryCount = stream.readUint32();
        let entry: IObject[] = [];
        this.entry = entry;
        for (let i = 0, count = this.entryCount; i < count; i++) {
            entry.push({
                count: stream.readUint32(),
                offset: stream.readUint32()
            })
        }
        delete this.subBox;
        delete this.data;
        stream = null
    }

    dref() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        let entryCount = stream.readUint32();
        this.entryCount = entryCount;
        let self = this;
        // 暂时不支持离散视频，视频的部分内容由url指定
        for (let i = 0; i < entryCount; i++) {
            let box = new Box();
            self.subBox.push(box);
            box.read(stream)
        }
        delete this.data;
        stream = null
    }

    elst() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        let entries: IObject[] = [];
        let entry_count = stream.readUint32();
        this.entries = entries;
        for (let i = 0; i < entry_count; i++) {
            let entry: IObject = {};
            entries.push(entry);
            if (this.version === 1) {
                entry.segment_duration = stream.readUint64();
                entry.media_time = stream.readUint64();
            } else {
                entry.segment_duration = stream.readUint32();
                entry.media_time = stream.readInt32();
            }
            entry.media_rate_integer = stream.readInt16();
            entry.media_rate_fraction = stream.readInt16();
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    esds() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        let box = Box.MP4ESDescrTag(stream);
        this.subBox.push(box);
        delete this.data;
        stream = null;
    }

    ftyp() {
        let stream = new Stream(this.data);
        this.major_brand = String.fromCharCode(stream.readUint8(), stream.readUint8(), stream.readUint8(), stream.readUint8());
        this.minor_version = stream.readUint32();
        let compatibleBrands = [];
        for (let i = 0, len = Math.floor((stream.buffer.byteLength - 8) / 4); i < len; i++) {
            compatibleBrands.push(String.fromCharCode(stream.readUint8(), stream.readUint8(), stream.readUint8(), stream.readUint8()));
        }
        this.compatible_brands = compatibleBrands;
        stream = null;
        delete this.subBox;
        delete this.data;
    }


    hdlr() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        stream.skip(4);
        this.handleType = `${String.fromCharCode(stream.readUint8())}${String.fromCharCode(stream.readUint8())}${String.fromCharCode(stream.readUint8())}${String.fromCharCode(stream.readUint8())}`;
        stream.skip(12);
        let name = [];
        while (stream.position < this.size - 8) {
            name.push(String.fromCharCode(stream.readUint8()))
        }
        this.name = name.join('');
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    hmhd() {
    }

    iods() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        let content: number[] = [];
        let length = stream.buffer.byteLength;
        while (stream.position < length) {
            content.push(stream.readUint8())
        }
        this.content = content;
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    mdat() {
        delete this.subBox;
    }

    mdhd() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        if (this.version === 1) {
            this.create = stream.readUint64();
            this.modify = stream.readUint64();
            this.createTime = new UTC().setTime(this.create * 1000);
            this.modifyTime = new UTC().setTime(this.modify * 1000);
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint64();
        } else {
            this.create = stream.readUint32();
            this.modify = stream.readUint32();
            this.createTime = new UTC().setTime(this.create * 1000);
            this.modifyTime = new UTC().setTime(this.modify * 1000);
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint32();
        }
        this.language = stream.readUint16();
        stream.readUint16();
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    mfhd() {
    };

    mp4a() {
        let stream = new Stream(this.data);
        stream.skip(6);
        this.dataReferenceIndex = stream.readUint16();
        stream.skip(8);
        this.channelCount = stream.readUint16();
        this.sampleSize = stream.readUint16();
        stream.skip(4);
        this.sampleRate = stream.readUint32() >>> 16;
        let box = new Box();
        box.readHeader(stream);
        this.subBox.push(box);
        box.readBody(stream);
        delete this.data;
        stream = null;
    }

    mvhd() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        if (this.version === 1) {
            this.create = stream.readUint64();
            this.modify = stream.readUint64();
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint64();
        } else {
            this.create = stream.readUint32();
            this.modify = stream.readUint32();
            this.timeScale = stream.readUint32();
            this.duration = stream.readUint32();
        }
        this.createTime = new UTC().setTime(this.create * 1000);
        this.modifyTime = new UTC().setTime(this.modify * 1000);
        this.rate = stream.readUint16() + '.' + stream.readUint16();
        this.volume = stream.readUint8() + '.' + stream.readUint8();
        stream.skip(10);
        let matrix = [];
        for (let i = 0; i < 9; i++) {
            matrix.push(stream.readUint16() + '.' + stream.readUint16());
        }
        this.matrix = matrix;
        stream.skip(24);
        this.nextTrackID = stream.readUint32();
        delete this.subBox;
        delete this.data;
    }

    nmhd() {
    }

    pasp() {
        let stream = new Stream(this.data);
        this.content = stream.buffer.slice(0, this.size - 8);
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    sbgp() {
    }

    sdtp() {
    }

    smhd() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.balance = stream.readInt8() + '.' + stream.readInt8();
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    stco() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        let entries: number[] = [];
        this.entries = entries;
        for (let i = 0, count = this.count; i < count; i++) {
            entries.push(stream.readUint32());
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    stsc() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        let entries: IObject[] = [];
        this.entries = entries;
        for (let i = 0, count = this.count; i < count; i++) {
            entries.push({
                first_chunk: stream.readUint32(),
                samples_per_chunk: stream.readUint32(),
                sample_desc_index: stream.readUint32()
            })
        }
        for (let i = 0, count = this.count, entry, preEntry; i < count - 1; i++) {
            entry = entries[i];
            preEntry = entries[i - 1];
            entry.chunk_count = entries[i + 1].first_chunk - entry.first_chunk;
            entry.first_sample = i === 0 ? 1 : preEntry.first_sample + preEntry.chunk_count * preEntry.samples_per_chunk;
        }
        if (this.count === 1) {
            let entry = entries[0];
            entry.first_sample = 1;
            entry.chunk_count = 0;
        } else if (this.count > 1) {
            let last = entries[this.count - 1];
            let pre = entries[this.count - 2];
            last.first_sample = pre.first_sample + pre.chunk_count * pre.samples_per_chunk;
            last.chunk_count = 0;
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    stsd() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.entryCount = stream.readUint32();
        let box = new Box();
        box.readHeader(stream);
        this.subBox.push(box);
        box.readBody(stream);
        delete this.data;
        stream = null;
    }

    stsh() {
    }

    stss() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        let entries: number[] = [];
        this.entries = entries;
        for (let i = 0, count = this.count; i < count; i++) {
            entries.push(stream.readUint32());
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    stsz() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.sampleSize = stream.readUint32();
        this.count = stream.readUint32();
        if (this.sampleSize === 0) {
            let entries: number[] = [];
            this.entries = entries;
            for (let i = 0, count = this.count; i < count; i++) {
                entries.push(stream.readUint32());
            }
        }
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    stts() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        this.count = stream.readUint32();
        let entry: IObject[] = [];
        for (let i = 0, count = this.count; i < count; i++) {
            entry.push({
                sampleCount: stream.readUint32(),
                sampleDuration: stream.readUint32()
            })
        }
        this.entry = entry;
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    stz2() {
    }

    tfhd() {
    }


    tkhd() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = stream.readByte(3);
        if (this.version === 1) {
            this.create = stream.readUint64();
            this.modify = stream.readUint64();
            this.trackID = stream.readUint32();
            this.reserverd = stream.readUint32();
            this.duration = stream.readUint64();
        } else {
            this.create = stream.readUint32();
            this.modify = stream.readUint32();
            this.trackID = stream.readUint32();
            this.reserverd = stream.readUint32();
            this.duration = stream.readUint32();
        }
        this.createTime = new UTC().setTime(this.create * 1000);
        this.modifyTime = new UTC().setTime(this.modify * 1000);
        stream.readUint64();
        this.layer = stream.readInt16();
        this.alternate_group = stream.readInt16();
        this.volume = stream.readInt16() >> 8;
        stream.readUint16();
        let matrix: string[] = [];
        for (let i = 0; i < 9; i++) {
            matrix.push(stream.readUint16() + '.' + stream.readUint16());
        }
        this.matrix = matrix;
        this.width = stream.readUint16() + '.' + stream.readUint16();
        this.height = stream.readUint16() + '.' + stream.readUint16();
        delete this.data;
        delete this.subBox;
        stream = null;
    }

    traf() {

    }

    turn() {
    }

    udta() {
        delete this.subBox;
    }

    url() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = [stream.readUint8(), stream.readUint8(), stream.readUint8()];
        let location: number[] = [];
        let length = stream.buffer.byteLength;
        while (stream.position < length) {
            location.push(stream.readUint8());
        }
        this.location = location;
        delete this.subBox;
        delete this.data;
        stream = null;
    }

    vmhd() {
        let stream = new Stream(this.data);
        this.version = stream.readUint8();
        this.flag = [stream.readUint8(), stream.readUint8(), stream.readUint8()];
        this.graphicsmode = stream.readUint16();
        this.opcolor = [stream.readUint16(), stream.readUint16(), stream.readUint16()];
        delete this.subBox;
        delete this.data;
        stream = null;
    }
}

export default BaseBox;