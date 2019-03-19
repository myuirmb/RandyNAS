import Events from './events';

class Request extends Events {
    constructor(options) {
        super();

        const defopt = {
            url: '/',
            type: 'post',
            dataType: 'json',
            async: true, //  boolean true:异步请求 false:同步请求 required
        };
        let opt = {};
        Object.assign(opt, defopt, options);

        this.options = opt;
        this.xhr = new XMLHttpRequest();

        this.init();
    }

    init() {
        this.xhr.addEventListener('loadstart', this.before.bind(this));
        this.xhr.addEventListener('progress', this.prog.bind(this));
        this.xhr.addEventListener('load', this.success.bind(this));
        this.xhr.addEventListener('loadend', this.complete.bind(this));
        this.xhr.addEventListener('error', this.err.bind(this));

        // this.xhr.upload.addEventListener('loadstart', this.ulbefore.bind(this));
        this.xhr.upload.addEventListener('progress', this.ulprog.bind(this));
        // this.xhr.upload.addEventListener('load', this.ulsuccess.bind(this));
        // this.xhr.upload.addEventListener('loadend', this.ulcomplete.bind(this));
        // this.xhr.upload.addEventListener('error', this.ulerr.bind(this));

        this.xhr.open(this.options.type, this.options.url, this.options.async);
        this.xhr.responseType = this.options.dataType;
        if (this.options.hasOwnProperty('headers')) {
            for (const key of Object.keys(this.options.headers)) {
                this.xhr.setRequestHeader(key, this.options.headers[key]);
            }
        }
    }

    before(e) {
        // console.log(e);
        this.emit('before', e, this.xhr);
    }

    prog(e) {
        // console.log('request.prog',e);
        this.emit('progress', e, this.xhr);
    }

    ulprog(e) {
        this.emit('ulprogress', e, this.xhr);
    }

    success(e) {
        if (this.xhr.status >= 200 && this.xhr.status < 300 || this.xhr.status === 304) {
            let resault = null;
            if (this.xhr.responseType === 'text') resault = this.xhr.responseText;
            else if (this.xhr.responseType === 'document') resault = this.xhr.responseXML;
            else resault = this.xhr.response;

            // if (this.options.dataType === 'json') {
            //     try { resault = JSON.parse(resault); }
            //     catch (e) { throw e; }
            // }
            this.emit('success', resault, this.xhr.status, this.xhr);
        }
        else {
            this.err(e);
        }
    }

    complete(e) {
        this.emit('complete', this.xhr, this.xhr.status);
    }

    err(e) {
        this.emit('error', this.xhr, this.xhr.status, e);
    }


    send(data) {
        let fd = new FormData();
        if (this.options.hasOwnProperty('data')) {
            Object.keys(this.options.data).forEach((item, key) => {
                fd.append(item, this.options.data[item]);
            });
        }
        if (data && typeof data === 'object') {
            Object.keys(data).forEach((item, key) => {
                fd.append(item, data[item]);
            });
        }
        this.xhr.send(fd);
    }
}

export default Request;