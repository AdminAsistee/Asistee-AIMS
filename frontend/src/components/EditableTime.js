import React, {Component} from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

class EditableTime extends Component {
    constructor(props) {
        super();
        this.state = {
            editing: false,
            name: props.value,
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleEditing() {
        this.setState((pState) => ({editing: !pState.editing}));
    }

    handleTimeChange(val) {
        let str = val.toDate().getHours() + ':' + val.toDate().getMinutes() + ':00';
        this.setState({name: str});
    }

    onSave() {
        this.toggleEditing();
        this.props.onSave(this.props.name, this.state.name);
    }

    render() {
        let time_fragments = this.state.name ? this.state.name.split(':') : [0, 0, 0];
        return (
            <span>
                {!this.state.editing ?
                    <div>{this.props.children}
                        {this.props.value ? null : <span className="i f6 black-40 pv1">Not Provided</span>}
                        <span className='f6'>
                            <button className="input-reset bw0 f7 silver dib v-top ml3 pointer hover-dark-blue link"
                                    onClick={this.toggleEditing}>
                                <span><span className="fa fa-edit"/> Edit</span>
                            </button>
                        </span>
                    </div> :
                    <span className="dib w-100">
                        <span className="dib w-50 pv2">
                            <TimePicker
                                value={moment().hour(0).minute(0).second(0).add(time_fragments[0], 'hours').add(time_fragments[1], 'minutes')}
                                showMinute={true}
                                use12Hours
                                allowEmpty={false}
                                onChange={this.handleTimeChange}
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

export default EditableTime;
