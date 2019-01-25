import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { reqAuthLogin, authErrorClear } from '../../actions/auth';
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
        dispatch(authErrorClear(Immutable.Map({ err: '' })));

        const username = this.refs.un.value.trim(),
            password = this.refs.pwd.value.trim(),
            autologin = this.refs.al ? this.refs.al.checked : false;

        if (username !== '' && password !== '') {
            dispatch(reqAuthLogin({ data: { username, password, autologin } }));
        }
        else {
            dispatch(authErrorClear(Immutable.Map({ err: 'Pls enter your Username and Password...' })));
        }
    }

    render() {
        const { auth } = this.props;
        return (
            <div className='login'>
                <div>Username:</div>
                <div><input type='text' ref='un' placeholder='Enter username' /></div>

                <div>Password:</div>
                <div><input type='password' ref='pwd' placeholder='Enter password' /></div>
                {(auth.get('au') && auth.get('au') > 0) ?
                    <div>
                        <input id='autologin' type='checkbox' ref='al' />
                        <label htmlFor='autologin'>Automatic login within {auth.get('au')} days</label>
                    </div>
                    : null
                }
                <div><input type='button' value='Submit' onClick={this.userLogin} /></div>
                <div className='altmsg'>{auth.get('err')}</div>
            </div>
        );
    }
}
export default Login;