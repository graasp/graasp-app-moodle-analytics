import React, { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils } from 'react-day-picker';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';
import updateDateById from '../../actions/chartDataByID';
import 'react-day-picker/lib/style.css';
import {
  combineContents,
  fromDate,
  toDate,
} from '../modes/teacher/widgets/util/common';
import { DATE_FORMAT_SHORT_YEAR } from '../../config/settings';

const KeyedDatePicker = ({ id, data, chartDataById }) => {
  const dispatch = useDispatch();
  const initialToday = new Date();

  const [from, setFrom] = useState(initialToday);
  const [fromPrev, setFromPrev] = useState(initialToday);
  const [to, setTo] = useState(initialToday);
  const [enteredTo, setEnteredTo] = useState(initialToday);
  const [modifiers, setModifiers] = useState({ start: from, end: enteredTo });
  const [selectedDays, setSelectedDays] = useState([
    from,
    { from, to: enteredTo },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const PopId = open ? 'simple-popover' : undefined;

  useEffect(() => {
    // get date range from actions
    const dateRange = combineContents(data)?.map((action) =>
      moment(action.timecreated),
    );
    if (dateRange?.length) {
      setFrom(moment.min(dateRange).toDate());
      setTo(moment.max(dateRange).toDate());
    }
  }, [data]);

  useEffect(() => {
    if (from !== null) {
      setFromPrev(from);
    }

    // check on date change
    const prevFrom = fromDate(chartDataById, id);
    const prevTo = toDate(chartDataById, id);
    if (from !== prevFrom || to !== prevTo) {
      dispatch(updateDateById(from, to, id));
    }
  }, [from, to]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSelectingFirstDay = (fromD, toD, day) => {
    const isBeforeFirstDay = fromD && DateUtils.isDayBefore(day, fromD);
    const isRangeSelected = fromD && toD;
    return !fromD || isBeforeFirstDay || isRangeSelected;
  };

  const setLastMonth = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    setFrom(lastMonth);
    setTo(today);
    setEnteredTo(today);
    dispatch(updateDateById(lastMonth, today, id));
    handleClose();
  };

  const setLastWeek = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 6);
    setFrom(lastWeek);
    setTo(today);
    setEnteredTo(today);
    dispatch(updateDateById(lastWeek, today, id));
    handleClose();
  };

  const setToday = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    setFrom(today);
    setTo(today);
    setEnteredTo(today);
    setModifiers({ start: today, end: today });
    setSelectedDays([today, { from: today, to: today }]);
    dispatch(updateDateById(today, today, id));
    handleClose();
  };

  const handleResetClick = () => {
    setFrom(null);
    setTo(null);
    setEnteredTo(null);
  };

  const handleDayClick = (day) => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    if (day > today) {
      return;
    }
    if (from && to && day >= from && day <= to) {
      handleResetClick();
      return;
    }
    if (isSelectingFirstDay(from, to, day)) {
      setFrom(day);
      setTo(null);
      setEnteredTo(null);
    } else {
      setTo(day);
      setEnteredTo(day);
      dispatch(updateDateById(from, day, id));
      handleClose();
    }
  };

  const handleDayMouseEnter = (day) => {
    const today = new Date();
    if (from && to) {
      return;
    }

    if (day > today) {
      setEnteredTo(today);
      return;
    }

    if (!isSelectingFirstDay(from, to, day)) {
      setEnteredTo(day);
    }
  };

  const toDateString = () => {
    if (to !== null) {
      return moment(to).format(DATE_FORMAT_SHORT_YEAR);
    }
    return ' ';
  };

  const fromDateString = () => {
    if (from !== null) {
      return moment(from).format(DATE_FORMAT_SHORT_YEAR);
    }
    return ' ';
  };

  const after = () => {
    const today = new Date();
    if (to !== null) {
      return to;
    }
    return today;
  };
  useEffect(() => {
    setModifiers({ start: from, end: enteredTo });
    setSelectedDays([from, { from, to: enteredTo }]);
  }, [from, enteredTo]);

  return (
    <div>
      <Box display="flex" justifyContent="center" mt={2} mx={5} px={3} pb={3}>
        <TextField
          aria-describedby={PopId}
          label="From"
          value={fromDateString()}
          onClick={handleClick}
        />
        <TextField
          aria-describedby={PopId}
          label="To"
          value={toDateString()}
          onClick={handleClick}
        />
      </Box>
      <Popover
        id={PopId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ width: '100%' }}>
          <Box display="flex">
            <Box mt={2} ml={1}>
              <Box
                display="flex"
                flexDirection="column"
                p={1}
                m={1}
                bgcolor="background.paper"
                justifyContent="center"
              >
                <Button onClick={setToday}>Today</Button>
                <Divider />

                <Button onClick={setLastWeek}>Last Week</Button>
                <Divider />

                <Button onClick={setLastMonth}>Last Month</Button>

                <Box
                  display="flex"
                  flexDirection="row"
                  p={1}
                  mt={2}
                  justifyContent="center"
                />
              </Box>
            </Box>
            <Box p={1} flexGrow={1}>
              <DayPicker
                month={fromPrev}
                className="Range"
                numberOfMonths={2}
                selectedDays={selectedDays}
                disabledDays={{
                  after: after(),
                  before: from,
                }}
                modifiers={modifiers}
                onDayClick={handleDayClick}
                onDayMouseEnter={handleDayMouseEnter}
              />
              <div>
                {!from && !to && 'Please select the first day.'}
                {from && !to && 'Please select the last day.'}
              </div>
              <Helmet>
                <style>
                  {`
                  .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                  background-color:rgba(222,202,255,0.44) !important;
                  color: #988BFF;
                }
                  .Range .DayPicker-Day {
                  border-radius: 0 !important;
                }
                  .Range .DayPicker-Day--start {
                  border-top-left-radius: 50% !important;
                  border-bottom-left-radius: 50% !important;
                }
                  .Range .DayPicker-Day--end {
                  border-top-right-radius: 50% !important;
                  border-bottom-right-radius: 50% !important;
                }
                .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside){
                
                background-color: #5050d2 !important;
                }
                .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover{
                background-color: #5050d2 !important;

                }
                  `}
                </style>
              </Helmet>
            </Box>
          </Box>
        </div>
      </Popover>
    </div>
  );
};

KeyedDatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  chartDataById: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

KeyedDatePicker.defaultProps = {
  data: null,
};

const mapStateToProps = ({
  appInstanceResources: { content },
  chartDataById,
}) => ({
  data: content,
  chartDataById,
});

export default connect(mapStateToProps)(KeyedDatePicker);
