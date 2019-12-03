/**
 * ts包header包头解析类
 */
import Stream from '../../Stream';

class TSPackageHeader {
    private _stream: Stream = null;
    private _sync: number = -1;
    private _error: number = -1;
    private _payload: number = -1;
    private _priority: number = -1;
    private _pid: number = -1;
    private _scrambling: number = -1;
    private _adaptation: number = -1;
    private _continuity: number = -1;
    private _packet: string = '';

    get pid(): number {
        return this._pid;
    }

    get payload(): number {
        return this._payload;
    }

    get packet(): string {
        return this._packet;
    }

    set packet(value: string) {
        this._packet = value;
    }

    get adaptation(): number {
        return this._adaptation;
    }

    constructor(stream: Stream) {
        this._stream = stream;
        this._sync = this._stream.readUint8();
        let next = this._stream.readUint16();
        this._error = next >>> 15;
        this._payload = next >>> 14 & 1;
        this._priority = next >>> 13 & 1;
        this._pid = next & 0x1fff;
        next = this._stream.readUint8();
        this._scrambling = next >> 6 & 0x3; //传输加扰控制, 00表示不加密

        /**
         * 00 ISO/IEC未来使用保留
         * 01 没有调整字段，仅含有184B有效净荷
         * 02 没有有效净荷，仅含有183B调整字段
         * 03 0~182B调整字段后为有效净荷
         */
        this._adaptation = next >> 4 & 0x3;
        this._continuity = next & 0xf;
        this._packet = this._pid === 0 ? 'PAT' : 'MEDIA';
    }
}

export default TSPackageHeader;