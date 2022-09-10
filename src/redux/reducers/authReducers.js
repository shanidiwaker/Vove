import {
    APP_LOADER,
    USER_DETAILS,
    COUNTRY_CODE,
    FORMATTED_MOBILE_NUMBER,
    AUTH_REQUEST,
    LOCATION,
    AUTO_LOCATION_LIST,
    MEMBER_LIST,
    USER_SETTINGS
} from "../actionTypes/authActionTypes";

const initialData = {
    appLoading: false,
    userDetails: {},
    authRequest: {},
    countryCode: '',
    formattedMobileNumber: '',
    selectedLocation: '',
    autoLocationList: [],
    memberList: [],
    userSettings: ''
};

const authReducers = (state = initialData, action) => {
    switch (action.type) {
        case APP_LOADER:
            return {
                ...state,
                appLoading: action.flag
            }
        case USER_DETAILS:
            return {
                ...state,
                userDetails: action.userDetails
            }
        case AUTH_REQUEST:
            return {
                ...state,
                authRequest: action.authRequest
            }
        case COUNTRY_CODE:
            return {
                ...state,
                countryCode: action.countryCode
            }
        case FORMATTED_MOBILE_NUMBER:
            return {
                ...state,
                formattedMobileNumber: action.formattedMobileNumber
            }
        case LOCATION:
            return {
                ...state,
                selectedLocation: action.selectedLocation
            }
        case AUTO_LOCATION_LIST:
            return {
                ...state,
                autoLocationList: action.autoLocationList
            }
        case MEMBER_LIST:
            return {
                ...state,
                memberList: action.memberList
            }
        case USER_SETTINGS:
            return {
                ...state,
                userSettings: action.userSettings
            }
        default:
            return state;
    }
};
export default authReducers;