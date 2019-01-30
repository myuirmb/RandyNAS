import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Content extends Component {
    static propTypes = {
        nodelist: PropTypes.object,
        gm: PropTypes.func
    }
    constructor() {
        super();
        this.icon = {
            a: {
                folder: './assets/images/res/folder.png',
                file: './assets/images/res/file.png',
                zip: './assets/images/res/zip.png',
                video: './assets/images/res/video.png',
                music: './assets/images/res/music.png',
                jpg: './assets/images/res/jpg.png',
                png: './assets/images/res/png.png',
                svg: './assets/images/res/svg.png',
                doc: './assets/images/res/doc.png',
                txt: './assets/images/res/txt.png',
                xml: './assets/images/res/xml.png',
                html: './assets/images/res/html.png',
                css: './assets/images/res/css.png',
                note: './assets/images/res/note.png',
                fail: './assets/images/res/fail.png',
                config: './assets/images/res/config.png',
                other: './assets/images/res/other.png'
            }
        }
    }

    nodeClick(id, ftype) {
        const { gm } = this.props;
        if (ftype === 'folder') {
            gm(id);
        }
        else {
            console.log('------content--ondeclick---id----ftype------>', id, ftype);
        }
    }

    render() {
        const { nodelist } = this.props;
        let nodes = [];
        if (nodelist) {
            for (let i = 0, len = nodelist.size; i < len; i++) {
                let icon = this.icon.a.other;
                switch (nodelist.get(i).get('ftype')) {
                    case 'folder':
                        icon = this.icon.a.folder;
                        break;
                    case '.mp3':
                    case '.wav':
                        icon = this.icon.a.music;
                        break;
                    case '.mp4':
                    case '.rmvb':
                    case '.3gp':
                    case '.mov':
                    case '.avi':
                        icon = this.icon.a.video;
                        break;
                    case '.jpg':
                    case '.gif':
                    case '.bmp':
                        icon = this.icon.a.jpg;
                        break;
                    case '.png':
                        icon = this.icon.a.png;
                        break;
                    case '.docx':
                    case '.doc':
                        icon = this.icon.a.doc;
                        break;
                    case '.txt':
                        icon = this.icon.a.txt;
                        break;
                    case '.rar':
                    case '.zip':
                        icon = this.icon.a.zip;
                        break;
                    case '.conf':
                    case '.cfg':
                    case '.config':
                        icon = this.icon.a.config;
                        break;
                    case '.xml':
                        icon = this.icon.a.xml;
                        break;
                    case '.html':
                        icon = this.icon.a.html;
                        break;
                    case '.scss':
                    case '.less':
                    case '.css':
                        icon = this.icon.a.css;
                        break;
                    default:
                        icon = this.icon.a.other;
                }
                nodes.push(<div
                    key={i}
                    className='files_icon'
                    title={nodelist.get(i).get('fname')}
                    onClick={this.nodeClick.bind(this, nodelist.get(i).get('id'), nodelist.get(i).get('ftype'))}
                >
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