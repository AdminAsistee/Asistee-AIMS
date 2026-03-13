import React, {Component} from 'react';
import Textarea from "react-textarea-autosize";


class EditableTextArea extends Component {
    constructor(props) {
        super();
        this.state = {
            editing: false,
            value: props.value
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleEditing() {
        this.setState((pState) => ({editing: !pState.editing}));
    }

    handleInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            value: value
        });
    }

    handleKeyDown(event) {
        if (event.keyCode === 27) {
            this.toggleEditing();
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
                        {this.props.value ? null : <span className="i f6 black-40 pv1">Not Provided</span>}
                        <button className="input-reset bw0 f7 silver dib v-top ml3 pointer hover-dark-blue link"
                                onClick={this.toggleEditing}>
                            {this.props.value ? <span><span className="fa fa-edit"/> Edit</span> :
                                <span><span className="fa fa-plus green"/> Add</span>}
                        </button>
                    </span> :
                    <span className="dib w-100">
                        <span className="dib w-100">
                            <Textarea className="pa2 w-100" value={this.state.value}
                                   onKeyDown={this.handleKeyDown}
                                   onChange={this.handleInput}/>
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

export default EditableTextArea;
