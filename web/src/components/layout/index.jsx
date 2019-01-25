import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MainFlex extends Component {
    static propTypes = {
        topbar: PropTypes.node,
        menubar: PropTypes.node,
        content: PropTypes.node
    }
    constructor() {
        super();
        this.state = {
            ow: 200,
            nw: 200,
            x: 0
        };
        this.draginit = this.draginit.bind(this);
        this.dragmove = this.dragmove.bind(this);
        this.dragrel = this.dragrel.bind(this);
    }

    draginit(e) {
        const d = document, target = e.currentTarget;
        const w = target.parentNode.firstElementChild.offsetWidth;
        this.setState({
            ow: w,
            nw: w,
            x: e.clientX
        });
        d.addEventListener('mousemove', this.dragmove);
        d.addEventListener('mouseup', this.dragrel);
    }
    dragmove(e) {
        const { ow, x } = this.state;
        this.setState({
            nw: ow + (e.clientX - x)
        });
    }
    dragrel(e) {
        const d = document;
        d.removeEventListener('mousemove', this.dragmove);
        d.removeEventListener('mouseup', this.dragrel);
    }
    render() {
        const { nw } = this.state;
        const { topbar, menubar, content } = this.props;
        return (
            <div className='mainflex'>
                <div>{topbar}</div>
                <div>
                    <div style={{ flexBasis: `${nw}px` }}>{menubar}</div>
                    <div onMouseDown={this.draginit}></div>
                    <div>{content}</div>
                </div>
            </div>
        );
    }
}

export default MainFlex;