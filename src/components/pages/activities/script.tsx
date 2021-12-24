import {APPROVED, DECLINED, FOREVALUATION} from "../../../reducers/activity/initialstate";
import EvaluationStatus from "@assets/svg/evaluationstatus";
import {styles} from "@pages/activities/styles";
import CheckMarkIcon from "@assets/svg/checkmark";
import DeclineStatusIcon from "@assets/svg/declineStatus";
import React from "react";

export  const formatDate = (date: string) => {

    date = !date.split("T") ? checkFormatIso(date) :  date
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}
export const checkFormatIso = (date: string, separator?: string) => {


    let isoStringSplit = date.split("T")[0].split("-")
    let checkIfCorrectMonth = isoStringSplit[2],
        checkIfCorrectDay = isoStringSplit[1]

    if (checkIfCorrectMonth.length == 3) {
        isoStringSplit[2] = checkIfCorrectMonth.substr(checkIfCorrectMonth.length - 2)
    }
    if (checkIfCorrectDay.length == 3) {
        isoStringSplit[1] = checkIfCorrectMonth.substr(checkIfCorrectDay.length - 2)
    }
    let newDate = ""
    for (let i = 0; i < isoStringSplit.length; i++) {
        newDate += isoStringSplit[i] + (i != isoStringSplit.length - 1 ? (separator ? separator : "/") : "")
    }
    return newDate
}

export const statusColor = (status: string) => {
    if (status == FOREVALUATION) {
        return {color: "#f66500"}
    } else if (status == APPROVED) {
        return {color: "#34c759"}
    } else if (status == DECLINED) {
        return {color: "#cf0327"}
    }
}

export const statusIcon = (status: string) => {

    if (status == FOREVALUATION) {

        return <EvaluationStatus style={[styles.icon3, {color: "#f66500",}]}/>
    } else if (status == APPROVED) {
        return <CheckMarkIcon style={[styles.icon3, {left: 20}]}/>
    } else if (status == DECLINED) {
        return <DeclineStatusIcon style={[styles.icon3, {left: 20}]}/>
    }
}
export const statusBackgroundColor = (status: string) => {

    if (status == FOREVALUATION) {
        return {backgroundColor: "#fef5e8",}
    } else if (status == APPROVED) {
        return {backgroundColor: "rgba(229,247,241,1)",}
    } else if (status == DECLINED) {
        return {backgroundColor: "#fae6e9",}
    }
}

export const statusDimension = (status: any) => {
    if (status == FOREVALUATION) {
        return {width: 103}
    } else if (status == APPROVED) {
        return {width: 80}
    } else if (status == DECLINED) {
        return {width: 70}
    }
}