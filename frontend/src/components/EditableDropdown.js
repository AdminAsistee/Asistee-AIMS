import React, {Component} from 'react';
import Select from 'react-select';
import {get} from 'lodash';

class EditableDropdown extends Component {
    constructor(props) {
        super();
        this.state = {
            editing: false,
            value: props.value
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.typeSelected = this.typeSelected.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleEditing() {
        this.setState((pState) => ({editing: !pState.editing}));
    }

    typeSelected(selectedOption) {
        // this.setState({
        //     value: get(selectedOption, 'value')
        // });
        // this.onSave();

        this.toggleEditing();
        const val = get(selectedOption, 'value');
        if (val) {
            this.props.onSave(this.props.name, val);
        }
    }

    onSave() {
        this.toggleEditing();
        this.props.onSave(this.props.name, this.state.value);
    }

    render() {
        return (
            <span>
                {!this.state.editing ?
                    <span>{this.props.children}
                        {this.props.value ? null : <span
                            className="i f6 black-40 pv1">{this.props.no_value_placeholder || 'Not Provided'}</span>}
                        <button className="input-reset bw0 f7 silver dib v-top ml3 pointer hover-dark-blue link"
                                onClick={this.toggleEditing}>
                            {this.props.value ? <span><span className="fa fa-edit"/> Change</span> :
                                <span><span className="fa fa-plus green"/> Add</span>}
                        </button>
                    </span> :
                    <span className="dib w-100">
                        <span className="dib w-100">
                            <Select name='type' options={this.props.options}
                                    onChange={this.typeSelected}
                                    value={this.props.value} placeholder='Select Type'/>
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

export default EditableDropdown;
