import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dTree from './dtree';

class Menu extends Component {
    static propTypes = {
        cid: PropTypes.string,
        rn: PropTypes.string,
        nodelist: PropTypes.object,
        gm: PropTypes.func
    }
    constructor() {
        super();

        this.getMenu=this.getMenu.bind(this);
    }

    getMenu() {
        const self = this;
        const { cid, rn, nodelist } = this.props;

        if (window.dt_rm_01) {
            nodelist.map((v, k) => {
                for (let j = 0, vlen = v.size; j < vlen; j++) {
                    let flag = true;
                    // console.log('------v.get(j).get(id)------->', v.get(j).get('id'));
                    for (let i = 0, len = dt_rm_01.aNodes.length; i < len; i++) {
                        // console.log('------dt_rm_01.aNodes[i].id------->', dt_rm_01.aNodes[i].id);
                        // console.log('====>', v.get(j).get('id') === dt_rm_01.aNodes[i].id);
                        if (v.get(j).get('ftype') !== 'folder' || v.get(j).get('id') === dt_rm_01.aNodes[i].id) {
                            flag = false;
                            break;
                        }
                    }
                    // console.log('----flag-->', flag,`\r\n`);
                    if (flag) {
                        dt_rm_01.add(
                            v.get(j).get('id'),
                            v.get(j).get('fid'),
                            v.get(j).get('fname'),
                            v.get(j).get('id'),
                            '',
                            '',
                            dt_rm_01.icon.folder,
                            dt_rm_01.icon.folderOpen
                        );
                    }
                }
            });
        }
        else {
            if (cid) {
                window.dt_rm_01 = new dTree('dt_rm_01', self);
                dt_rm_01.add(cid, -1, rn, '0');
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

        // if(window.dt_rm_01)console.log(dt_rm_01.toString());
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