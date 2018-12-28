import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { showLogin, hiddenLogin, showMask, hiddenMask } from '../../actions/main';
import { reqAuthInit } from '../../actions/auth';

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
    }

    componentWillMount() {
        console.log('---1---');
        const { dispatch } = this.props;
        dispatch(reqAuthInit());
    }

    componentWillUpdate(nextProps) {
        console.log((new Date()).getTime(), '--2--')
        const { auth, dispatch } = nextProps;
        if (!auth.get('gu') && auth.get('ut') === 'guest') {
            dispatch(showMask());
            dispatch(showLogin());
        }
        else {
            dispatch(hiddenMask());
            dispatch(hiddenLogin());
        }
    }

    renderLogin(){
        return <Login />
    }

    render() {
        const { auth, main } = this.props;
        console.log((new Date()).getTime(), main);
        {/*<Mask key='3' /><Mask key='4' style={{display:`${main.get('mask')?'block':'none'}`}} />*/ }
        return [
            <div key='0'>{auth.get('ut')}</div>,
            <div key='1'>{auth.get('un')}</div>,
            <div key='2'>{auth.get('ud')}</div>,
            <div key='3' style={{ height: '1500px' }}>{main.get('login').toString()} | {main.get('mask').toString()}</div>,
            <Mask key='4' show={main.get('mask')} />,
            <Dialog key='5' content={this.renderLogin()} show={main.get('mask')} />
        ];
        // return (
        //     <div>
        //         {main.get('mask')?<Mask key='4' show={main.get('mask')} />:null}
        //     </div>
        // );
    }
}

export default Main;