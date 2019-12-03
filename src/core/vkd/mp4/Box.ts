import BaseBox from "./BaseBox";
import Stream from "../Stream";
import { IObject } from "../../../interface/IGeneral";
import MathUtils from "../../../utils/MathUtils";
import RuntimeLog from "../../../log/RuntimeLog";

class Box extends BaseBox {
    constructor() {
        super();
    }

    static MP4DecConfigDescrTag(stream: Stream) {
        let box = new Box();
        let size;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
        } else {
            size += 2
        }
        box.size = size;
        box.typeID = stream.readUint8();
        // 6 bits stream type,1 bit upstream flag,1 bit reserved flag
        box.streamUint = stream.readUint8();
        box.bufferSize = stream.readByte(3);
        box.maximum = stream.readUint32();
        box.average = stream.readUint32();
        box.subBox.push(Box.MP4DecSpecificDescrTag(stream));
        return box
    }

    static MP4DecSpecificDescrTag(stream: Stream) {
        let box = new Box();
        let size, dataSize;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
            dataSize = size - 5;
        } else {
            dataSize = size;
            size += 2;
        }
        box.size = size;
        let EScode: string[] = [];
        for (let i = 0; i < dataSize; i++) {
            EScode.push(Number(stream.readUint8()).toString(16).padStart(2, '0'));
        }
        box.EScode = EScode;
        delete box.subBox;
        return box;
    }

    static MP4ESDescrTag = function (stream: Stream) {
        let box = new Box();
        let size;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5
        } else {
            size += 2
        }
        box.size = size;
        box.esID = stream.readUint16();
        box.priority = stream.readUint8();
        box.subBox.push(Box.MP4DecConfigDescrTag(stream));
        box.subBox.push(Box.SLConfigDescriptor(stream));
        return box
    };

    static SLConfigDescriptor = (stream: Stream) => {
        let box = new Box();
        let size;
        box.type = stream.readUint8();
        size = stream.readUint8();
        if (size === 0x80) {
            box.extend = true;
            stream.skip(2);
            size = stream.readUint8() + 5;
        } else {
            size += 2
        }
        box.size = size;
        box.SL = stream.readUint8();
        delete box.subBox;
        return box;
    };

    /**
     * 递归查找指定类型box
     * @param root
     * @param {string} type
     * @param {Box[]} result
     */
    static findBox(root: IObject, type: string | number, result: Box[] = []): Box | Box[] {
        if (!root) return null;
        if (root.type !== type) {
            if (root && root.subBox) {
                let boxArray = root.subBox.filter((item: IObject) => item.type === type);
                if (boxArray.length) {
                    boxArray.forEach((item: Box) => {
                        result.push(item);
                    })
                } else {
                    root.subBox.forEach((item: IObject) => {
                        Box.findBox(item, type, result);
                    })
                }
            }
        } else {
            result.push(root as Box);
        }
        result.concat(result);
        return result.length > 1 ? result : result[0];
    }

    /**
     * 通过时间获取 sample
     * @param {IObject[]} stts
     * @param {number} timeScale
     * @param {number} time
     */
    static seekOrderSampleByTime(stts: IObject[], timeScale: number, time: number): IObject {
        let startTime: number = 0;
        let order: number = 0;
        let count: number = 0;
        let itemDuration: number = 0;
        stts.every((item: IObject) => {
            itemDuration = item.sampleCount * item.sampleDuration / timeScale;
            if (time <= startTime + itemDuration) {
                let _countInItem: number = Math.ceil((time - startTime) * timeScale / item.sampleDuration);
                order = count + _countInItem;
                startTime = startTime + _countInItem * item.sampleDuration / timeScale;
                return false
            } else {
                startTime += itemDuration;
                count += item.sampleCount;
                return true;
            }
        });
        return { order, startTime }
    }

    /**
     * 获取 trak duration
     * @param {Box} trak
     * @param {number} timeScale
     * @returns {string}
     */
    static seekTrakDuration(trak: Box, timeScale: number): string {
        if (!trak) return '0';
        let stts: Box = Box.findBox(trak, 'stts') as Box;
        let duration: number = 0;
        stts.entry.forEach((item: IObject) => {
            duration += item.sampleCount * item.sampleDuration;
        });
        return Number(duration / timeScale).toFixed(4);
    }

    /**
     * 获取第 order 片的 sample 时间和长度信息
     * @param {Box} stts
     * @param {Box} ctts
     * @param {number} order
     * @returns {IObject}
     */
    static seekSampleTime(stts: Box, ctts: Box, order: number): IObject {
        let time: number, duration: number = 0;
        let count: number = 0, startTime: number = 0;
        let offset: number = 0;
        stts.entry.every((item: IObject) => {
            duration = item.sampleDuration;
            if (order < count + item.sampleCount) {
                time = startTime + (order - count) * duration;
                return false
            } else {
                count += item.sampleCount;
                startTime += item.sampleCount * duration;
                return true;
            }
        });

        if (ctts) {
            let ct: number = 0;
            ctts.entry.every((item: IObject) => {
                ct += item.count;
                if (order < ct) {
                    offset = item.offset;
                    return false;
                } else {
                    return true;
                }
            })
        }

        if (!time) time = startTime + (order - count) * duration;

        return { time, duration, offset };
    }

    /**
     * 计算音视频数据在 mdat 中的偏移量
     * @param {Box} stsc
     * @param {Box} stco
     * @param {Box} stsz
     * @param {number} order
     * @param {number} mdatStart
     */
    static seekSampleOffset(stsc: Box, stco: Box, stsz: Box, order: number, mdatStart: number) {
        let chunkOffset = Box.stscOffset(stsc, order + 1);
        let result = (stco.entries as number[])[chunkOffset.chunk_index - 1] +
            MathUtils.sum.apply(null, (stsz.entries as number[]).slice(
                chunkOffset.samples_offset[0] - 1,
                chunkOffset.samples_offset[1] - 1)
            ) - mdatStart;

        if (result === undefined) {
            throw new Error(`result=${result},stco.length=${stco.entries.length},sum=${MathUtils.sum.apply(null, stsz.entries.slice(0, order))}`);
        } else if (result < 0) {
            throw new Error(`result=${result},stco.length=${stco.entries.length},sum=${MathUtils.sum.apply(null, stsz.entries.slice(0, order))}`);
        }

        return result;
    }

    /**
     * 计算音视频数据在 chunk 中的偏移量
     * @param {Box} stsc
     * @param {number} sample_order
     */
    static stscOffset(stsc: Box, sample_order: number): IObject {
        let chunk_index: number;
        let samples_offset: number[] = [];
        // 计算sample在第几组chunk中
        let chunk_start: IObject = (stsc.entries as IObject[]).filter((item: IObject) => {
            return item.first_sample <= sample_order && sample_order < item.first_sample + item.chunk_count * item.samples_per_chunk;
        })[0];

        //由于stsc默认的解析逻辑把最后一个chunk的count设置成了0 所以如果在前面的chunk中没能找到sample的偏移量 需要到最后一个chunk中再次查找
        if (!chunk_start) {
            let last_chunk: IObject = (stsc.entries as IObject[]).pop();
            (stsc.entries as IObject[]).push(last_chunk);
            let chunk_offset: number = Math.floor((sample_order - last_chunk.first_sample) / last_chunk.samples_per_chunk);
            let last_chunk_index: number = last_chunk.first_chunk + chunk_offset;
            let last_chunk_first_sample: number = last_chunk.first_sample + last_chunk.samples_per_chunk * chunk_offset;
            return {
                chunk_index: last_chunk_index,
                samples_offset: [last_chunk_first_sample, sample_order]
            }
        } else {
            //计算在本组第几个 chunk 中
            let chunk_offset: number = Math.floor((sample_order - chunk_start.first_sample) / chunk_start.samples_per_chunk);
            //计算 sample 偏移
            let chunk_offset_sample: number = chunk_start.first_sample + chunk_offset * chunk_start.samples_per_chunk;
            chunk_index = chunk_start.first_chunk + chunk_offset;
            samples_offset = [chunk_offset_sample, sample_order];
            return {
                chunk_index,
                samples_offset
            }
        }
    }

    /**
     * 解析header
     * @param {Stream} stream
     */
    readHeader(stream: Stream) {
        //header
        this._start = stream.position;
        this._size = stream.readUint32();
        this._type = String.fromCodePoint(stream.readUint8(), stream.readUint8(), stream.readUint8(), stream.readUint8());
        if (this._size === 1) {
            this._size = stream.readUint64();
        } else if (this._size === 0) {
            if (this._type !== 'mdat') {
                throw new Error('parse mp4 mdat Box failed');
            }
        }

        if (this._type === 'uuid') {
            let uuid = [];
            for (let i = 0; i < 16; i++) {
                uuid.push(stream.readUint8());
            }
        }
    }

    /**
     * 解析body
     * @param {Stream} stream
     */
    readBody(stream: Stream) {
        let endSize = this._size - stream.position + this._start;
        let type = this._type;
        this._data = stream.buffer.slice(stream.position, stream.position + endSize);
        stream.position += this._data.byteLength;
        if (BaseBox._boxList.find((item: string) => item === type)) {
            //容器box解析器
            this.parseContainerBox()
        } else {
            //内容box解析器
            if (typeof this[type] === 'function') {
                try {
                    (this[type] as Function).call(this);
                } catch (e) {
                    throw e;
                }
            } else {
                RuntimeLog.getInstance().warning(`mp4 cannot parse Box type ${type}`);
            }
        }
    }

    /**
     * 解析容器box
     */
    parseContainerBox() {
        let stream = new Stream(this._data);
        let size = stream.buffer.byteLength;
        while (stream.position < size) {
            let box = new Box();
            box.readHeader(stream);
            this._subBox.push(box);
            box.readBody(stream);
        }
        delete this._data;
        stream = null;
    }

    /**
     * 解析
     * @param {Stream} stream
     */
    read(stream: Stream) {
        this.readHeader(stream)
        this.readBody(stream)
    }

    /**
     * 释放trakbox 减小内存占用
     */
    freeTraksbox() {
        if (!this.subBox.length) return;
        this.subBox.forEach((item: BaseBox, idx:number) => {
            if(item.type === 'trak'){
                delete this.subBox[idx];
            }
        })
    }

}

export default Box