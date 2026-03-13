import React, {Component} from 'react';
import {connect} from 'react-redux';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";
import ToolbarBlank from "../../../components/ToolbarBlank";
import BlockUi from 'react-block-ui';
import CleaningsActions from "../../../actions/cleaningsActions";
import {get} from 'lodash';
import BookingsActions from "../../../actions/bookingsActions";

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {

    componentDidMount() {
        this.props.getCalendarListCleaning({
            perPage: 2000,
            thisMonth: moment(this.props.date).format('YYYY-MM-DD'),
            location_id: this.props.match.params.id,
        });
        if (this.props.auth.auth_user.type !== 'cleaner') {
            this.props.getCalendarListBooking({
                perPage: 2000,
                thisMonth: moment(this.props.date).format('YYYY-MM-DD'),
                location_id: this.props.match.params.id,
            });
        }
    }

    render() {
        const date = this.props.date;
        const {cleanings, bookings} = this.props;
        const cleaning_events = get(cleanings, 'calendar', []).map((cleaning) => ({
            'title': 'Cleaning',
            'type': 'cleaning',
            'start': moment(cleaning.cleaning_date).toDate(),
            'end': moment(cleaning.cleaning_date).toDate(),
            'id': cleaning.id,
        }));
        const booking_events = get(bookings, 'calendar', []).map((booking) => ({
            'title': 'Booking',
            'type': 'booking',
            'start': moment(moment(booking.checkin).utcOffset('+09:00').format('YYYY-MM-DD')).toDate(),
            'end': moment(moment(booking.checkout).utcOffset('+09:00').format('YYYY-MM-DD')).add(9, 'hours').toDate(),
            'id': booking.id,
        }));

        let events = [...booking_events, ...cleaning_events];

        return (
            <div className="bg-white pa2 cf">
                <BlockUi tag='div' className="fl w-100 bg-white pv4 pt0 vh-75-ns vh-75"
                         blocking={cleanings.loading_calendar}>
                    <BigCalendar
                        selectable popup
                        date={moment(date).toDate()}
                        components={{toolbar: ToolbarBlank}}
                        onSelectEvent={event => {
                            if (event.type === 'booking') {
                                this.props.history.push('/bookings/' + event.id)
                            }
                            else if (event.type === 'cleaning') {
                                this.props.history.push('/cleanings/' + event.id)
                            }
                        }}
                        defaultView='month'
                        views={{
                            month: true
                        }}
                        onNavigate={() => {
                        }}
                        events={events}/>
                </BlockUi>
                {/*<div className="fl w-100">*/}
                {/*<pre>*/}
                {/*{JSON.stringify(get(cleanings, 'all'), null, 4)}*/}
                {/*</pre>*/}
                {/*</div>*/}
            </div>
        );
    }
}


// map state
function mapStateToProps(state) {
    return {
        auth: state.auth,
        cleanings: state.cleanings,
        bookings: state.bookings,
    }
}

// map dispatch
function mapDispatchToProps(dispatch) {
    return {
        getCalendarListCleaning: (cleaningFilterObject) => {
            dispatch(CleaningsActions.getCalendarList(cleaningFilterObject));
        },
        getCalendarListBooking: (bookingFilterObject) => {
            dispatch(BookingsActions.getCalendarList(bookingFilterObject))
        }
    }
}

// connect and export
export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
