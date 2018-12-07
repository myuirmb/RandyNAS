import Immutable from 'immutable';
import { LOG_IN, LOG_OUT, LOG_GET_DATA } from '../actions/login';

// const initState = { login: false, user: 'lucy',data:'nihao...' };

// const actions = {
//     [LOG_IN]: state => ({ ...state, login: true }),
//     [LOG_OUT]: state => ({ ...state, login: false }),
//     [LOG_GET_DATA]: (state, action) => ({ ...state, data: action.data })
// };

// export default function login(state = initState, action = {}) {
//     const fn = actions[action.type];
//     return fn ? fn(state, action) : state;
// }

const initState = Immutable.Map({
    sign: false,
    ud: 'fc55886c-6ec5-4f37-9521-863f0d281554',
    un: 'lucy',     //user name
    ut: 'guest',    //user type(guest,user,root)
    gu: true,       //guest true:支持匿名登录，false:不支持匿名登录
    token: '',
    data: 'nihao...'
});

const actions = {
    [LOG_IN]: state => state.set('sign', true),
    [LOG_OUT]: state => state.set('sign', false),
    [LOG_GET_DATA]: (state, action) => state.merge(action.data)
};

export default function login(state = initState, action = {}) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
}