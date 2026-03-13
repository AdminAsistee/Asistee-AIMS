import React, {Component} from 'react';
import {connect} from 'react-redux';
import CleaningsActions from "../../../actions/cleaningsActions";
import {get, indexOf} from 'lodash';
import BlockUi from 'react-block-ui';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class CleanerEntry extends Component {
    constructor() {
        super();
        this.shouldBlock = this.shouldBlock.bind(this);
        this.toggleSelectingCleaner = this.toggleSelectingCleaner.bind(this);
        this.cleanerSelected = this.cleanerSelected.bind(this);
        this.assignMe = this.assignMe.bind(this);
        this.state = {
            selectingCleaner: false
        };
    }

    shouldBlock() {
        return (indexOf(this.props.cleanings.updating, this.props.cleaning.id) !== -1);
    }

    toggleSelectingCleaner() {
        this.setState((pState) => ({selectingCleaner: !pState.selectingCleaner}))
    }

    cleanerSelected(selectedOption) {
        this.props.assignCleaner(this.props.cleaning.id, selectedOption.value);
        this.toggleSelectingCleaner();
    }

    assignMe() {
        this.props.assignMe(this.props.cleaning.id);
    }

    render() {
        const {cleaning, cleanings, unassignCleaner, auth} = this.props;
        const cleaner = get(cleaning, 'cleaner');
        return (
            <BlockUi tag='div' blocking={this.shouldBlock()}>
                {cleaner ?
                    <div>
                        <div>{get(cleaner, 'name')}
                            {(auth.auth_user.type === 'cleaner' || auth.auth_user.type === 'client') ? null :
                                <button className="fa fa-close pointer bw0 bg-transparent washed-red hover-red link"
                                        onClick={() => {
                                            unassignCleaner(cleaning.id)
                                        }}/>}
                        </div>
                        <div className='f6 black-40 pt1 dn db-l'>{get(cleaner, 'phone')}</div>
                        <div className='f6 black-40 pv1 dn db-l'>{get(cleaner, 'email')}</div>
                    </div>
                    :
                    this.state.selectingCleaner ?
                        <Select name={'cleaner' + cleaning.id} options={cleanings.cleaners} autoFocus openOnFocus
                                onChange={this.cleanerSelected}/>
                        :
                        auth.auth_user.type === 'cleaner' ?
                            <button className="pa1 input-reset b--light-green bg-transparent black-50 f6 pointer"
                                    onClick={this.assignMe}>
                                <span className="fa fa-user-plus green"/> Assign Me
                                <span
                                    className="dib f7 b green pl1">&#165; {get(cleaning, 'location.default_staff_cleaning_payout')}</span>
                            </button> :
                            auth.auth_user.type === 'client' ?
                                <p className="f6 black-30">No cleaner assigned</p> :
                                <button className="pa1 input-reset b--light-green bg-transparent black-50 f6 pointer"
                                        onClick={this.toggleSelectingCleaner}>
                                    <span className="fa fa-user-plus green"/> Assign</button>}
            </BlockUi>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        cleanings: state.cleanings,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        unassignCleaner: (id) => {
            dispatch(CleaningsActions.unassignCleaner(id))
        },
        assignCleaner: (cleaningId, cleanerId) => {
            dispatch(CleaningsActions.assignCleaner(cleaningId, cleanerId))
        },
        assignMe: (cleaningId) => {
            dispatch(CleaningsActions.assignMe(cleaningId))
        },

    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(CleanerEntry);
