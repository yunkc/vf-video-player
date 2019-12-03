import TSPackage from './TSPackage';
import { IObject } from '../../../interface/IGeneral';
/**
 * ts文件流解析类
 */
import TypedArray = NodeJS.TypedArray;
import TSPackagePAT from './ts/TSPackagePAT';
import TSPackageAdaptationField from './ts/TSPackageAdaptationField';

const TS_PACKAGE_LENGTH: number = 188;

class TSStreamParser {
    private _buffer: ArrayBuffer = null;
    private _tsPackageArr: TSPackage[] = [];
    constructor(stream: ArrayBuffer) {
        this._buffer = stream;
        this.sliceBuffer();
    }

    /**
     * 将TS流分割为TS包
     */
    private sliceBuffer() {
        let _count: number = 0;
        let _bufferLength: number = this._buffer.byteLength;
        while (_count < _bufferLength) {
            this._tsPackageArr.push(new TSPackage(this._buffer.slice(_count, _count + TS_PACKAGE_LENGTH)));
            _count += TS_PACKAGE_LENGTH;
        }
        delete this._buffer;
    }

    get pat(): TSPackage[] {
        return this._tsPackageArr.filter((item: TSPackage) => item.header.pid === 0);
    }

    get pmt(): TSPackage[] {
        let pat = this.pat, list: number[] = [];
        pat.forEach((item: TSPackage) => {
            (item.body as TSPackagePAT).list.forEach((sub: IObject) => {
                list.push(sub.pid)
            })
        })
        return this._tsPackageArr.filter((item: TSPackage) => list.some(b => b === item.header.pid));
    }

    get pes(): TSPackage[][] {
        let _pmt = this.pmt, _pidArr: number[] = [];
        let _pes: TSPackage[][] = [];
        _pmt.forEach((item) => {
            _pidArr = _pidArr.concat((item.body as IObject).list.map((b: IObject) => { return b.pid }));
        })
        let _ts = this._tsPackageArr,
            _length = _ts.length,
            _cur: TSPackage,
            _tempGroup: TSPackage[] = [];


        for (let i = 0; i < _length; i++) {
            _cur = _ts[i];
            if (_pidArr.indexOf(_cur.header.pid) > -1) {
                // if ((_cur.body as TSPackageAdaptationField).type === 'video') {
                //     this.assemblyES(_cur, 'video');
                // } else if ((_cur.body as TSPackageAdaptationField).type === 'audio') {
                //     this.assemblyES(_cur);
                // }

                //有效载荷单元起始指示符为1 说明下一帧开始
                if (_cur.header.payload === 1) {
                    _tempGroup = [];
                    _tempGroup.push(_cur);
                    _pes.push(_tempGroup);
                } else if (_tempGroup.length === 0) {
                    _pes.push([_cur])
                } else {
                    _tempGroup.push(_cur);
                }
            }
        }

        return _pes;
    }
}

export default TSStreamParser;