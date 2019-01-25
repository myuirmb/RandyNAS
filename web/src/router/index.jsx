import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


import Main from '../containers/Main';


class MyRouter extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>{/*<div style={{border:'1px solid red'}}>*/}
                    <Route path='/' exact component={Main}></Route>
                </Switch>{/*</div>*/}
            </BrowserRouter>
        );
    }
}

export default MyRouter;