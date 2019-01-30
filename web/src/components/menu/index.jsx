import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dTree from './dtree';

class Menu extends Component {
    static propTypes = {
        cid: PropTypes.string,
        nodelist: PropTypes.object,
        gm: PropTypes.func
    }
    constructor() {
        super();
    }

    getMenu() {
        const self = this;
        const { cid, nodelist } = this.props;

        if (window.dt_rm_01) {
            nodelist.map((v, k) => {
                let thisnode = true;
                for (let i = 0, len = dt_rm_01.aNodes.length; i < len; i++) {
                    if (v.size === 0 || v.get(0).get('id') === dt_rm_01.aNodes[i].id) {
                        thisnode = false;
                        break;
                    }
                }
                if (thisnode) {
                    for (let i = 0, len = v.size; i < len; i++) {
                        if (v.get(i).get('ftype') === 'folder') {
                            dt_rm_01.add(
                                v.get(i).get('id'),
                                v.get(i).get('fid'),
                                v.get(i).get('fname'),
                                v.get(i).get('id'),
                                '',
                                '',
                                dt_rm_01.icon.folder,
                                dt_rm_01.icon.folderOpen
                            );
                        }
                    }
                }
            });
        }
        else {
            if (cid) {
                window.dt_rm_01 = new dTree('dt_rm_01', self);
                dt_rm_01.add(cid, -1, 'My Nas', '0');
                nodelist.map((v, k) => {
                    for (let i = 0, len = v.size; i < len; i++) {
                        if (v.get(i).get('ftype') === 'folder') {
                            dt_rm_01.add(
                                v.get(i).get('id'),
                                v.get(i).get('fid'),
                                v.get(i).get('fname'),
                                v.get(i).get('id'),
                                '',
                                '',
                                dt_rm_01.icon.folder,
                                dt_rm_01.icon.folderOpen
                            );
                        }
                    }
                });
            }
        }
        return window.dt_rm_01 ? dt_rm_01.toString() : '';
    }

    selectedNode(flag, id, nid) {
        const { gm } = this.props;
        gm(nid);
    }

    openNode(flag, id, nid) {
        // this.setState({ [nid]: true });
    }


    // componentWillMount(){
    //     const { cid, nodelist } = this.props;
    //     if(window.dt_rm_01)window.dt_rm_01.add(cid, -1, 'My Nas', 'abc');
    // }

    render() {
        return (<div className='content_dtree' dangerouslySetInnerHTML={{ __html: this.getMenu() }} />);
    }
}

export default Menu;