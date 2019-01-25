import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dTree from './dtree';

class Menu extends Component {
    static propTypes = {
        nodelist: PropTypes.object
    }
    constructor() {
        super();
    }

    getMenu() {
        const self = this;
        const { nodelist } = this.props;

        window.dt_rm_01 = new dTree('dt_rm_01', self);
        dt_rm_01.add('c2e57d92-8088-9226-3e1d-29cfee180a09', -1, 'My Nas', 'abc');
        if (nodelist && nodelist.size) {
            for (let i = 0, len = nodelist.size; i < len; i++) {
                if (nodelist.get(i).get('ftype') === 'folder') {
                    dt_rm_01.add(
                        nodelist.get(i).get('id'),
                        nodelist.get(i).get('fid'),
                        nodelist.get(i).get('fname'),
                        nodelist.get(i).get('id'),
                        '',
                        '',
                        dt_rm_01.icon.folder,
                        dt_rm_01.icon.folderOpen
                    );
                }
            }
        }
        // dt_rm_01.add('07cfa0b5-2a80-4280-a5c4-f7476db3bcd3', '12829392-a824-4eff-9f2a-35452e031c5c', 'Node 1', 'uytuytyu');
        // dt_rm_01.add('85cf406d-fc77-444b-b1d0-0d4085c838dd', '12829392-a824-4eff-9f2a-35452e031c5c', 'Node 2', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('77cfd2ed-241a-4b2e-a188-0a8175d37180', '07cfa0b5-2a80-4280-a5c4-f7476db3bcd3', 'Node 1.1', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('1c142850-d178-44ca-8b77-dc2c4cbddfce', '12829392-a824-4eff-9f2a-35452e031c5c', 'Node 3', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('e605994b-9989-4f4a-901d-00cdf3adfec7', '77cfd2ed-241a-4b2e-a188-0a8175d37180', 'Node 1.1.1', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('29dcc655-bedb-4d58-bfc5-fa4a7f42eb1a', 'e605994b-9989-4f4a-901d-00cdf3adfec7', 'Node 1.1.1.1', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('fae5aedd-4701-48a6-847a-94a55052012b', '12829392-a824-4eff-9f2a-35452e031c5c', 'Node 4', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('2c6faf21-02f3-4e36-ab84-a29306db5ce4', '07cfa0b5-2a80-4280-a5c4-f7476db3bcd3', 'Node 1.2', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('b5685f5c-a52a-4208-b7cc-edb9f28d690e', '12829392-a824-4eff-9f2a-35452e031c5c', 'My Pictures', '83d280e3-46d2-43bf-94dc-ddf9e1a76971', 'Pictures I\'ve taken over the years', '', '', './assets/images/img/imgfolder.gif');
        // dt_rm_01.add('3fb62152-d111-432e-948e-e455ed112960', 'b5685f5c-a52a-4208-b7cc-edb9f28d690e', 'The trip to Iceland', '83d280e3-46d2-43bf-94dc-ddf9e1a76971', 'Pictures of Gullfoss and Geysir');
        // dt_rm_01.add('ac36b873-5974-4b3c-be42-7165bb15c10d', 'b5685f5c-a52a-4208-b7cc-edb9f28d690e', 'Mom\'s birthday', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        // dt_rm_01.add('79cd3005-5111-4095-b750-8ddd9732b067', '12829392-a824-4eff-9f2a-35452e031c5c', 'Recycle Bin', '83d280e3-46d2-43bf-94dc-ddf9e1a76971', '', '', './assets/images/img/trash.gif');
        // dt_rm_01.add('6ba1ad91-c671-45df-aee4-c1ec42f0985b', '07cfa0b5-2a80-4280-a5c4-f7476db3bcd3', 'Node 1.3', '83d280e3-46d2-43bf-94dc-ddf9e1a76971');
        return dt_rm_01.toString();
    }

    selectedNode(flag, id, nid) {
        console.log(flag, id, nid);
    }

    render() {
        return (<div className='content_dtree' dangerouslySetInnerHTML={{ __html: this.getMenu() }} />);
    }
}

export default Menu;