import Immutable from 'immutable';
import { AUTH_INIT, AUTH_LOGIN } from '../actions/auth';

const initState = Immutable.Map({
    // sign: false,    //false no need login(gu:true||ut:user)
    ud: 'fc55886c-6ec5-4f37-9521-863f0d281554',
    un: 'lucy',     //user name
    ut: 'guest',    //user type(guest,user,root)
    gu: true        //guest true:yes，false:no
});

const actions = {
    [AUTH_INIT]: (state, action) => state.merge(action.data),
    [AUTH_LOGIN]: (state, action) => {
        console.log(action);
        return state.merge(action.data);
    }
};

export default function auth(state = initState, action = {}) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
}