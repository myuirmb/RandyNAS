import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
    static propTypes = {
    }

    constructor() {
        super();
    }

    componentWillMount() {
        
    }

    componentWillUpdate(nextProps) {

    }

    render() {
        return (
            <div>
                <div>
                    <div>username:</div>
                    <div><input type="text" /></div>
                </div>
                <div>
                    <div>password:</div>
                    <div><input type="password" /></div>
                </div>
                <div>
                    <input type="button" value="sign up"/>
                </div>
            </div>
        );
    }
}
export default Login;