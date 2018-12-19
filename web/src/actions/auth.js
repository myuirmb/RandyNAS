import service from '../service';

export const AUTH_INIT = 'AUTH_INIT';



export function authInit(data) {
    return { type: AUTH_INIT, data };
}

export function reqAuthInit() {
    return (dispatch, getState) => {
        const token = getState().get('auth').get('tk');
        service('init', token).then(res => {
            dispatch(authInit(res));
        });
    }
}