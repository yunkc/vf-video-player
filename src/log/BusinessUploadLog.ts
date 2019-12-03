/**
 * 业务上报日志 TODO
 */

let _instance: BusinessUploadLog;
export default class BusinessUploadLog {
    constructor(sign: any) {
        if (sign !== PrivateClass) {
            console.error('class BusinessUploadLog is singleton, do not use new operator!');
            return;
        }
    }

    static getInstance() {
        if (!_instance) {
            _instance = new BusinessUploadLog(PrivateClass);
        }
        return _instance;
    }


}

class PrivateClass {
    //内部类
}
