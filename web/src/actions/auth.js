import service from '../service';
import { initLogin } from './main';

export const AUTH_INIT = 'AUTH_INIT';
export const AUTH_LOGIN = 'AUTH_LOGIN';

export function authInit(data) {
    return { type: AUTH_INIT, data };
}

export function authLogin(data) {
    return { type: AUTH_LOGIN, data };
}

export function reqAuthInit() {
    return (dispatch, getState) => {
        const token = getState().get('auth').get('tk');
        service('init', token).then(res => {
            dispatch(authInit(res));
            dispatch(initLogin(res));
        });
    }
}

export function reqAuthLogin(user) {
    return (dispatch, getState) => {
        const token = getState().get('auth').get('tk');
        service('login', token, user).then(res => {
            dispatch(authLogin(res));
        });
    }
}