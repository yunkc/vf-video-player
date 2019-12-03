import { IObject } from '../../interface/IGeneral';
import NormalUtils from '../../utils/NormalUtils';
import EventCenter from '../../events/EventCenter';
import { EventLevel } from '../../events/EventLevel';
import { ErrorTypeList } from '../../config/ErrorTypeList';
/**
 * m3u8下载器
 */
class HTTPLoader {
    private _loader: XMLHttpRequest = null;

    private _opts: IObject = {
        url: '',
        method: 'GET',
        type: 'arraybuffer',
        data: {},
        fileType: 'm3u8'
    }

    constructor(opts: IObject) {
        this._opts = NormalUtils.mergeObj(this._opts, opts);
    }

    /**
     * 开始下载 下载数据单位为字节
     */
    public start(start?: number, end?: number) {
        return new Promise((resolve, reject) => {
            let _loader = new XMLHttpRequest();
            let _method = (this._opts.method as string).toUpperCase();
            let _data = [];
            let _isMP4 = this._opts.fileType === 'mp4' ? true : false;

            if (this._opts.type !== null) {
                _loader.responseType = this._opts.type;
            }

            for (let key in this._opts.data) {
                _data.push(`${key}=${this._opts.data[key]}`);
            }
            if (_method === 'GET') {
                if (_isMP4) {
                    _loader.open(_method, this._opts.url);
                    let _range: string = `bytes=${start}-${end ? end : ''}`;
                    _loader.setRequestHeader('Range', _range);
                } else {
                    _loader.open(_method, `${this._opts.url}?${_data.join('&')}`);
                }
                _loader.send();
            } else if (_method === 'POST') {
                _loader.open(_method, this._opts.url);
                _loader.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                if (_isMP4) {
                    let _range: string = `bytes=${start}-${end ? end : ''}`;
                    _loader.setRequestHeader('Range', _range);
                }
                _loader.send(_data.join('&'));
            } else {
                EventCenter.getInstance().dispatchOutwardEvent('PlayerError', {
                    code: ErrorTypeList.TASK_PARAMS_ERROR,
                    level: EventLevel.ERROR,
                    target: this,
                    message: `loader method error, current type is ${_method}`,
                    data: null
                })
            }

            _loader.onload = () => {
                if (_loader.status === 200 || _loader.status === 206) {
                    resolve(_loader);
                } else {
                    reject(new Error('onload status error.'));
                }
            }

            _loader.onerror = (e: any) => {
                reject(new Error(`onerror trigger, e: ${e}`));
            }
            this._loader = _loader;
        })
    }

    /**
     * 取消下载
     */
    public abort() {
        this._loader.abort();
    }
}

export default HTTPLoader