import React, {Component} from 'react';
import {connect} from 'react-redux';
import BookingsActions from "../../../actions/bookingsActions";
import TableReloader from "../../../components/TableReloader";
import LoaderCenter from "../../../components/LoaderCenter";
import Table from "./Table";

class TableWrapper extends Component {
    render() {
        const {bookings, getList, getNextPage} = this.props;
        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="cf">
                        <div className="fl w-40">
                            <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Bookings {bookings.loaded ?
                                <small>
                                    ({bookings.all.length + '/' + bookings.page.total})</small> : null}</h2>
                            <div className='fl w5 bb bw1 b--black-10 ml2'/>
                        </div>
                        {bookings.loaded ?
                            <TableReloader loading={bookings.loading} last_loaded_on={bookings.last_loaded_on}
                                           getList={getList}/> : null}
                    </div>

                    {bookings.loading ? <LoaderCenter/> : <Table/>}
                    {(bookings.loading_page) ?
                        <LoaderCenter/> :
                        (bookings.loaded && !bookings.loading) ?
                            <div className="tc pt3 pb1">
                                <div className="f7 black-50 pv2">Showing {bookings.all.length + ' '}
                                    of {bookings.page.total}</div>
                                {bookings.page.next_page_url ?
                                    <button className="input-reset pv2 ph3 f5 pointer green b--green"
                                            onClick={() => {
                                                getNextPage(bookings.page.next_page_url)
                                            }}>
                                        Load More
                                    </button> : null}
                            </div> : null
                    }
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        bookings: state.bookings
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(BookingsActions.getList())
        },
        getNextPage: (url) => {
            dispatch(BookingsActions.getNextPage(url))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(TableWrapper);
