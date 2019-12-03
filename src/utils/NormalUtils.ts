/**
 * 工具类
 */
import { IObject } from "../interface/IGeneral";
import TypedArray = NodeJS.TypedArray;
// import { format } from 'mathjs';
interface MyArrayBuffer extends ArrayBuffer {
    [key: number]: any
}

export default class NormalUtils {
    constructor() {
    }

    /**
     * 合并两个object， 返回合并后的object
     * @param {object} objA
     * @param {object} objB
     * @returns {object}
     */
    static mergeObj(objA: object, objB: object): object {
        let _tempObj: object;
        _tempObj = { ...objA, ...objB };
        return _tempObj
    }

    /**
     * 判断是否为微信浏览器环境
     * @returns {boolean}
     */
    static is_weixin() {
        let ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') != -1;
    }

    /**
     * 判断是否为苹果操作系统
     */
    static is_iOS() {
        let ua = navigator.userAgent;
        return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }

    /**
     * 解析路径或文件名中的文件扩展
     * @param {string} url
     * @returns {string[]}
     */
    static parseExtended(url: string) {
        let _tempUrl: string = url;
        let pattern: RegExp = /\.\w{2,4}/ig;
        return _tempUrl.match(pattern).pop().toString();
    }

    /**
     * 类型判断
     * @param obj
     * @returns {any}
     */
    static typeOf(obj: any) {
        return Object.prototype.toString.call(obj).match(/([^\s.*]+)(?=]$)/g)[0]
    }

    /**
     * 创建dom
     * @param {HTMLElement} el
     * @param {string} tpl
     * @param {{}} attrs
     * @param {string} cname
     */
    static createDom(el = 'div', tpl = '', attrs: IObject, cname = ''): HTMLElement {
        let dom: HTMLElement = document.createElement(el);
        dom.className = cname;
        dom.innerHTML = tpl;
        Object.keys(attrs).forEach(item => {
            let key = item;
            let value = attrs[item];
            if (el === 'video' || el === 'audio') {
                if (value) {
                    dom.setAttribute(key, value)
                }
            } else {
                dom.setAttribute(key, value)
            }
        });
        return dom
    }

    /**
     * 生成符合 RFC4122 标准的 UUID
     * @returns {string}
     */
    static generateUUID(): string {
        let lut: string[] = [];
        for (let i: number = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }

        let d0 = Math.random() * 0xffffffff | 0;
        let d1 = Math.random() * 0xffffffff | 0;
        let d2 = Math.random() * 0xffffffff | 0;
        let d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    /**
     * 拼接两个或多个类型化数组
     * @param constructorFn
     * @param {any[]} arrays
     */
    static concatTypedArray<T extends TypedArray>(constructorFn: new (length: number) => T, ...arrays: any[]) {
        let totalLength: number = 0;
        for (const arr of arrays) {
            totalLength += arr.length;
        }
        const result = new constructorFn(totalLength);
        let offset: number = 0;
        for (const arr of arrays) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    /**
     * 拼接Uint8Array
     * @param constructorFn
     * @param {any[]} arrays
     */
    static concatUint8Array(...arrays: Uint8Array[]) {
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
     * 过滤字符串中的空格
     * @param str 
     */
    static strSpaceFilter(str: string) {
        return str = str.replace(/\s+/g, "");
    }

    /**
     * 解决多位小数精度问题
     */
    // static printFn(value: number) {
    //     const precision = 14;
    //     return Number(format(value, precision));
    // }

    /**
     * 节流器
     */
    static throttle(cb: Function, duration: number = 500): Function {
        let lastTime = new Date().getTime();
        return () => {
            let now = new Date().getTime();
            if (now - lastTime > duration) {
                cb();
                lastTime = now;
            }
        }
    }
}