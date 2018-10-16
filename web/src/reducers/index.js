import { createStore } from 'redux';

const initState = 10;
function counter(state = initState, action) {
    switch (action.type) {
        case 'addNum':
            return state+1;
            break;
        case 'janNum':
            return state-1;
            break;
        default:
            return state;
    }
}

const store=createStore(counter);
// const listener=function(){
//     const cur=store.getState();
//     console.log(cur);
// }
// store.subscribe(listener);

store.subscribe(function(){
    const cur=store.getState();
    console.log(cur);
})

//const init=store.getState();

store.dispatch({type:'addNum'});
store.dispatch({type:'addNum'});
store.dispatch({type:'addNum'});
store.dispatch({type:'janNum'});



//export default counter;