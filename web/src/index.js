import React from 'react';
//import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import num from './reducers/root';
import { addNum, janNum, addNumAsync } from './actions/root';
import Root from './containers/Root';

import './assets/scss/index.scss';

const store = createStore(
    num,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : () => null
    )
);
// store.subscribe(function () {
//     ReactDOM.render(
//         <Root store={store} addNum={addNum} janNum={janNum} addNumAsync={addNumAsync}></Root>,
//         document.getElementById('root')
//     );
// });

// ReactDOM.render(
//     <Root store={store} addNum={addNum} janNum={janNum} addNumAsync={addNumAsync}></Root>,
//     document.getElementById('root')
// );

render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('root')
);

