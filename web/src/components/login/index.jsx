import React from 'react';
import { connect } from 'react-redux';
import { reqAuthLogin } from '../../actions/auth';
import auth from '../../reducers/auth';

@connect(
    state => ({ auth: state.get('auth') })
)
class Login extends React.Component {
    constructor() {
        super();
        this.userLogin = this.userLogin.bind(this);
    }

    componentDidMount() {
        this.refs.un.focus();
    }

    userLogin() {
        const { dispatch } = this.props;
        const username = this.refs.un.value.trim(), password = this.refs.pwd.value.trim();
        if (username !== '' && password !== '') {
            dispatch(reqAuthLogin({ method: 'post',data: { username, password } }));
        }
        else {

        }
    }

    render() {
        return (
            <div className='login'>
                <div>Username:</div>
                <div><input type='text' ref='un' placeholder='Enter username' /></div>

                <div>Password:</div>
                <div><input type='password' ref='pwd' placeholder='Enter password' /></div>

                <div><input type='button' value='Submit' onClick={this.userLogin} /></div>
            </div>
        );
    }
}
export default Login;