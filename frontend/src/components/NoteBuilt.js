import React, {Component} from 'react';

class NotBuilt extends Component {

    render() {
        return (
            <div className='flex min-vh-80 w-100 items-center justify-center'>
                <div className='w-100 mw6  black-60'>
                    <h2 className="f2 fw2 tc">This page is not built yet!</h2>
                    <p className='pa3 tc'>Try other links on the menu</p>
                </div>
            </div>
        );
    }
}

export default NotBuilt;
