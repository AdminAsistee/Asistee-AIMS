import React, {Component} from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import moment from 'moment';

class EditableDate extends Component {
    constructor() {
        super();
        this.state = {
            editing: false,
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleEditing() {
        this.setState((pState) => ({editing: !pState.editing}));
    }

    onSave(day) {
        this.toggleEditing();
        this.props.onSave(this.props.name, moment(day).format('YYYY-MM-DD'));
    }

    render() {
        return (
            <span>
                {!this.state.editing ?
                    <span>{this.props.children}
                        {this.props.value ? null : <span className="i f6 black-40 pv1">Not Provided</span>}
                        <button className="input-reset bw0 f7 silver dib v-top ml3 pointer hover-dark-blue link"
                                onClick={this.toggleEditing}>
                            {this.props.value ? <span><span className="fa fa-edit"/> Change</span> :
                                <span><span className="fa fa-plus green"/> Add</span>}
                        </button>
                    </span> :
                    <span className="dib w-100">
                        <span className="dib w-100">
                            <DayPickerInput onDayChange={this.onSave}
                                            placeholder={moment(this.props.value).utcOffset('+09:00').format('YYYY-MM-DD')}
                                            dayPickerProps={{
                                                selectedDays: moment(moment(this.props.value).utcOffset('+09:00').format('YYYY-MM-DD')).toDate(),
                                                month: moment(this.props.value).toDate(),
                                            }}/>
                        </span>
                    </span>
                }
            </span>
        );
    }
}

export default EditableDate;
