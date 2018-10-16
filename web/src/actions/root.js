export const ADD_NUM = 'ADD_NUM';
export const JAN_NUM = 'JAN_NUM';

export function addNum() {
    return { type: ADD_NUM };
};

export function janNum() {
    return { type: JAN_NUM };
};

export function addNumAsync() {
    return dispatch => {
        setTimeout(() => {
            dispatch(addNum());
        }, 1900);
    };
};