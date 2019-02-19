import React from 'react';
import PropTypes from 'prop-types';
// import {Grid, Row, Col} from 'react-bootstrap';

class Progress extends React.Component {
    static propTypes = {
        prog: PropTypes.object
    }

    constructor() {
        super();

    }

    dlgropress(ps) {
        let pss = [];
        // for(let i=0;i<ps.size;i++){
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
                <div id={key} key={key} className='progress-dl'>
                    <div>{this.dlgropress(item.get('ps'))}</div>
                    { item.get('bl') ?
                        <div><a href={item.get('bl')} download={item.get('fn')}>{item.get('fn')}</a></div>
                        : <div>{item.get('fn')}</div>
                    }
                </div>
            );
        });
        return dls;
    }

    render() {
        const { prog } = this.props;
        if (!prog) return null;

        const normal = prog.get('nl').get('progress') < 100 ? prog.get('nl').get('progress') : 100;
        const download = prog.get('dl');
        return (
            <div className='progress'>
                {this.dlRender(download)}
                <div className='progress-nl'>
                    <div style={{ width: `${normal}%` }}></div>
                    <div></div>
                </div>
            </div>
        );
    }
}
export default Progress;