import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import BlockUi from "react-block-ui";
import {get} from 'lodash/object';
import LocationsActions from "../../../actions/locationsActions";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import './addform.css';
import moment from 'moment';
import CleaningsActions from "../../../actions/cleaningsActions";
import types from "../../../actions/types";

class AddForm extends Component {
    constructor() {
        super();
        this.state = {
            location_id: null,
        };

        this.handleInput = this.handleInput.bind(this);
        this.shouldDisable = this.shouldDisable.bind(this);
        this.locationSelected = this.locationSelected.bind(this);
        this.dateSelected = this.dateSelected.bind(this);
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    locationSelected(selectedOption) {
        this.setState({
            location_id: get(selectedOption, 'value')
        });
    }

    dateSelected(day) {
        this.setState({
            cleaning_date: moment(day).format('YYYY-MM-DD')
        });
    }

    shouldDisable() {
        return (!(this.state.location_id && this.state.cleaning_date))
    }

    componentDidMount() {
        this.props.addFilter({perPage: 500});
        this.props.getLocations();
    }


    render() {
        const {cleanings, addCleaning, locations} = this.props;

        const locationOptions = get(locations, 'all', []).map(location => ({
            value: location.id,
            label: location.building_name + ' (Room: ' + location.room_number + ') - ' + location.address,
        }));

        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="cf">
                        <div className="w-100">
                            <BlockUi tag='div' blocking={cleanings.adding_cleaning}>
                                <form className='add-user-form bg-white mt3 pa2'>
                                    <div className="pb3 fl w-100 w-50-l pr2-l">
                                        <Select name='type' options={locationOptions} onChange={this.locationSelected}
                                                value={this.state.location_id} placeholder='Select Property'/>
                                    </div>
                                    <div className="pb3 fl w-100 w-50-l picker-wrap pl2-l">
                                        <DayPickerInput onDayChange={this.dateSelected}
                                                        placeholder='Select Cleaning Date'
                                                        value={this.state.cleaning_date ? moment(this.state.cleaning_date).utcOffset('+09:00').format('YYYY-MM-DD') : null}
                                                        dayPickerProps={{
                                                            selectedDays: moment(moment(this.state.cleaning_date).utcOffset('+09:00').format('YYYY-MM-DD')).toDate(),
                                                            month: moment(this.state.cleaning_date).toDate(),
                                                        }}/>
                                    </div>

                                    <button
                                        className="pointer pa3 input-reset br2 white bg-dark-green bw0 w-100 dis-bg-black-20 dis-white-70"
                                        disabled={this.shouldDisable()}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addCleaning(this.state)
                                        }}>Add Cleaning
                                    </button>
                                </form>
                            </BlockUi>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        cleanings: state.cleanings,
        locations: state.locations,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getLocations: () => {
            dispatch(LocationsActions.getList())
        },
        addCleaning: (data) => {
            dispatch(CleaningsActions.addNew(data));
            dispatch({type: types.CLEANINGS_TOGGLE_ADD_FORM});
        },
        addFilter: (filterObject) => {
            dispatch(LocationsActions.addFilter(filterObject))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(AddForm);
