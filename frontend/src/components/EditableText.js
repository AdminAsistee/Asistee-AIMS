import React, {Component} from 'react';

class EditableText extends Component {
    constructor(props) {
        super();
        this.state = {
            editing: false,
            value: props.value
        };
        this.toggleEditing = this.toggleEditing.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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

    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.onSave(this.state);
        }
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
                        <span className="dib w-60">
                            <input className="pa2 w-100" type="text" value={this.state.value}
                                   onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress}
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

export default EditableText;
