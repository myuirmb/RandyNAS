import React, { Component } from 'react';

class Root extends Component {
    constructor(){
        super();
    }

    componentWillMount(){
        console.log(arguments);
    }

    render(){
        return (
            <div>abc</div>
        );
    }
}

export default Root;
