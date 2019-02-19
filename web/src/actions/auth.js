import Request from '../service/request';
import Config from '../config';
import { initLogin, didLogin } from './main';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_ERROR_CLEAR = 'AUTH_ERROR_CLEAR';

export function authInit(data) {
    return { type: AUTH_INIT, data };
}

export function authLogin(data) {
    return { type: AUTH_LOGIN, data };
}

export function authErrorClear(data) {
    return { type: AUTH_ERROR_CLEAR, data };
}

export function reqAuthInit() {
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('init', getState);
        const req = new Request({ ...opt });
        req.on('success', (res, status, xhr) => {
            dispatch(authInit(res.data));
            dispatch(initLogin(res.data));
        });
        req.send();
    }
}

export function reqAuthLogin(params) {
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('login', getState);
        const req = new Request({ ...opt, ...params });
        req.on('success', (res, status, xhr) => {
            dispatch(authLogin(res.data));
            dispatch(didLogin(res.data));
        });
        req.send();
    }
}