import React, {Component} from 'react';
import moment from 'moment'

class TableReloader extends Component {
    constructor(props) {
        super();
        this.state = {
            updated_string: this.getDiff(props.last_loaded_on)
        };
    }

    componentDidMount() {
        this.intervalTimer = setInterval(() => {
            this.setState({
                updated_string: this.getDiff(this.props.last_loaded_on)
            })
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalTimer);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            updated_string: this.getDiff(nextProps.last_loaded_on)
        })
    }

    getDiff(time) {
        return moment(moment().diff(time)).format("mm:ss[s]") + ' ago';
    }

    render() {
        const {getList, loading} = this.props;
        return (
            <div className="fl w-60 tr">
                <div className='black-30 f7'>
                    {loading ? 'Reloading...' : ('Updated ' + this.state.updated_string)}</div>
                <div className='pt1'>
                    <button className='fw3 f7 input-reset pointer green b--green pv1 ph2 br1'
                            onClick={getList}>Reload
                    </button>
                </div>
            </div>
        );
    }
}

export default TableReloader;
