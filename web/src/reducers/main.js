import Immutable from 'immutable';
import {
    SHOW_HIDDEN_MASK_FALSE,
    SHOW_HIDDEN_MASK_TRUE,
    SHOW_HIDDEN_DIALOG_FALSE,
    SHOW_HIDDEN_DIALOG_TRUE,
    SHOW_HIDDEN_LOGIN_FALSE,
    SHOW_HIDDEN_LOGIN_TRUE
} from '../actions/main';

const initState = Immutable.Map({
    dialog: false,
    login:false,
    mask: false
});

const actions = {
    [SHOW_HIDDEN_MASK_FALSE]: state => state.set('mask', false),
    [SHOW_HIDDEN_MASK_TRUE]: state => state.set('mask', true),
    [SHOW_HIDDEN_DIALOG_FALSE]: state => state.set('dialog', false),
    [SHOW_HIDDEN_DIALOG_TRUE]: state => state.set('dialog', true),
    [SHOW_HIDDEN_LOGIN_FALSE]: state => state.set('login', false),
    [SHOW_HIDDEN_LOGIN_TRUE]: state => state.set('login', true)
};

export default function auth(state = initState, action = {}) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
}