import React, {Component} from 'react';

class EditableTextPair extends Component {
    constructor(props) {
        super();
        this.state = {
            editing: false,
            name1: props.value1,
            name2: props.value2
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
        const name = target.name;

        this.setState({
            [name]: value
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
        this.props.onSave(this.props.name1, this.state.name1, this.props.name2, this.state.name2);
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
                                {this.props.value1 ? <span><span className="fa fa-edit"/> Edit</span> :
                                    <span><span className="fa fa-plus green"/> Add</span>}
                            </button>
                        </div>
                    </div> :
                    <span className="dib w-100">
                        <span className="dib w-50">
                            <input className="pa2 w-100 baskerville i" type="text" name="name1" value={this.state.name1}
                                   onKeyDown={this.handleKeyDown} onKeyPress={this.handleKeyPress}
                                   onChange={this.handleInput}/>
                        </span>
                        <span className="dib w-50">
                            <input className="pa2 w-100 baskerville i" type="text" name="name2" value={this.state.name2}
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

export default EditableTextPair;
