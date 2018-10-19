import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from '../containers/Login';
import Root from '../containers/Root';
// import CaTest from '../containers/CaTest';
// import CbTest from '../containers/CbTest';

class MyRouter extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/main' component={Root}></Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default MyRouter;