//import axios from 'axios';
import service from '../service';

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const LOG_GET_DATA = 'LOG_GET_DATA';

export function login() {
    return { type: LOG_IN };
}

export function logout() {
    return { type: LOG_OUT };
}

export function logData(data) {
    return { type: LOG_GET_DATA, data };
}

export function getData() {
    // return dispatch => {
    //     axios.get('/api').then(res => {
    //         dispatch(logData(res.data));
    //     });
    // };

    // let res=await service({url:'/api'});
    // dispatch(logData(res.data));

    return (dispatch, getState) => {
        const token = getState().get('login').get('tk');
        service('init', token).then(res => {
            console.log(res);
            dispatch(logData(res));
        });
    }
}