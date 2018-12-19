import React from 'react';
import PropTypes from 'prop-types';

class Mask extends React.Component {
    static propTypes = {
        show: PropTypes.bool
    }

    componentWillMount() {
        const { show } = this.props;
        // const body = document.querySelector('body');
        // body.style.overflow = show ? 'hidden' : 'auto';
        document.querySelector('body').style.overflow = show ? 'hidden' : 'auto';
    }
    componentWillUpdate(nextProps) {
        const { show } = nextProps;
        document.querySelector('body').style.overflow = show ? 'hidden' : 'auto';
    }

    render() {
        const { show } = this.props;
        return <div className='mask' style={{ display: `${show ? '' : 'none'}` }}></div>
    }
}
export default Mask;