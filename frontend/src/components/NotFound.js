import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class NotFound extends Component {

    render() {
        return (
            <div className='flex min-vh-80 w-100 items-center justify-center'>
                <div className='w-100 mw6  black-60'>
                    <h2 className="f2 fw2 tc">You're not supposed to be here!</h2>
                    <p className='pa3'>You probably clicked on a broken or outdated link. <Link to='/'>Go Home</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default NotFound;
