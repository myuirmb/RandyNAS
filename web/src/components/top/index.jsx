import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dTree from '../menu/dtree';

class TopBar extends Component {
    static propTypes = {
        cid: PropTypes.string,
        gm: PropTypes.func
    }
    constructor() {
        super();
    }

    xpathClick(id){
        const { gm } = this.props;
        gm(id);
    }

    render() {
        const { cid, gm } = this.props;
        
        let xpath = [];
        if (window.dt_rm_01) {
            for (let i = 0, len = dt_rm_01.aNodes.length; i < len; i++) {
                if (dt_rm_01.aNodes[i].id === cid) {
                    let pn = dt_rm_01.aNodes[i], j = 0;
                    while (pn.id !== -1) {
                        xpath.unshift(
                            <div key={j + 1} className='xsp' />,
                            <div 
                                key={j + 2} 
                                className='xpath' 
                                title={pn.name} 
                                onClick={this.xpathClick.bind(this,pn.id)} 
                                data-xid={pn.id}>
                                {pn.name}
                            </div>
                        );
                        j = j + 2;
                        pn = pn._p;
                    }
                    break;
                }
            }
        }

        return (<div className='topbar'>
            <div>13123</div>
            <div>
                <div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div>
                    {xpath}
                </div>
            </div>
        </div>);
    }
}

export default TopBar;