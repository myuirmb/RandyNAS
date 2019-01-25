import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reqAuthInit } from '../../actions/auth';
import {
    showMask,
    hiddenMask,
    showDialog,
    hiddenDialog,
    showLogin,
    hiddenLogin,
    reqMenuInit
} from '../../actions/main';

import Mask from '../../components/mask';
import Dialog from '../../components/dialog';
import Login from '../../components/login';
import MainFlex from '../../components/layout';
import Menu from '../../components/menu';

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
        dispatch(reqMenuInit());
    }

    // componentWillUpdate(nextProps) {
    // }

    menurender() {
        const { main } = this.props;
        console.log(main.get('menu'));
        return <Menu nodelist={main.get('menu')} />;
    }

    loginrender() {
        return <Login />;
    }

    render() {
        const { auth, main } = this.props;
        console.log(main.get('menu'));
        return [
            <MainFlex key='1' menubar={this.menurender()} />,
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