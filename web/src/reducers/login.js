import { LOG_IN, LOG_OUT, LOG_GET_DATA } from '../actions/login';

const initState = { login: false, user: 'lucy',data:'nihao...' };

const actions = {
    [LOG_IN]: state => ({ ...state, login: true }),
    [LOG_OUT]: state => ({ ...state, login: false }),
    [LOG_GET_DATA]: (state, action) => ({ ...state, data: action.data })
};

export default function login(state = initState, action = {}) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
}