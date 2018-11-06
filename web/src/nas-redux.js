//import { listeners } from "cluster";

// class createStroe{
//     constructor(redu){
//         this.redu=redu;
//         this.currentStore={};
//         this.currentListeners=[];

//         this.dispatch({type:'fasfasfadfsd'});
//     }

//     getState(){
//         return this.currentStore;
//     }

//     subscribe(listener){
//         this.currentListeners.push(listener);
//     }

//     dispatch(action){
//         this.currentStore=this.redu(this.currentStore,action);
//         this.currentListeners.forEach(v=>v());
//         return action;
//     }
// }

// export default createStroe;

export default function createStroe(reducer) {
    let currentState = {};
    let currentListeners = [];

    function getState() {
        return currentState;
    }

    function subscribe(listener) {
        currentListeners.push(listener);
    }

    function dispatch(action) {
        currentState = reducer(currentState, action);
        currentListeners.forEach(v => v());
        return action;
    }

    dispatch({ type: '@____________redux' });
    return { getState, subscribe, dispatch };
}