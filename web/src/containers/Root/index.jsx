import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNum, janNum, addNumAsync } from '../../actions/root.js'

const mapStatetoProps = (state) => { return { num: state } };
const actionCreators = { addNum, janNum, addNumAsync };
// Root = connect(mapStatetoProps, actionCreators)(Root);
@connect(mapStatetoProps,actionCreators)
class Root extends Component {
    constructor() {
        super();
        this.btnAddClick = this.btnAddClick.bind(this);
        this.btnJanClick = this.btnJanClick.bind(this);
        this.btnAddAsyncClick = this.btnAddAsyncClick.bind(this);
    }

    btnAddClick() {
        // const { dispatch } = this.props.store;
        // dispatch(this.props.addNum());
        const { addNum } = this.props;
        addNum();
    }

    btnJanClick() {
        // const { dispatch } = this.props.store;
        // dispatch(this.props.janNum());
        const { janNum } = this.props;
        janNum();
    }

    btnAddAsyncClick() {
        // const { dispatch } = this.props.store;
        // dispatch(this.props.addNumAsync());
        const { addNumAsync } = this.props;
        addNumAsync();
    }

    componentWillMount() {
        //console.log(arguments);
    }

    render() {
        //const num = this.props.store.getState();
        return (
            <div>
                <div>now num is <span>{this.props.num}</span></div>
                <input type='button' onClick={this.btnAddClick} value='ADD' />
                <input type='button' onClick={this.btnJanClick} value='JAN' />
                <input type='button' onClick={this.btnAddAsyncClick} value='ADDASYNC' />
                {/*
                
                */}
            </div>

        );
    }
}

// const mapStatetoProps = (state) => { return { num: state } };
// const actionCreators = { addNum, janNum, addNumAsync };
// Root = connect(mapStatetoProps, actionCreators)(Root);

export default Root;
