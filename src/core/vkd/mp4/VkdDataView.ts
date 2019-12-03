/**
 * 扩展DataView
 */

class VkdDataView implements DataView {
    [Symbol.toStringTag]: string;

    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    get buffer(): ArrayBuffer {
        return this._dataView.buffer;
    }

    get byteOffset(): number {
        return this._dataView.byteOffset;
    }

    get byteLength(): number {
        return this._dataView.byteLength;
    }

    private _position: number = 0;
    private _dataView: DataView = null;

    constructor(buffer: ArrayBuffer, offset?: number, length?: number) {
        this._dataView = new DataView(buffer, offset, length);
    }

    setBigUint64(byteOffset: number, value: bigint, littleEndian?: boolean): void {
        this._dataView.setBigUint64(byteOffset, value, littleEndian);
    }

    setBigInt64(byteOffset: number, value: bigint, littleEndian?: boolean): void {
        this._dataView.setBigInt64(byteOffset, value, littleEndian);
    }

    setUint32(byteOffset: number, value: number, littleEndian?: boolean): void {
        this._dataView.setUint32(byteOffset, value, littleEndian);
    }

    setUint16(byteOffset: number, value: number, littleEndian?: boolean): void {
        this._dataView.setUint16(byteOffset, value, littleEndian);
    }

    setUint8(byteOffset: number, value: number): void {
        this._dataView.setUint8(byteOffset, value);
    }

    setInt32(byteOffset: number, value: number, littleEndian?: boolean): void {
        this._dataView.setInt32(byteOffset, value, littleEndian);
    }

    setInt16(byteOffset: number, value: number, littleEndian?: boolean): void {
        this._dataView.setInt16(byteOffset, value, littleEndian);
    }

    setInt8(byteOffset: number, value: number): void {
        this._dataView.setInt8(byteOffset, value);
    }

    setFloat64(byteOffset: number, value: number, littleEndian?: boolean): void {
        this._dataView.setFloat64(byteOffset, value, littleEndian);
    }

    setFloat32(byteOffset: number, value: number, littleEndian?: boolean): void {
        return this._dataView.setFloat32(byteOffset, value, littleEndian);
    }

    getBigUint64(byteOffset: number, littleEndian?: boolean): bigint {
        return this._dataView.getBigUint64(byteOffset, littleEndian);
    }

    getBigInt64(byteOffset: number, littleEndian?: boolean): bigint {
        return this._dataView.getBigInt64(byteOffset, littleEndian);
    }

    getUint32(byteOffset: number, littleEndian?: boolean): number {
        return this._dataView.getUint32(byteOffset, littleEndian);
    }

    getUint16(byteOffset: number, littleEndian?: boolean): number {
        return this._dataView.getUint16(byteOffset, littleEndian);
    }

    getUint8(byteOffset: number): number {
        return this._dataView.getUint8(byteOffset);
    }

    getInt32(byteOffset: number, littleEndian?: boolean): number {
        return this._dataView.getInt32(byteOffset, littleEndian);
    }

    getInt16(byteOffset: number, littleEndian?: boolean): number {
        return this._dataView.getInt16(byteOffset, littleEndian);
    }

    getInt8(byteOffset: number): number {
        return this._dataView.getInt8(byteOffset);
    }

    getFloat64(byteOffset: number, littleEndian?: boolean): number {
        return this._dataView.getFloat64(byteOffset, littleEndian);
    }

    getFloat32(byteOffset: number, littleEndian?: boolean): number {
        return this._dataView.getFloat32(byteOffset, littleEndian);
    }
}

export default VkdDataView;