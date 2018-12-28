import React from 'react';
import PropTypes from 'prop-types';

class Dialog extends React.Component {
    static propTypes = {
        show: PropTypes.bool,
        //content: PropTypes.node
    }

    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            ox: 0,
            oy: 0,
            nx: 0,
            ny: 0,
            f: false
        };

        this.draginit = this.draginit.bind(this);
        this.dragmove = this.dragmove.bind(this);
        this.dragrel = this.dragrel.bind(this);
    }

    draginit(e) {
        //e = e || window.event;
        const d = document;
        const target = e.target || e.srcElement;
        this.setState({
            x: e.clientX,
            y: e.clientY,
            ox: target.parentNode.offsetLeft,
            oy: target.parentNode.offsetTop,
            nx: target.parentNode.offsetLeft,
            ny: target.parentNode.offsetTop,
            f: true
        });
        d.addEventListener('mousemove', this.dragmove);
        d.addEventListener('mouseup', this.dragrel);
    }

    dragmove(e) {
        const { x, y, ox, oy } = this.state
        this.setState({
            nx: ox + (e.clientX - x),
            ny: oy + (e.clientY - y)
        });
    }

    dragrel() {
        const d = document;
        d.removeEventListener('mousemove', this.dragmove);
        d.removeEventListener('mouseup', this.dragrel);
    }

    componentWillMount() {

    }

    componentWillUpdate(nextProps) {

    }

    render() {
        const { content, show } = this.props;
        const { nx, ny, f } = this.state;
        return (
            <div className='dialog' style={{ left: f ? `${nx}px` : '50%', top: f ? `${ny}px` : '50%', display: `${show ? '' : 'none'}` }}>
                <div onMouseDown={this.draginit}>
                    
                </div>
                <div>{content || null}</div>
            </div>
        );
    }
}
export default Dialog;