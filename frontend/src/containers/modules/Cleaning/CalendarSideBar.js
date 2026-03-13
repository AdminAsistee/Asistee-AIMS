import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";

class SideBar extends Component {
    render() {
        return (
            <div className="fl w-100 w-20-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l tc">
                    <h2 className='f4 f3-ns fw2 mv2 black-90 db-ns'>Related Links</h2>
                    <div className='w4 bb bw1 center b--black-10 mb3-ns dn db-l'/>
                    <Link
                        className="dib w-100-l  pa2 pv1 pv2-l pointer purple mb2 mr2 mr0-l"
                        to='/cleanings'>
                        Cleaning List
                    </Link>
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {}
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
