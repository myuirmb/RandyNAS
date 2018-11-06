import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login, getData } from '../../actions/login';

@connect(
    state => ({ loginflag: state.login }) //,
    //{ login ,getData}
)
class Login extends Component {
    constructor() {
        super();
        this.btnClick = this.btnClick.bind(this);
    }

    btnClick() {
        // const { login } = this.props;
        // login();
        const {dispatch}=this.props;
        dispatch(login());
    }

    componentWillMount() {
        // const {getData} =this.props;
        // getData();
        const {dispatch}=this.props;
        dispatch(getData());
    }

    render() {
        console.log(this.props.loginflag.login);
        if(this.props.loginflag.login){
            return <Redirect to='/main' />
        }
        return (
            <div>
                <h3>{this.props.loginflag.data}</h3>
                <input type='button' value='login' onClick={this.btnClick} />
            </div>
        );
    }
}

export default Login;