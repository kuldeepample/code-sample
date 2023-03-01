import check from '@images/check.png'
import checkWarning from '@images/checkWarning.png'
import checkDanger from '@images/checkDanger.png'
import reportAed from '@images/reportAed.png'
import reportLocation from '@images/reportLocation.png'
import reportPeople from '@images/reportPeople.png'
import accessoryReport from '@images/accessoryReport.png'
import inspectionReport from '@images/inspectionReport.png'
import documentReport from '@images/documentReport.png'
import activityReport from '@images/activityReport.png'
import medicationReport from '@images/medicationReport.png'
import credentialReport from '@images/credentialReport.png'
import courseReport from '@images/courseReport.png'
import moment from 'moment'
import _ from 'lodash'
import * as config from '../config'

// export const getAccessoryImage = (slug, exp) => {
//     if (exp) {
//         if (moment(exp).diff(moment(), 'days') >= 30) {
//             if (slug === 'battery') return battery
//             if (slug === 'pad') return pad
//         }
//         else if (moment(exp).diff(moment()) > 0) {
//             if (slug === 'battery') return batteryWarning
//             if (slug === 'pad') return padWarning
//         }
//         else {
//             if (slug === 'battery') return batteryDanger
//             if (slug === 'pad') return padDanger
//         }
//     }
//     else if (slug) { /* AS Level Of compliance status */
//         if (slug === 'info') return check;
//         if (slug === 'warning') return checkWarning;
//         if (slug === 'danger') return checkDanger;
//         if (slug === 'battery') return batterydisabled
//         if (slug === 'pad') return padDisabled
//     }
// }

export const getRightIcon = (level) => {
    if (level === 'info') return check;
    if (level === 'warning') return checkWarning;
    if (level === 'danger') return checkDanger;
}

export const getAccessoryColor = (exp) => {
    let data = JSON.parse(localStorage.getItem('token'));
    let expiring = (data?.user?.account) ? data.user.account?.setting?.expiringSoon : data.account?.setting?.expiringSoon

    if (moment(exp).diff(moment(), 'days') >= (expiring || config.ACCESSORIES_WARNING_DAYS)) return 'green'
    else
        if (moment(exp).diff(moment()) > 0) return 'yellow'
        else return 'red'
}

// export const getInspectionAccessoryImage = (slug, installed) => {
//     // if (!_.isUndefined(installed)) {
//     if (installed) {
//         if (slug === 'battery') return battery
//         if (slug === 'pad') return pad
//     }
//     else {
//         if (slug === 'battery') return batteryDanger
//         if (slug === 'pad') return padDanger
//     }
//     // }
//     // else {
//     //     if (slug === 'battery') return batterydisabled
//     //     if (slug === 'pad') return padDisabled
//     // }
// }

