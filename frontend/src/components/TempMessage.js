import React from 'react';

class TempMessage extends React.Component {
    componentDidMount() {
        const {hide_message, msg} = this.props;
        const delay = msg.expire_in;
        setTimeout(() => {
            hide_message(msg.id)
        }, delay * 1000);
    }

    render() {
        const {msg} = this.props;
        return (
            <div className="temp-msg-container">
                {msg.type.toLowerCase() === 'error' ?
                    <div className="white bg-dark-red temp-msg">
                        <h5>
                            {msg.txt}
                        </h5>
                        {msg.list && Object.keys(msg.list).map((item) => (<p key={item}>{msg.list[item][0]}</p>))}
                    </div> :
                    msg.type.toLowerCase() === 'warning' ?
                        <div className="white bg-yellow temp-msg">
                            <h5>
                                {msg.txt}
                            </h5>
                        </div> :
                        msg.type.toLowerCase() === 'success' ?
                            <div className="white bg-green temp-msg">
                                <h5>
                                    {msg.txt}
                                </h5>
                            </div> :
                            <div className="near-black bg-moon-gray temp-msg">
                                <h5>
                                    {msg.txt}
                                </h5>
                            </div>
                }
            </div>
        )
    }
}

export default TempMessage;