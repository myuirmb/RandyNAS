import Immutable from 'immutable';
import {
    SHOW_HIDDEN_MASK_FALSE,
    SHOW_HIDDEN_MASK_TRUE,
    SHOW_HIDDEN_DIALOG_FALSE,
    SHOW_HIDDEN_DIALOG_TRUE,
    SHOW_HIDDEN_LOGIN_FALSE,
    SHOW_HIDDEN_LOGIN_TRUE,
    CONTENT_SHOW_TYPE,
    MENU_INIT,
    GET_FILES,
    UPDATE_PROGRESS
} from '../actions/main';

const initState = Immutable.fromJS({
    dialog: false,
    login: false,
    mask: false,
    menu: null,
    showtype: 'block',    //block,list,
    progress: null
});

const actions = {
    [SHOW_HIDDEN_MASK_FALSE]: state => state.set('mask', false),
    [SHOW_HIDDEN_MASK_TRUE]: state => state.set('mask', true),
    [SHOW_HIDDEN_DIALOG_FALSE]: state => state.set('dialog', false),
    [SHOW_HIDDEN_DIALOG_TRUE]: state => state.set('dialog', true),
    [SHOW_HIDDEN_LOGIN_FALSE]: state => state.set('login', false),
    [SHOW_HIDDEN_LOGIN_TRUE]: state => state.set('login', true),
    [CONTENT_SHOW_TYPE]: (state, action) => state.set('showtype', Immutable.fromJS(action.data)),
    [MENU_INIT]: (state, action) => state.mergeDeep(Immutable.fromJS(action.data)),
    [GET_FILES]: (state, action) => state.merge(Immutable.fromJS(action.data)),
    [UPDATE_PROGRESS]: (state, action) => {
        // console.log('----------reducers--------->',Immutable.fromJS(action.data));
        return state.mergeDeep(Immutable.fromJS(action.data))
    }
};

export default function auth(state = initState, action = {}) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
}