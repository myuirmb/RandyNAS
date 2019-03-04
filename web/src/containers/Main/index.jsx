import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reqAuthInit } from '../../actions/auth';
import {
    showMask,
    hiddenMask,
    showDialog,
    hiddenDialog,
    showType,
    showLogin,
    hiddenLogin,
    reqUploadFiles,
    reqMenuInit,
    reqGetFiles,
    reqDownloadFile,
    reqNewFolder
} from '../../actions/main';

import MainFlex from '../../components/layout';
import TopBar from '../../components/top';
import Menu from '../../components/menu';
import Content from '../../components/content';

import Progress from '../../components/progress';
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
        this.getMeun = this.getMeun.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.newFolder = this.newFolder.bind(this);
        this.setShowType = this.setShowType.bind(this);
        this.getFiles = this.getFiles.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.state = {
            pid: 0,
            search: false
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

    uploadFiles(files) {
        const { main, dispatch } = this.props;
        let pid = this.state.pid;
        if (pid === 0) pid = main.get('cid');
        dispatch(reqUploadFiles({ pid, files }));
    }

    getMeun(pid) {
        const { main, dispatch } = this.props;
        this.setState({
            pid,
            search: false
        });
        if (main.get('menu').get(pid)) {
        }
        else {
            dispatch(reqMenuInit({ data: { pid } }));
        }
    }

    newFolder(fname) {
        const { main, dispatch } = this.props;
        let pid = this.state.pid;
        if (pid === 0) pid = main.get('cid');
        dispatch(reqNewFolder({ data: { pid, fn: 'testx' } }));
    }

    getFiles(str) {
        const { dispatch } = this.props;
        this.setState({ search: true });
        dispatch(reqGetFiles({ data: { str } }));
    }

    downloadFile(id, fname, ftype, fsize) {
        const { dispatch } = this.props;
        dispatch(reqDownloadFile({ data: { id, fname, ftype, fsize } }));
    }

    setShowType(types) {
        const { dispatch } = this.props;
        dispatch(showType(types));
    }

    topbarRender() {
        const { main } = this.props;
        let pid = this.state.pid;
        if (pid === 0) pid = main.get('cid');
        return <TopBar
            cid={main.get('cid')}
            rn={main.get('rn')}
            pid={pid}
            uf={this.uploadFiles}
            gf={this.getFiles}
            nf={this.newFolder}
            gm={this.getMeun}
            sst={this.setShowType}
        />;
    }

    menuRender() {
        const { main } = this.props;
        return <Menu cid={main.get('cid')} rn={main.get('rn')} nodelist={main.get('menu')} gm={this.getMeun} />;
    }

    contentRender() {
        const { main } = this.props;
        if (main.get('cid')) {
            let pid = this.state.pid;
            if (pid === 0) pid = main.get('cid');

            let nodelist = main.getIn(['menu', pid]);
            if (this.state.search) {
                // console.log('---------->', main.get('search'));
                nodelist = main.get('search');
            }
            return <Content
                showtype={main.get('showtype')}
                nodelist={nodelist}
                gm={this.getMeun}
                dlf={this.downloadFile}
            />;
        }
        else {
            return null;
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
                show={main.get('dialog')} />,
            <Progress key='6' prog={main.get('progress')} />
        ];
    }
}

export default Main;