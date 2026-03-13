import React, {Component} from 'react'
import {connect} from 'react-redux';
import NameCard from './NameCard';
import ContactCard from './ContactCard';
import PaymentCard from './PaymentCard';
import {Elements} from 'react-stripe-elements';

class Profile extends Component {
    render() {
        const user = this.props.auth.auth_user;
        return (
            <div className="fl w-100 pt3">
                <div className="fl w-100 w-40-m w-30-l black-60">
                    <NameCard/>
                </div>

                <div className="pl0 pl3-ns pt3 pt0-ns fl w-100 w-60-m w-70-l black-60">
                    <ContactCard/>
                    {user.type === 'client' ?
                        <Elements>
                            <PaymentCard/>
                        </Elements> : null}
                </div>
            </div>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        authState: state.authState,
        auth: state.auth
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
