import React, {Component} from 'react';
import {connect} from 'react-redux';
import {get} from 'lodash';
import LocationsActions from "../../../actions/locationsActions";
import TableReloader from "../../../components/TableReloader";
import LoaderCenter from "../../../components/LoaderCenter";
import Table from "./Table";

class TableWrapper extends Component {
    render() {
        const {locations, getList, getNextPage} = this.props;
        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="cf">
                        <div className="fl w-40">
                            <h2 className='fl fw2 mv2 black-90 fl w-100 pl2'>Locations {get(locations, 'loaded') ?
                                <small>
                                    ({get(locations, 'all.length') + '/' + get(locations, 'page.total')})</small> : null}</h2>
                            <div className='fl w5 bb bw1 b--black-10 ml2'/>
                        </div>
                        {get(locations, 'loaded') ?
                            <TableReloader loading={get(locations, 'loading')}
                                           last_loaded_on={get(locations, 'last_loaded_on')}
                                           getList={getList}/> : null}
                    </div>

                    {get(locations, 'loading') ?
                        <LoaderCenter/> :
                        <Table/>
                    }
                    {(get(locations, 'loading_page')) ?
                        <LoaderCenter/> :
                        (get(locations, 'loaded') && !get(locations, 'loading')) ?
                            <div className="tc pt3 pb1">
                                <div className="f7 black-50 pv2">Showing {get(locations, 'all.length') + ' '}
                                    of {get(locations, 'page.total')}</div>
                                {get(locations, 'page.next_page_url') ?
                                    <button className="input-reset pv2 ph3 f5 pointer green b--green"
                                            onClick={() => {
                                                getNextPage(get(locations, 'page.next_page_url'))
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
        locations: state.locations
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getList: () => {
            dispatch(LocationsActions.getList())
        },
        getNextPage: (url) => {
            dispatch(LocationsActions.getNextPage(url))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(TableWrapper);
