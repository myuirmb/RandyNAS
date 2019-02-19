class Events {
    constructor() {
        this.handles = {};
    }

    // 订阅事件
    on(eventType, handle) {
        if (typeof eventType === 'string') {
            if (!this.handles.hasOwnProperty(eventType)) {
                this.handles[eventType] = [];
            }
            if (typeof handle === 'function') {
                this.handles[eventType].push(handle);
            } else {
                // throw new Error('need callback.');
            }
        }
        else if (typeof eventType === 'object') {
            Object.keys(eventType).forEach((item, key, arr) => {
                if (!this.handles.hasOwnProperty(item)) {
                    this.handles[item] = [];
                }
                if (typeof eventType[item] === 'function') {
                    this.handles[item].push(eventType[item]);
                } else {
                    // throw new Error('need callback...');
                }
            });
        }
        return this;
    }

    // 发布事件
    emit(eventType, ...args) {
        if (this.handles.hasOwnProperty(eventType)) {
            this.handles[eventType].forEach((item, key, arr) => {
                item.apply(null, args);
            })
        } else {
            // throw new Error(`${eventType} not reg.`);
        }
        return this;
    }

    // 删除事件
    off(eventType, handle = null) {
        if (!this.handles.hasOwnProperty(eventType)) {
            // throw new Error(`${eventType} not reg`);
        }
        else if (typeof handle !== 'function') {
            // throw new Error('need callback.');
            this.handles[eventType] = null;
        }
        else {
            this.handles[eventType].forEach((item, key, arr) => {
                if (item === handle) {
                    arr.splice(key, 1);
                }
            })
        }

        return this; // 实现链式操作
    }
}


export default Events;