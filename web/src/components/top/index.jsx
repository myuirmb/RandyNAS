import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TopBar extends Component {
    static propTypes = {
        cid: PropTypes.string,
        rn: PropTypes.string,
        pid: PropTypes.string,
        gf:PropTypes.func,
        nf:PropTypes.func,
        sst: PropTypes.func,
        gm: PropTypes.func,
    }
    constructor() {
        super();

        this.searchClick=this.searchClick.bind(this);
        this.newFolderClick=this.newFolderClick.bind(this);
        // this.showTypeClick=this.showTypeClick.bind(this);
    }

    searchClick() {
        const { gf } = this.props;
        const str = this.refs.searchtxt.value;
        if (str.trim() !== '') gf(str);
    }

    newFolderClick(){
        const { nf } = this.props;
        nf();
    }

    showTypeClick(t) {
        const { sst } = this.props;
        sst(t);
    }

    xpathClick(id) {
        const { gm } = this.props;
        gm(id);
    }

    render() {
        const { cid, rn, pid } = this.props;

        let xpath = [];
        if (window.dt_rm_01) {
            for (let i = 0, len = dt_rm_01.aNodes.length; i < len; i++) {
                if (dt_rm_01.aNodes[i].id === pid) {
                    let pn = dt_rm_01.aNodes[i], j = 0;
                    while (pn.pid !== -1) {
                        xpath.unshift(
                            <div key={j + 1} className='xsp' />,
                            <div
                                key={j + 2}
                                className='xpath'
                                title={pn.name}
                                onClick={this.xpathClick.bind(this, pn.id)}
                            >
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
                    <div>
                        <input type='text' ref='searchtxt' placeholder='search...' />
                        <input type='button' value='Search' onClick={this.searchClick} />
                    </div>
                    <div>
                        <span onClick={this.newFolderClick}>new folder</span>
                    </div>
                    <div>
                        <span onClick={this.showTypeClick.bind(this, 'block')}>block</span>
                        <span onClick={this.showTypeClick.bind(this, 'list')}>list</span>
                    </div>
                    <div></div>
                    <div></div>
                </div>
                <div>
                    <div className='xsp' />
                    <div className='xpath' title={rn} onClick={this.xpathClick.bind(this, cid)}>{rn}</div>
                    {xpath}
                </div>
            </div>
        </div>);
    }
}

export default TopBar;