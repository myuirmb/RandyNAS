import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Content extends Component {
    static propTypes = {
        showtype: PropTypes.string,
        nodelist: PropTypes.object,
        gm: PropTypes.func,
        dlf: PropTypes.func
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


    formatDate(timestamp) {
        const d = new Date(timestamp);
        const year = d.getFullYear(),
            month = (d.getMonth() + 1).toString().padStart(2, '0'),
            date = (d.getDate()).toString().padStart(2, '0'),
            hour = (d.getHours()).toString().padStart(2, '0'),
            minute = (d.getMinutes()).toString().padStart(2, '0'),
            second = (d.getSeconds()).toString().padStart(2, '0');
        return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    }

    nodeClick(id, fname, ftype, fsize) {
        const { gm, dlf } = this.props;
        if (ftype === 'folder') {
            gm(id);
        }
        else {
            console.log('------content--ondeclick---id----ftype------>', id, ftype);
            dlf(id, fname, ftype, fsize);
        }
    }

    render() {
        const { showtype, nodelist } = this.props;
        let nodes = [], theme = this.icon.a;
        if (nodelist) {
            if (showtype === 'block') {
                for (let i = 0, len = nodelist.size; i < len; i++) {
                    let icon = theme.other;
                    switch (nodelist.get(i).get('ftype')) {
                        case 'folder':
                            icon = theme.folder;
                            break;
                        case '.mp3':
                        case '.wav':
                            icon = theme.music;
                            break;
                        case '.mp4':
                        case '.rmvb':
                        case '.3gp':
                        case '.mov':
                        case '.avi':
                            icon = theme.video;
                            break;
                        case '.jpg':
                        case '.gif':
                        case '.bmp':
                            icon = theme.jpg;
                            break;
                        case '.png':
                            icon = theme.png;
                            break;
                        case '.docx':
                        case '.doc':
                            icon = theme.doc;
                            break;
                        case '.txt':
                            icon = theme.txt;
                            break;
                        case '.rar':
                        case '.zip':
                            icon = theme.zip;
                            break;
                        case '.conf':
                        case '.cfg':
                        case '.config':
                            icon = theme.config;
                            break;
                        case '.xml':
                            icon = theme.xml;
                            break;
                        case '.html':
                            icon = theme.html;
                            break;
                        case '.scss':
                        case '.less':
                        case '.css':
                            icon = theme.css;
                            break;
                        default:
                            icon = theme.other;
                    }
                    nodes.push(<div
                        key={i}
                        className='files_icon'
                        title={nodelist.get(i).get('fname')}
                        onClick={this.nodeClick.bind(
                            this,
                            nodelist.get(i).get('id'),
                            nodelist.get(i).get('fname'),
                            nodelist.get(i).get('ftype'),
                            nodelist.get(i).get('fsize')
                        )}
                    >
                        <div><img src={icon} /></div>
                        <div>{nodelist.get(i).get('fname')}</div>
                    </div>);
                }
            }
            else if (showtype === 'list') {
                for (let i = 0, len = nodelist.size; i < len; i++) {
                    let icon = theme.other;
                    switch (nodelist.get(i).get('ftype')) {
                        case 'folder':
                            icon = theme.folder;
                            break;
                        case '.mp3':
                        case '.wav':
                            icon = theme.music;
                            break;
                        case '.mp4':
                        case '.rmvb':
                        case '.3gp':
                        case '.mov':
                        case '.avi':
                            icon = theme.video;
                            break;
                        case '.jpg':
                        case '.gif':
                        case '.bmp':
                            icon = theme.jpg;
                            break;
                        case '.png':
                            icon = theme.png;
                            break;
                        case '.docx':
                        case '.doc':
                            icon = theme.doc;
                            break;
                        case '.txt':
                            icon = theme.txt;
                            break;
                        case '.rar':
                        case '.zip':
                            icon = theme.zip;
                            break;
                        case '.conf':
                        case '.cfg':
                        case '.config':
                            icon = theme.config;
                            break;
                        case '.xml':
                            icon = theme.xml;
                            break;
                        case '.html':
                            icon = theme.html;
                            break;
                        case '.scss':
                        case '.less':
                        case '.css':
                            icon = theme.css;
                            break;
                        default:
                            icon = theme.other;
                    }
                    nodes.push(
                        <div key={i} className='files_list' title={nodelist.get(i).get('fname')}>
                            <div onClick={this.nodeClick.bind(
                                this,
                                nodelist.get(i).get('id'),
                                nodelist.get(i).get('fname'),
                                nodelist.get(i).get('ftype'),
                                nodelist.get(i).get('fsize')
                            )}
                            >
                                <img src={icon} />
                            </div>
                            <div>{nodelist.get(i).get('fname')}</div>
                            <div>
                                {
                                    nodelist.get(i).get('ftype') !== 'folder' ?
                                        `${(nodelist.get(i).get('fsize') / (1024 * 1024)).toFixed(2)} MB`
                                        : ''
                                }
                            </div>
                            <div>{this.formatDate(nodelist.get(i).get('stime'))}</div>
                        </div>);
                }
            }
        }
        // else {
        //     nodes.push(<div key='0' />);
        // }
        return <div className={showtype === 'block' ? 'content_block' : 'content_list'}>{nodes}</div>;

    }
}

export default Content;