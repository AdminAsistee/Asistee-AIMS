import React, {Component} from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

class EditableTimeRange extends Component {
    constructor(props) {
        super();
        this.state = {
            editing: false,
            name1: props.value1,
            name2: props.value2
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleEditing() {
        this.setState((pState) => ({editing: !pState.editing}));
    }

    handleStartChange(val) {
        const hours = val.toDate().getHours() + (val.toDate().getMinutes()) / 60.0;
        this.setState({name1: hours});
    }

    handleEndChange(val) {
        const hours = val.toDate().getHours() + (val.toDate().getMinutes()) / 60.0;
        this.setState({name2: hours});
    }

    onSave() {
        if (this.state.name2 > this.state.name1) {
            this.toggleEditing();
            this.props.onSave(this.props.name1, this.state.name1, this.props.name2, this.state.name2);
        }
        else {
            alert('Invalid Selection. Start time must be less than end time.');
        }
    }

    render() {
        return (
            <span>
                {!this.state.editing ?
                    <div>{this.props.children}
                        {this.props.value1 ? null : <span className="i f6 black-40 pv1">Not Provided</span>}
                        <div className='f6'>
                            <button className="input-reset bw0 f7 silver dib v-top ml3 pointer hover-dark-blue link"
                                    onClick={this.toggleEditing}>
                                <span><span className="fa fa-edit"/> Edit</span>
                            </button>
                        </div>
                    </div> :
                    <span className="dib w-100">
                        <span className="dib w-50 pv2">
                            <TimePicker value={moment().hour(0).minute(0).add(this.state.name1, 'hours')}
                                        showMinute={false}
                                        use12Hours
                                        allowEmpty={false}
                                        onChange={this.handleStartChange}
                                        showSecond={false}/>
                        </span>
                        <span className="dib w-50 pv2">
                            <TimePicker value={moment().hour(0).minute(0).add(this.state.name2, 'hours')}
                                        showMinute={false}
                                        use12Hours
                                        allowEmpty={false}
                                        onChange={this.handleEndChange}
                                        showSecond={false}/>
                        </span>
                        <span className="border-box dib w-20 pl1">
                            <button className="input-reset f7 pointer dib pa2 w-100 white bg-green"
                                    onClick={this.onSave}>Save</button>
                        </span>
                        <span className="border-box dib w-20 pl1">
                            <button className="input-reset f7 pointer dib pa2 w-100 white bg-gray"
                                    onClick={this.toggleEditing}>Cancel</button>
                        </span>
                    </span>
                }
            </span>
        );
    }
}

export default EditableTimeRange;
