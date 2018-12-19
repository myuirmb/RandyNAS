import service from '../service';

export const SHOW_HIDDEN_LOGIN_TRUE = 'SHOW_HIDDEN_LOGIN_TRUE';
export const SHOW_HIDDEN_LOGIN_FALSE = 'SHOW_HIDDEN_LOGIN_FALSE';

export const SHOW_HIDDEN_MASK_TRUE = 'SHOW_HIDDEN_MASK_TRUE';
export const SHOW_HIDDEN_MASK_FALSE = 'SHOW_HIDDEN_MASK_FALSE';

export function showLogin() {
    return { type: SHOW_HIDDEN_LOGIN_TRUE };
}

export function hiddenLogin() {
    return { type: SHOW_HIDDEN_LOGIN_FALSE };
}

export function showMask() {
    return { type: SHOW_HIDDEN_MASK_TRUE };
}

export function hiddenMask() {
    return { type: SHOW_HIDDEN_MASK_FALSE };
}
