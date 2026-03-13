import React, {Component} from 'react';
import {ScaleLoader} from 'halogenium';

class LoaderCenter extends Component {

    render() {
        return (
            <div className='w-100 pv4 tc'>
                <ScaleLoader color={'#F09169'}/>
            </div>
        );
    }
}

export default LoaderCenter;
