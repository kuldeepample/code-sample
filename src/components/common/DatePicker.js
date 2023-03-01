import React from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import _ from 'lodash'


const ReactDatePicker = (props) => {

    let {
        selectsRange,
        placeholderText,
        startDate,
        endDate,
        onChange,
        classes,
        isClearable,
        selected,
        minDate,
        maxDate,
        closeOnScroll,
        handleSelect
    } = props;

    startDate = startDate ? moment(startDate).local().toDate() : null;
    endDate = endDate ? moment(endDate).local().toDate() : null;
    selected = selected ? moment(selected).local().toDate() : null;

    const formatDate = (dateChoosen) => {
        let selectedDate;
        if (_.isArray(dateChoosen)) {
            selectedDate = dateChoosen.map(date => {
                if (date) return moment(date).format('YYYY/MM/DD')
                else return date
            })
        }
        else
            selectedDate = dateChoosen ? moment(dateChoosen).format('YYYY/MM/DD') : '';

        onChange(selectedDate);
    }

    return (
        <DatePicker
            selectsRange={selectsRange}
            placeholderText={placeholderText}
            startDate={startDate}
            endDate={endDate}
            selected={selected}
            onChange={(date) => formatDate(date)}
            className={`dropDown w-100 datePicker ${classes}`}
            isClearable={isClearable}
            minDate={minDate}
            maxDate={maxDate}
            closeOnScroll={closeOnScroll}
            onSelect={(data) => handleSelect && handleSelect(data)}
        />
    )
}

export default ReactDatePicker