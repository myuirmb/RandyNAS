import service from '../service';

export const SHOW_HIDDEN_MASK_TRUE = 'SHOW_HIDDEN_MASK_TRUE';
export const SHOW_HIDDEN_MASK_FALSE = 'SHOW_HIDDEN_MASK_FALSE';

export const SHOW_HIDDEN_DIALOG_TRUE = 'SHOW_HIDDEN_DIALOG_TRUE';
export const SHOW_HIDDEN_DIALOG_FALSE = 'SHOW_HIDDEN_DIALOG_FALSE';

export const SHOW_HIDDEN_LOGIN_TRUE = 'SHOW_HIDDEN_LOGIN_TRUE';
export const SHOW_HIDDEN_LOGIN_FALSE = 'SHOW_HIDDEN_LOGIN_FALSE';

export const MENU_INIT = 'MENU_INIT';

export function showMask() {
    return { type: SHOW_HIDDEN_MASK_TRUE };
}

export function hiddenMask() {
    return { type: SHOW_HIDDEN_MASK_FALSE };
}

export function showDialog() {
    return { type: SHOW_HIDDEN_DIALOG_TRUE };
}

export function hiddenDialog() {
    return { type: SHOW_HIDDEN_DIALOG_FALSE };
}

export function showLogin() {
    return { type: SHOW_HIDDEN_LOGIN_TRUE };
}

export function hiddenLogin() {
    return { type: SHOW_HIDDEN_LOGIN_FALSE };
}

export function menuInit(data) {
    return { type: MENU_INIT, data };
}

export function reqMenuInit(pid) {
    return (dispatch, getState) => {
        const token = getState().get('auth').get('tk');
        service('menu', token, pid).then(res => {
            dispatch(menuInit(res));
        });
    }
}

export function initLogin(res) {
    return dispatch => {
        // if (!res.get('gu') && res.get('ut') === 'guest') {
        if (!res.gu && res.ut === 'guest') {
            dispatch(showMask());
            dispatch(showDialog());
            dispatch(showLogin());
        }
        else {
            dispatch(hiddenMask());
            dispatch(hiddenDialog());
            dispatch(hiddenLogin());
        }
    }
}

export function didLogin(res) {
    return dispatch => {
        if (res.get('ud')) {
            dispatch(hiddenMask());
            dispatch(hiddenDialog());
            dispatch(hiddenLogin());
        }
    }
}