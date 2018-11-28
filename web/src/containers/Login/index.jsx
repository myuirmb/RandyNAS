import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login, getData } from '../../actions/login';

@connect(
    //state=>state.get('login')
    state=>({login:state.get('login')})
    //state => ({ loginflag: state.login }) //,
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
        const gd=getData();
        dispatch(gd);
    }

    render() {
        console.log(this.props.login.get('login'));
        if(this.props.login.get('sign')){
            return <Redirect to='/main' />
        }
        return (
            <div style={{border:'1px solid red'}}>
                <h3>{this.props.login.get('data')}</h3>
                <input type='button' value='login' onClick={this.btnClick} />
            </div>
        );
    }
}

export default Login;