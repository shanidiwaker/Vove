//#region import
//#region RN
import { Alert, Linking } from "react-native";
//#endregion
//#region common files
import { Strings } from "../../res/string";
import { GET, POST } from "../../apiHelper/apiService";
import * as types from "../actionTypes/appActionTypes";
import { DEVICE_OS, APP_NAME } from "../../utils/constants";
import { saveData, getData } from "../../utils/asyncStorageHelper";
import { REPORT_USER } from "../../apiHelper/APIs";
//#endregion
//#region third party libs
import * as RNLocalize from "react-native-localize";
import { getCallingCode } from 'react-native-country-picker-modal';
import SystemSetting from "react-native-system-setting";
import Geolocation from "@react-native-community/geolocation";
var countries = require('country-data').countries;
import Toast from 'react-native-simple-toast';
import firebase from "react-native-firebase";
import SplashScreen from 'react-native-splash-screen';
import Util from "../../utils/utils";
//#endregion
//#endregion

export const onOptionModalClicked = (flag, type) => {
    return dispatch => {
        dispatch({ type: type === 'option' ? types.APP_OPTION_MENU : type === 'reported' ? types.APP_REPORTED_MODAL : types.APP_REPORT_MODAL, flag });
    }
}
export const onOptionsClicked = (data, index) => {
    return dispatch => {
        dispatch({ type: types.APP_OPTION_MENU, flag: false });
        data.isReport === undefined &&
            setTimeout(() => {
                dispatch({ type: types.APP_REPORT_MODAL, flag: true });
            }, 500);
    }
}
export const onReportOptionsClicked = (data, index, authReducers, homeReducers, selectedChatItem) => {
    return async dispatch => {
        dispatch({ type: types.APP_REPORT_MODAL, flag: false });
        let requestBody = {
            "report_to": selectedChatItem === undefined ? authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].id : selectedChatItem.id,
            "report_key_id": data.id
        };
        await POST(REPORT_USER, JSON.stringify(requestBody), function (response) {
            if (response.status) {
                dispatch({ type: types.APP_REPORTED_MODAL, flag: true });
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, authReducers.userDetails.access_token);
    }
}
export const onUpgradeModalClicked = (flag) => {
    return dispatch => {
        dispatch({ type: types.APP_UPGRADE_MODAL, flag });
    }
}
export const onStaysUpgradeModalClicked = (flag) => {
    return dispatch => {
        dispatch({ type: types.APP_STAYS_UPGRADE_MODAL, flag });
    }
}
export const onChacractersModal = (flag) => {
    return dispatch => {
        dispatch({ type: types.APP_CHARACTERS_MODAL, flag });
    }
}