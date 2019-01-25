import axios from 'axios';
import Immutable from 'immutable';
import conf from '../config';

const contentTypes = {
    form: 'multipart/form-data',
    json: 'application/json;charset=utf-8',
};

const responseTypes = {
    json: 'json',
    stream: 'blob',
};

const cfg = {
    method: 'post',
    baseUR: conf.service.url,
    headers: { 'Content-Type': contentTypes.json },
    responseType: responseTypes.json
};

// axios.interceptors.request.use((req) => {
//     console.log('---axios.interceptors.request---', req);
//     return req;
// }, (err) => {
//     return Promise.reject(err);
// });
// axios.interceptors.response.use((res) => {
//     return res;
// }, (err) => {
//     return Promise.reject(err);
// });

const service = (url, token, obj = {}) => {
    const req = {};
    Object.assign(
        req,
        cfg,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {},
        { url: `/api/${conf.service.interface[url]}` },
        obj
    );

    return axios(req).then(res => {
        if (res.data.code && res.data.code === 200) return Immutable.fromJS(res.data.data);
        else return Promise.reject(res);
    }).catch(e => {
        throw e
    });
}

export default service;
