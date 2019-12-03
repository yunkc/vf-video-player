/**
 * m3u8解析类
 */
import * as EventEmitter from 'eventemitter3';
import HTTPLoader from '../HTTPLoader';
import { IObject } from '../../../interface/IGeneral';
import EventCenter from '../../../events/EventCenter';
import { EventLevel } from '../../../events/EventLevel';
import { ErrorTypeList } from '../../../config/ErrorTypeList';

class M3U8 extends EventEmitter {
    static Tag = {
        EXTM3U: /^#EXTM3U/,
        TYPE: /#EXT-X-PLAYLIST-TYPE:(\w+)/,
        EXTINF: /#EXTINF:(\d+\.?\d*)(?:,(?:[^\r|\n]*)(?:\r|\n)*)(.*(?!#))/g,
        DURATION: /#EXT-X-TARGETDURATION:(\d+\.?\d*)/,
        SEQUENCE: /#EXT-X-MEDIA-SEQUENCE:(\d+)/,
        ENDLIST: /#EXT-X-ENDLIST/,
        VERSION: /#EXT-X-VERSION:(\d+)/,
        STREAM: /#EXT-X-STREAM-INF:(\w+=\w+)+/
    }

    private _url: string = '';
    private _segments: IObject[] = [];
    private _type: string = 'live';
    private _isEnd: boolean = false;
    private _retry: number = 0;
    private _retryMax: number = 10;

    get segments(): IObject[] {
        return this._segments
    }

    set segments(value: IObject[]) {
        this._segments = value;
    }

    constructor(url: string) {
        super();
        this._url = url;
        this.init();
    }

    /**
     * 初始化
     */
    private init() {
        this.fetch(this._url)
            .then((res: IObject) => {
                this._type = res.meta.TYPE.toLocaleLowerCase();
                this._isEnd = res.meta.ENDLIST;
                res.segments.forEach((item: IObject) => {
                    this._segments.push(item);
                })
                this.emit('ready');
            })
            .catch(() => {
                this._segments.length = 0;
                this._retry++;
                if (this._retry < this._retryMax) {
                    EventCenter.getInstance().dispatchOutwardEvent('PlayerError', {
                        code: ErrorTypeList.PLAYER_CORE_M3U8_ERROR,
                        level: EventLevel.ERROR,
                        target: this,
                        message: `m3u8 file download fail, now retry times: ${this._retry}`,
                        data: null
                    });
                    this.init();
                }
            })
    }

    /**
     * 下载并解析m3u8文件
     * @param url 
     */
    private fetch(url: string) {
        let meta: IObject = {
            TYPE: 'LIVE',
            ENDLIST: ''
        }
        let segments: IObject = [];
        let _start = 0;
        return new Promise((resolve, reject) => {
            let _loader = new HTTPLoader({
                url: this._url,
                type: null
            });
            _loader.start().then((res: XMLHttpRequest) => {
                let ctx = res.responseText;
                if (ctx) {
                    const metaCtx = ctx.substring(0, ctx.indexOf('#EXTINF'));
                    const endList = ctx.substring(ctx.lastIndexOf('#EXTINF'));
                    const Tag: IObject = M3U8.Tag;
                    const EXTINFItem = new RegExp(Tag.EXTINF.source);
                    Object.keys(Tag).forEach((key) => {
                        if (key !== '#EXTINF' && Tag[key].test(metaCtx) || Tag[key].test(endList)) {
                            meta[key] = RegExp.$2 ? [RegExp.$1, RegExp.$2] : RegExp.$1 || true
                        }
                    })
                    ctx.match(Tag.EXTINF).forEach((item, idx) => {
                        if (EXTINFItem.test(item)) {
                            let _time = +RegExp.$1;
                            let _title = RegExp.$2;
                            let _url = M3U8.resolve(url, _title);
                            let _tempItem: IObject = {
                                idx,
                                duration: _time,
                                title: _title,
                                downloaded: false,
                                url: _url,
                            }
                            _tempItem.start = _start;
                            // _start = NormalUtils.printFn(_start + _time);
                            _start = _start + _time;
                            _tempItem.end = _start;
                            segments.push(_tempItem);
                        }
                    })

                    if (+meta['SEQUENCE'] === 0 && meta['ENDLIST']) {
                        meta.TYPE = 'VOD';
                    }

                    resolve({ meta, segments })
                } else {
                    reject(new Error('m3u8 parse error'));
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * 转换相对路径
     * @param base 
     * @param url 
     */
    static resolve(base: string, url: string) {
        let result: string[] = [];
        let a = document.createElement('a');
        a.href = base;
        let b = url;
        let aArr = a.pathname.replace(/^\/+/, '').split('/'); // 过滤/符号开始的字符串并以/分割
        let bArr = b.split('/');
        aArr.pop(); // 删除.m3u8结尾文件名

        //查找路径
        let find = () => {
            switch (bArr[0]) {
                case '':
                    result = bArr.slice(1);
                    break;
                case '.':
                    result = aArr.concat(bArr.slice(1));
                    break;
                case '..':
                    bArr.shift();
                    if (aArr.length) {
                        aArr.pop();
                        find();
                    } else {
                        EventCenter.getInstance().dispatchOutwardEvent('PlayerError', {
                            code: ErrorTypeList.PLAYER_CORE_M3U8_ERROR,
                            level: EventLevel.ERROR,
                            target: this,
                            message: `cannot resolve path in m3u8, base: ${base}|url: ${url}`,
                            data: null
                        });
                    }
                    break;
                default:
                    result = aArr.concat(bArr);
                    break;
            }
        }
        find();

        let _result: string = '';
        if (result.length) {
            _result = a.protocol + '//' + a.host + '/' + result.join('/')
        } else {
            _result = a.href;
        }
        return _result;
    }

}

export default M3U8;