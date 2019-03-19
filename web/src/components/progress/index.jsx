import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
// import {Grid, Row, Col} from 'react-bootstrap';

class Progress extends React.Component {
    static propTypes = {
        prog: PropTypes.object
    }

    constructor() {
        super();
        this.state = {};
        this.showDownloadList = this.showDownloadList.bind(this);
        this.hiddenDownloadList = this.hiddenDownloadList.bind(this);
    }

    gropress(ps) {
        let pss = [];
        ps.map((item, key) => {
            pss.push(
                <div key={key} style={{ flexBasis: `${item.get('percent')}%` }}>
                    <div style={{ width: `${item.get('progress')}%` }}></div>
                </div>
            );
        });
        return pss;
    }

    dlRender(dl) {
        if (!dl) return null;

        let dls = [];
        dl.map((item, key) => {
            dls.push(
                <div key={key} className='progress-dl'>
                    <div>{this.gropress(item.get('ps'))}</div>
                    {
                        item.get('bloburl') ?
                            <div><a id={`dl_${key}`} href={item.get('bloburl')} download={item.get('fn')}>{item.get('fn')}</a></div>
                            : <div>{item.get('fn')}</div>
                    }
                </div>
            );
        });
        return dls;
    }


    // ulgropress(ps) {
    //     let pss = [];
    //     ps.map((item, key) => {
    //         pss.push(
    //             <div key={key} style={{ flexBasis: `${item.get('percent')}%` }}>
    //                 <div style={{ width: `${item.get('progress')}%` }}></div>
    //             </div>
    //         );
    //     });
    //     return pss;
    // }

    ulRender(ul) {
        if (!ul) return null;

        let uls = [];
        ul.map((item, key) => {
            uls.push(
                <div key={key} className='progress-dl'>
                    <div>{this.gropress(item.get('ps'))}</div>
                    <div>{item.get('fn')}</div>
                </div>
            );
        });
        return uls;
    }

    showDownloadList(e) {
        const target = e.currentTarget;
        target.style.top = 0;
    }

    hiddenDownloadList(e) {
        const target = e.currentTarget;
        target.style.top = `${0 - (target.offsetHeight - 5)}px`;
    }

    componentDidUpdate() {
        const { prog } = this.props;

        if (prog && prog.get('dl')) {
            prog.get('dl').map((item, key) => {
                if (!this.state[key] && item.get('bloburl') && document.getElementById(`dl_${key}`)) {
                    // console.log('aaaaaa-->', item.get('bl'));
                    this.state[key] = true;
                    document.getElementById(`dl_${key}`).click();
                }
            });
        }
    }

    render() {
        const { prog } = this.props;
        if (!prog) return null;

        const normal = prog.get('nl').get('progress') < 100 ? prog.get('nl').get('progress') : 100;
        const download = prog.get('dl'), upload = prog.get('ul');
        const du = Immutable.Map({}).merge(download, upload);

        let dup = 0, styletop = 0;
        if (download || upload) {
            let loadeds = 0, totals = 0;
            du.map((item, key) => {
                let thisloadeds = 0, thistotals = 0, thisflag = false;
                // console.log(item.get('ps'));
                item.get('ps').map((i, k) => {
                    thisloadeds += i.get('loaded');
                    thistotals += i.get('total');
                    if (i.get('progress') < 100) thisflag = true;
                });
                // console.log('----------dup-ps-------->', thisloadeds, thistotals);
                if (thisflag) {
                    loadeds += thisloadeds;
                    totals += thistotals;
                }

                styletop += 21;
            });
            dup = loadeds > 0 ? Math.floor((loadeds / totals) * 10000) / 100 : 0
        }

        return (
            <div className='progress'
                style={{ height: `${styletop + 5}px`, top: `${0 - styletop}px` }}
                onMouseEnter={this.showDownloadList}
                onMouseLeave={this.hiddenDownloadList}
            >
                {this.ulRender(upload)}
                {this.dlRender(download)}
                <div className='progress-nl'>
                    <div style={{ width: `${normal}%` }}></div>
                    <div style={{ width: `${dup}%` }}></div>
                </div>
            </div>
        );
    }
}
export default Progress;