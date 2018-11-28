import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login, getData } from '../../actions/login';

@connect(
    state => ({ login: state.get('login') })
)
class Main extends Component {
    constructor() {
        super();
    }

    componentWillMount(){
        const {dispatch}=this.props;
        dispatch(getData());
    }

    render() {
        const { login } = this.props;

        if (login.get('sign')) {    //已登录

        }
        else {
            //guest=false 不支持匿名登录，跳转到登录页面
            if(!login.get('gu')) return <Redirect to='/login' />

            return (
                <div>loading...</div>
            );

        }
    }
}

export default Main;