import React, {Component} from 'react';
import {connect} from 'react-redux';
import CleaningsActions from "../../../actions/cleaningsActions";
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {get} from 'lodash';
import moment from "moment";
import {Link} from "react-router-dom";
import ToolbarBlank from "../../../components/ToolbarBlank";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import BlockUi from 'react-block-ui';

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
    constructor() {
        super();
        this.state = {
            cleaner: undefined
        };
        this.cleanerSelected = this.cleanerSelected.bind(this);
    }

    cleanerSelected(selectedOption) {
        this.setState({
            cleaner: selectedOption
        });
        this.props.getCalendarList({
            perPage: 2000,
            thisMonth: moment(this.props.date).format('YYYY-MM-DD'),
            cleaner_id: get(selectedOption, 'value', '')
        });
    }

    componentDidMount() {
        this.props.getCalendarList({
            perPage: 2000,
            thisMonth: moment(this.props.date).format('YYYY-MM-DD'),
        });
    }


    render() {
        const {cleanings, auth} = this.props;
        const date = this.props.date;
        const events = get(cleanings, 'calendar', []).map((cleaning) => ({
            'title': cleaning.location.building_name + ' ' + cleaning.location.room_number,
            'start': moment(cleaning.cleaning_date).toDate(),
            'end': moment(cleaning.cleaning_date).toDate(),
            'id': cleaning.id,
        }));
        return (
            <div className="pl0 pl3-l pt3 pt0-l fl w-100 w-80-l black-60">
                <div className="fl w-100 ba b--black-10 bg-white br2 pa2 pa3-l">
                    <div className="bg-white pa3 cf">
                        <div className="fl w-20 tl">
                            <Link
                                to={"/cleaning-calendar/month/" + (moment(date).subtract(1, 'month').format('YYYY-MM-DD'))}
                                className='fl ba fw4 f5 input-reset pointer blue b--blue pv1 ph3 br2'
                                onClick={() => {
                                    this.props.getCalendarList({
                                        perPage: 500,
                                        thisMonth: moment(this.props.date).subtract(1, 'months').format('YYYY-MM-DD'),
                                        cleaner_id: get(this.state, 'cleaner.value')
                                    });
                                }}><span className='fa fa-chevron-left dib mr2-ns'/><span
                                className="dn dib-ns">Prev</span>
                            </Link>
                        </div>
                        <div className="fl w-60 tc pv1 gray">
                            <div className="tc">Calendar of{' '}
                                {auth.auth_user.type === 'cleaner' ?
                                    <strong>{get(this.props, 'auth.auth_user.name')}</strong> :
                                    <div className='w4 w5-m w6-l z-999 center pv1'>
                                        <Select value={get(this.state, 'cleaner.value')} name='cleaner'
                                                options={cleanings.cleaners} openOnFocus
                                                placeholder="Everyone"
                                                onChange={this.cleanerSelected}/>
                                    </div>
                                }
                            </div>
                            <div className="f6">{moment(date).format('MMM, YYYY')}</div>
                        </div>
                        <div className="fl w-20 tr">
                            <Link to={"/cleaning-calendar/month/" + (moment(date).add(1, 'month').format('YYYY-MM-DD'))}
                                  className='fr ba fw4 f5 input-reset pointer blue b--blue pv1 ph3 br2'
                                  onClick={() => {
                                      this.props.getCalendarList({
                                          perPage: 500,
                                          thisMonth: moment(this.props.date).add(1, 'months').format('YYYY-MM-DD'),
                                          cleaner_id: get(this.state, 'cleaner.value')
                                      });
                                  }}><span className="dn dib-ns">Next</span><span
                                className='fa fa-chevron-right dib ml2-ns'/>
                            </Link>
                        </div>
                        <BlockUi tag='div' className="fl w-100 bg-white pv4 pt0 vh-100-ns vh-75"
                                 blocking={cleanings.loading_calendar}>
                            <BigCalendar
                                selectable popup
                                date={moment(date).toDate()}
                                components={{toolbar: ToolbarBlank}}
                                onSelectEvent={event => this.props.history.push('/cleanings/' + event.id)}
                                defaultView='month'
                                views={{
                                    month: true
                                }}
                                onNavigate={()=>{}}
                                events={events}/>
                        </BlockUi>
                    </div>

                    {/*<div className="fl w-100">*/}
                    {/*<pre>*/}
                    {/*{JSON.stringify(get(cleanings, 'all'), null, 4)}*/}
                    {/*</pre>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        cleanings: state.cleanings,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getCalendarList: (filterObject) => {
            dispatch(CleaningsActions.getCalendarList(filterObject))
        },
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
