import axios from 'axios';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const LOG_GET_DATA = 'LOG_GET_DATA';

export function login() {
    return { type: LOG_IN };
}

export function logout() {
    return { type: LOG_OUT };
}

export function logGetData(data) {
    return { type: LOG_GET_DATA, data };
}

export function getData() {
    return dispatch => {
        axios.get('/').then(res => {
            dispatch(logGetData(res.data));
        });
    };
}