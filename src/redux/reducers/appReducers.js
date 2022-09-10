import {
    APP_OPTION_MENU,
    APP_REPORT_MODAL,
    APP_REPORTED_MODAL,
    APP_UPGRADE_MODAL,
    APP_STAYS_UPGRADE_MODAL,
    APP_REPORT_KEYS,
    APP_CHARACTERS_MODAL
} from "../actionTypes/appActionTypes";

const initialData = {
    appOptionMenu: false,
    isReportModal: false,
    reportOptions: [],
    isReportedModal: false,
    isUpgradeModal: false,
    isStaysUpgradeModal: false,
    isChacractersLimitModal: false
};

const appReducers = (state = initialData, action) => {
    switch (action.type) {
        case APP_OPTION_MENU:
            return {
                ...state,
                appOptionMenu: action.flag
            }
        case APP_REPORT_MODAL:
            return {
                ...state,
                isReportModal: action.flag
            }
        case APP_REPORTED_MODAL:
            return {
                ...state,
                isReportedModal: action.flag
            }
        case APP_UPGRADE_MODAL:
            return {
                ...state,
                isUpgradeModal: action.flag
            }
        case APP_STAYS_UPGRADE_MODAL:
            return {
                ...state,
                isStaysUpgradeModal: action.flag
            }
        case APP_REPORT_KEYS:
            return {
                ...state,
                reportOptions: action.reportOptions
            }
        case APP_CHARACTERS_MODAL:
            return {
                ...state,
                isChacractersLimitModal: action.flag
            }
        default:
            return state;
    }
};
export default appReducers;