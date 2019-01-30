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
import TopBar from '../../components/top';
import Menu from '../../components/menu';
import Content from '../../components/content';

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
        this.getMeun = this.getMeun.bind(this);
        this.state = {
            pid: 0
        }
    }


    closeDialog() {
        const { dispatch } = this.props;
        dispatch(hiddenLogin());
        dispatch(hiddenDialog());
        dispatch(hiddenMask());
    }

    loginRender() {
        const { main } = this.props;
        return main.get('login') ? <Login /> : null;
    }

    getMeun(pid) {
        const { main, dispatch } = this.props;
        this.setState({ pid });
        if (main.get('menu').get(pid)) {
        }
        else {
            dispatch(reqMenuInit({ data: { pid } }));
        }
    }

    topbarRender() {
        const { main } = this.props;
        let pid = this.state.pid;
        if (pid === 0) pid = main.get('cid');
        return <TopBar cid={pid} gm={this.getMeun} />
    }

    menuRender() {
        const { main } = this.props;
        return <Menu cid={main.get('cid')} nodelist={main.get('menu')} gm={this.getMeun} />;
    }

    contentRender() {
        const { main } = this.props;
        if (main.get('cid')) {
            let pid = this.state.pid;
            if (pid === 0) pid = main.get('cid');
            return <Content nodelist={main.getIn(['menu', pid])} gm={this.getMeun} />;
        }
        else {
            return <div />;
        }
    }


    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(reqAuthInit());
        dispatch(reqMenuInit());
    }

    render() {
        const { auth, main } = this.props;
        return [
            <MainFlex key='1' topbar={this.topbarRender()} menubar={this.menuRender()} content={this.contentRender()} />,
            //<MainFlex key='1' topbar={this.topbarRender()}  />,
            <Mask key='4' show={main.get('mask')} />,
            <Dialog key='5'
                title='Login'
                content={this.loginRender()}
                closeDialog={this.closeDialog}
                show={main.get('dialog')} />
        ];
    }
}

export default Main;