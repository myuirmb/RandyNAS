import Immuable from 'immutable';
import { ADD_NUM, JAN_NUM } from '../actions/root';

const initState = Immuable.Map({gun:900});

// export function conter(state = initState, action) {
//     let newState = null;
//     switch (action.type) {
//         case 'ADD_NUM':
//             newState = state + 1;
//             break;
//         case 'JAN_NUM':
//             newState = state - 1;
//             break;
//         default:
//             newState = state;
//             break;
//     }
//     return newState;
// }

const actions = {
    [ADD_NUM]: state => state.update('gun',x=>x+1),
    [JAN_NUM]: state => state.update('gun',x=>x-1)
};

export default function num(state = initState, action = {}) {
    const fn = actions[action.type];
    return fn ? fn(state, action) : state;
}
