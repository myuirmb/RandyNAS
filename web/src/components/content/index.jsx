import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Content extends Component {
    constructor() {
        super();
        this.icon = {
            a: {
                folder: './assets/images/res/folder.png',
                file: './assets/images/res/file.png',
                zip: './assets/images/res/zip.png',
                video: './assets/images/res/video.png',
                jpg: './assets/images/res/jpg.png',
                png: './assets/images/res/png.png',
                svg: './assets/images/res/svg.png',
                doc: './assets/images/res/doc.png',
                txt: './assets/images/res/txt.png',
                xml: './assets/images/res/xml.png',
                note: './assets/images/res/note.png',
                fail: './assets/images/res/fail.png',
                other: './assets/images/res/other.png'
            }
        }
    }

    render() {
        const { nodelist } = this.props;
        let nodes = [];
        if (nodelist) {
            for (let i = 0, len = nodelist.size; i < len; i++) {
                let icon = this.icon.a.other;
                if (nodelist.get(i).get('ftype') === 'folder') icon = this.icon.a.folder;

                nodes.push(<div key={i} className='files_icon' title={nodelist.get(i).get('fname')}>
                    <div><img src={icon} /></div>
                    <div>{nodelist.get(i).get('fname')}</div>
                </div>);
            }
        }
        else {
            nodes.push(<div key='0' />);
        }
        return (<div className='files_content'>{nodes}</div>);
    }
}

export default Content;