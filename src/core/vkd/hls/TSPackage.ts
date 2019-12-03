/**
 * TS包解析器
 */

import { IObject } from '../../../interface/IGeneral';
import Stream from '../Stream';
import TSPackageHeader from './ts/TSPackageHeader';
import TSPackageBody from './ts/TSPackageBody';
import BasePES from './ts/BasePES';

class TSPackage {
    private _buffer: Stream = null;
    private _header: TSPackageHeader = null;
    private _body: BasePES = null;

    get header(): TSPackageHeader {
        return this._header;
    }

    get body(): BasePES {
        return this._body;
    }

    constructor(buffer: ArrayBuffer) {
        this._buffer = new Stream(buffer);
        this._header = new TSPackageHeader(this._buffer);
        this._body = new TSPackageBody(this._buffer, this._header).createInstance();
    }

}
export default TSPackage