export const getQueryParams = (data) => {
    const ret = [];
    for (let d in data) {
        if (_.isObject(data[d]) || _.isArray(data[d])) {
            for (let arrD in data[d]) {
                ret.push(`${encodeURIComponent(d)}[]=${encodeURIComponent(data[d][arrD])}`)
            }
        } else if (_.isNull(data[d]) || _.isUndefined(data[d])) {
            ret.push(encodeURIComponent(d))
        } else {
            ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`)
        }
    }
    return ret.join('&');
}

const calcDuration = (days, bool) => {
    if (days === 0 && bool)
        return '0 day';
    if (days > 0 && days < 7 && bool) {
        return days + (' day');
    }
    if (days > 6 && days < 31 && bool) {
        let wk = Math.floor(days / 7) + (' wk ')
        let day = "";
        if (days % 7)
            day = calcDuration(days % 7, --bool)
        return wk + day;
    }
    if (days > 30 && days < 365 && bool) {
        let mo = Math.floor(days / 30) + (' mo ');
        let wk = "";
        if (days % 30)
            wk = calcDuration(days % 30, --bool);
        return mo + wk;
    }
    if (days >= 365 && bool) {
        let year = Math.floor(days / 365) + (' yrs ');
        let mo = 0;
        if (days % 365)
            mo = calcDuration(days % 365, --bool)
        return year + mo
    }
    return '';
}
/* EXpiration date on inspection detail */
export const getExpirationDate = (expiration) => {
    if (expiration) {

        let exp = moment(expiration)
        let daysSince = exp.diff(moment(), 'days');
        if (moment().isBefore(exp)) {
            return exp.format('MM/DD/YYYY') + " (" + calcDuration(daysSince, 2) + ")"
            //             let yrs = moment(exp).diff(moment(), 'years');
            //             let mo = moment(exp).diff(moment(), 'month') - yrs * 12;
            //             let wk = Math.round(moment(exp).diff(moment(), 'week') - mo * 4.2);
            //             let day = (moment(exp).diff(moment(), 'days') - wk * 7) || '0';
            //             // let hrs = moment(exp).diff(moment(), 'hour') - day * 24;
            //             // let min = moment(exp).diff(moment(), 'minutes') - hrs * 60;
            //             // let sec = moment(exp).diff(moment(), 'seconds') - min * 60;
            //             return (exp.format('MM/DD/YYYY') + " ( " +
            //                 (yrs ? (yrs + "yrs ") : '') +
            //                 (mo ? (mo + "mo ") : '') +
            //                 (!yrs && wk ? (wk + "week ") : '') +
            //                 (!mo && day ? (day + "day ") : '') +
            //                 // (!wk && hrs ? (hrs + "hrs ") : '') +
            //                 // (!day && min ? (min + "min ") : '') +
            //                 // (!hrs && sec ? (sec + "sec ") : '') +
            //                 " )")
        }
        else {
            return exp.format('MM/DD/YYYY') + " ( " + exp.startOf('min').fromNow() + " )";
            // return exp.format('MM/DD/YYYY') + " ( " + (exp.diff(moment(), 'days') ? exp.startOf('day').fromNow() : "Today") + " )";
        }
    }
    else return '-'
}

/* Changing serial_number key as name for dropdown */
export const getEquipments = (equipmet_list) => {
    let data = { serial_number: "name" }
    let equipments = (equipmet_list || []).map((key) => {
        return _.mapKeys(key, (v, keyName) => { return keyName in data ? data[keyName] : keyName; })
    })
    return equipments
}

export const changeDataKeys = (dataList, keysObj, isPeople) => {
    // let data = { [keyToChange]: ToKeyName || "name" }
    let data = keysObj
    let newDataList = (dataList || []).map((key) => {
        return _.mapKeys(key, (v, keyName) => { return keyName in data ? data[keyName] : keyName; })
    })
    if (isPeople) {
        //changing label = 'fname lname'
        newDataList = (newDataList).map((key) => {
            return _.mapValues(key, (v, keyName) => { return keyName === 'label' ? key.label + ' ' + key.lname : v }) //fname changed to label 
        })
    }
    return newDataList
}


/* US FORMAT MOBILE */
export const formatMobile = (num = '') => {
    var numbers = (num || '').replace(/[^\d]/g, "")
    numbers = numbers.substring(0, 10)
    var phone = numbers ? ("(" + numbers.substring(0, 3) + ") " + numbers.substring(3, 6) + "-" + numbers.substring(6, 10)) : numbers;
    if (numbers.length === 10)
        return phone;
    else
        return numbers.substring(0, 10)
}

export const getMobile = (number = '') => {
    var num = number || ''
    num = num.replace(/[^\d]/g, "")
    var phone = num ? ("+1 (" + num.substring(0, 3) + ") " + num.substring(3, 6) + "-" + num.substring(6, 10)) : num;
    return phone;
}

export const isValidMobile = (num = '') => {
    var phone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/;
    var digits = num.replace(/\D/g, "");
    digits = digits.substring(0, 10)
    return phone.test(digits);
}

export function getCompliantColor(data) {
    if (!data.compliant)
        if (['info', 'warning'].includes(data?.compliance_status?.level)) return 'warning'
        else return 'danger'
    else return 'success'
}

export function getCompliantText(data) {
    if (!data.compliant)
        if (['info', 'warning'].includes(data?.compliance_status?.level)) return 'Pending'
        else return 'No'
    else return 'Yes'
}

export function getAccessoryComplianceStatus(expDate) {

    let data = JSON.parse(localStorage.getItem('token'));
    let expiring = (data?.user?.account) ? data.user.account?.setting?.expiringSoon : data.account?.setting?.expiringSoon
    let exp = moment(expDate).diff(moment(), 'days')

    var status = exp >= (expiring || config.ACCESSORIES_WARNING_DAYS) ? "Ok" : exp < 0 ? "Expired" : "Expiring";
    return <span className={status}> {status} </span>;
}

export const getReportImage = (type) => {
    if (type === 'equipment') return reportAed;
    if (type === 'location') return reportLocation;
    if (type === 'user') return reportPeople;
    if (type === 'accessory') return accessoryReport;
    if (type === 'inspection') return inspectionReport;
    if (type === 'document') return documentReport;
    if (type === 'activity') return activityReport;
    if (type === 'medication') return medicationReport;
    if (type === 'credential') return credentialReport;
    if (type === 'course') return courseReport;
}