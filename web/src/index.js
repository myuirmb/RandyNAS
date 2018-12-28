import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
// import createStore from './nas-redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import reducers from './reducers';
import MyRouter from './router'
//import Login from './containers/Login';

import './assets/scss/index.scss';
import './assets/scss/mask.scss';
import './assets/scss/dialog.scss';

const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : () => null
    )
);
// const store = createStore(reducers);

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
    (<Provider store={store}>
        <MyRouter />
    </Provider>),
    document.getElementById('root')
);

