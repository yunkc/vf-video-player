/**
 * ts包body包体解析类
 */
import Stream from '../../Stream';
import TSPackageHeader from './TSPackageHeader';
import TSPackagePAT from './TSPackagePAT';
import BasePES from './BasePES';
import { IObject } from '../../../../interface/IGeneral';
import TSPackageCAT from './TSPackageCAT';
import TSPackageTSDT from './TSPackageTSDT';
import TSPackagePMT from './TSPackagePMT';
import TSPackageAdaptationField from './TSPackageAdaptationField';

const StreamType: IObject = {
    0x01: ['video', 'MPEG-1'],
    0x02: ['video', 'MPEG-2'],
    0x1b: ['video', 'AVC.H264'],
    0xea: ['video', 'VC-1'],
    0x03: ['audio', 'MPEG-1'],
    0x04: ['audio', 'MPEG-2'],
    0x0f: ['audio', 'MPEG-2.AAC'],
    0x11: ['audio', 'MPEG-4.AAC'],
    0x80: ['audio', 'LPCM'],
    0x81: ['audio', 'AC3'],
    0x06: ['audio', 'AC3'],
    0x82: ['audio', 'DTS'],
    0x83: ['audio', 'Dolby TrueHD'],
    0x84: ['audio', 'AC3-Plus'],
    0x85: ['audio', 'DTS-HD'],
    0x86: ['audio', 'DTS-MA'],
    0xa1: ['audio', 'AC3-Plus-SEC'],
    0xa2: ['audio', 'DTS-HD-SEC'],
};

class TSPackageBody {
    static PATSpace: IObject[] = [];
    static PMTSpace: IObject[] = [];

    private _header: TSPackageHeader = null;
    private _headerPid: number = -1;
    private _stream: Stream = null;
    private _instance: BasePES = null;
    private _bodyParseStrategies: IObject = {
        0: () => {
            this._instance = new TSPackagePAT(this._stream);
            //从PAT中读取PMT列表
            TSPackageBody.PATSpace = TSPackageBody.PATSpace.concat((this._instance as TSPackagePAT).list);
        },
        1: () => {
            this._instance = new TSPackageCAT(this._stream);
        },
        2: () => {
            this._instance = new TSPackageTSDT(this._stream);
        },
        0x1fff: () => {
            this._instance = null;
        },
        'default': () => {
            if (TSPackageBody.PATSpace.some((item: IObject) => { return item.pid === this._headerPid })) {
                this._header.packet = 'PMT';
                this._instance = new TSPackagePMT(this._stream);
                let _tempList = (this._instance as TSPackagePMT).list;
                //从PMT中读取media列表
                TSPackageBody.PMTSpace = TSPackageBody.PMTSpace.concat(_tempList.map((item: IObject) => {
                    return {
                        pid: item.pid,
                        es: item.es,
                        streamType: item.streamType,
                        program: (this._instance as TSPackagePMT).program
                    }
                }));
            } else {
                let ts = TSPackageBody.PMTSpace.length ?
                    TSPackageBody.PMTSpace.filter((item: IObject) => item.pid === this._headerPid) :
                    [];
                this._instance = ts.length ? new TSPackageAdaptationField(this._stream, this._header, StreamType[(ts[0] as IObject).streamType][0]) : null;
            }
        }
    }

    constructor(stream: Stream, header: TSPackageHeader) {
        this._header = header;
        this._headerPid = this._header.pid;
        this._stream = stream;
    }

    /**
     * 创建解析实例
     */
    createInstance() {
        if([0, 1, 2, 0x1fff].indexOf(this._headerPid) > -1){
            this._bodyParseStrategies[this._headerPid]();
        }else{
            this._bodyParseStrategies['default']();
        }

        return this._instance;
    }
}

export default TSPackageBody;