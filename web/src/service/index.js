import axios from 'axios';
import Immutable from 'immutable';
import conf from '../config';

const contentTypes = {
    form: 'multipart/form-data',
    json: 'application/json',
};

const responseTypes = {
    json: 'json',
    stream: 'blob',
};

const cfg = {
    method: 'get',
    baseUR: conf.service.url,
    headers: {'Content-Type':contentTypes.json},
    responseType: responseTypes.json
};

const service = (obj) => {
    const req = {};
    Object.assign(req, cfg, obj);
    return axios(req).then(res=>Immutable.fromJS(res.data)).catch(e=>{throw e});
}

export default service;
