import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reqAuthInit } from '../../actions/auth';
import {
    showMask,
    hiddenMask,
    showDialog,
    hiddenDialog,
    showLogin,
    hiddenLogin
} from '../../actions/main';

import Mask from '../../components/mask';
import Dialog from '../../components/dialog';
import Login from '../../components/login';

@connect(
    state => ({
        main: state.get('main'),
        auth: state.get('auth')
    })
)
class Main extends Component {
    constructor() {
        super();
        this.closeDialog = this.closeDialog.bind(this);
    }


    closeDialog() {
        const { dispatch } = this.props;
        dispatch(hiddenLogin());
        dispatch(hiddenDialog());
        dispatch(hiddenMask());
    }

    renderLogin() {
        const { main } = this.props;
        return main.get('login') ? <Login /> : null;
    }


    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(reqAuthInit());
    }

    // componentWillUpdate(nextProps) {
    // }

    render() {
        const { auth, main } = this.props;
        return [
            <div key='0'>{auth.get('ut')}</div>,
            <div key='1'>{auth.get('un')}</div>,
            <div key='2'>{auth.get('ud')}</div>,
            <div key='3' style={{ height: '1500px' }}>{main.get('dialog').toString()} | {main.get('mask').toString()}</div>,
            <Mask key='4' show={main.get('mask')} />,
            <Dialog key='5'
                title='Login'
                content={this.renderLogin()}
                closeDialog={this.closeDialog}
                show={main.get('dialog')} />
        ];
    }
}

export default Main;