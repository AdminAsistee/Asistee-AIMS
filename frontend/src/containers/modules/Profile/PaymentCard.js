import React, {Component} from 'react'
import {connect} from 'react-redux';
import {injectStripe} from 'react-stripe-elements';
import {CardElement} from 'react-stripe-elements';
import messageActions from "../../../actions/messageActions";
import BlockUi from 'react-block-ui';
import {trim, lowerCase, get} from 'lodash';
import profileActions from "../../../actions/profileActions";
import amexLogo from "../../../images/cards/amex.svg";
import dinersLogo from "../../../images/cards/diners.svg";
import discoverLogo from "../../../images/cards/discover.svg";
import jcbLogo from "../../../images/cards/jcb.svg";
import mastercardLogo from "../../../images/cards/mastercard.svg";
import visaLogo from "../../../images/cards/visa.svg";

class PaymentCard extends Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.changeCard = this.changeCard.bind(this);
        this.cancelChangeCard = this.cancelChangeCard.bind(this);
        this.state = {
            name: '',
            connecting_stripe: false,
            change_card: false,
        }
    }

    mapBrandToLogo(brand) {
        switch (lowerCase(brand)) {
            case 'amex':
            case 'american express':
                return amexLogo;
            case 'diners':
            case 'diners club':
                return dinersLogo;
            case 'discover':
                return discoverLogo;
            case 'jcb':
                return jcbLogo;
            case 'mastercard':
            case 'master card':
                return mastercardLogo;
            case 'visa':
                return visaLogo;
            default:
                return visaLogo;
        }
    }

    changeCard() {
        this.setState({
            change_card: true,
        })
    }

    cancelChangeCard() {
        this.setState({
            change_card: false,
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({connecting_stripe: true});
        if (trim(this.state.name) === '') {
            this.props.showError('Some required fields are missing');
            this.setState({connecting_stripe: false});
            return;
        }
        this.props.stripe.createToken({name: this.state.name}).then(({token}) => {
            if (token) {
                this.props.saveCard(token);
            }
            this.setState({connecting_stripe: false});
        });
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            change_card: false,
            connecting_stripe: false,
        })
    }


    render() {
        const user = this.props.auth.auth_user;
        const payment_added = (get(user, 'card_last_four.length') === 4);
        return (
            <div className="fl w-100 ba b--black-10 bg-white br2 pa3 pa4-l mb3">
                <div className="fl w-100 b--black-10 f3 mb2 fw2">Payment Info</div>
                <div className="fl w-100 mb1">
                    {(payment_added && !this.state.change_card && !this.props.profile.saving_payment) ?
                        <div className={'mt3'}>
                            <div className='shadow-3 pa3'>
                                <img className="h2 dib v-mid" src={this.mapBrandToLogo(user.card_brand)}
                                     alt={user.card_brand}/>
                                <span className="f3 dib pl2 v-mid">XXXX XXXX XXXX {user.card_last_four}</span>
                                <div className="f7 silver pt2 dib w-100">Securely saved on{' '}
                                    <a target="_blank" rel="noopener noreferrer" className="link black-70 hover-black-40"
                                       href="https://stripe.com/">Stripe</a>
                                </div>
                                <div className='w-100'>
                                    <button onClick={this.changeCard}
                                            className="f6 input-reset pa2 mt3 br2 bw0 bg-gray hover-bg-green white pointer">
                                        Change Card
                                    </button>
                                </div>
                            </div>

                        </div> :
                        <BlockUi tag='div' blocking={this.props.profile.saving_payment || this.state.connecting_stripe}>
                            <form onSubmit={this.handleSubmit} className="cf">
                                <input className="f4 input-reset pa2 mv2 w-100 br2 ba b--light-green"
                                       placeholder='Name On Card'
                                       type="text" name='name' value={this.state.name} onChange={this.handleInput}/>
                                <CardElement className="ba b--light-green pa2 br2 mv2"
                                             style={{base: {fontSize: '18px'}}}/>
                                <button
                                    className={"fl db f4 input-reset pa2 mv2 br2 bw0 bg-green white pointer " + (payment_added ? 'w-70' : 'w-100')}>
                                    {payment_added ? 'Change Card' : 'Add Card'}
                                </button>
                                {payment_added ?
                                    <div className="fl w-30 pl2">
                                        <button
                                            className="db w-100 f4 input-reset pa2 mv2 br2 bw0 bg-gray white pointer"
                                            onClick={this.cancelChangeCard}>Cancel
                                        </button>
                                    </div> : null}
                            </form>
                        </BlockUi>
                    }
                </div>
            </div>
        )
    }
}

// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        profile: state.profile,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        showError: (msg) => {
            dispatch(messageActions.customError(msg))
        },
        saveCard: (stripe) => {
            dispatch(profileActions.saveCard(stripe))
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(PaymentCard));
