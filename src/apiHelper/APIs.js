
//#region imports
import { TOM_TOM_APIKEY } from "../utils/constants";
//#endregion

export const BASE_URL = `http://vove.xyz:5000`;
export const LOGIN_REGISTER = `${BASE_URL}/auth/login_register`;
export const UPDATE_INFO = `${BASE_URL}/user/updated_info`;
export const UPDATE_ADDRESS = `${BASE_URL}/user/updated_address`;
export const UPDATE_PROFILE = `${BASE_URL}/user/photoTask`;
export const UPDATE_SETTINGS = `${BASE_URL}/user/update_user_setting`;
export const UPDATE_PHONE = `${BASE_URL}/user/update_phone`;
export const DELETE_USER = `${BASE_URL}/user/deleteUser`;
export const MEMBER = `${BASE_URL}/user/getUserList`;
export const GET_STAYS_LOCATION = `${BASE_URL}/user/get_user_locations`;
export const ADD_STAYS_LOCATION = `${BASE_URL}/user/add_user_location`;
export const DELETE_STAYS_LOCATION = `${BASE_URL}/user/delete_user_location`;
export const UPDATE_STAYS_LOCATION = `${BASE_URL}/user/update_user_location`;
export const SET_STAYS_LOCATION = `${BASE_URL}/user/set_stay_location`;
export const GET_REPORT_KEYS = `${BASE_URL}/user/get_report_keys`;
export const REPORT_USER = `${BASE_URL}/user/report_user`;
export const REJECT_USER = `${BASE_URL}/user/cancel_user`;
export const CONNECT_USER = `${BASE_URL}/user/connect_to`;
export const USER_SETTINGS = `${BASE_URL}/user/get_user_setting`;
export const IS_ONLINE = `${BASE_URL}/user/update_online_time`;
export const COUNTRY_FLAGS = (countryCode) => `http://44.193.16.153:5000/flag/${countryCode}.png`;
//#region third party APIs
export const GEO_CODING = (lat, lng) => `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.JSON?key=${TOM_TOM_APIKEY}&language=en`;
export const AUTO_LOCATION = (text) => `https://api.tomtom.com/search/2/search/${encodeURIComponent(text)}.JSON?key=${TOM_TOM_APIKEY}`;
export const CHECK_MOBI_REQUEST = "https://api.checkmobi.com/v1/validation/request";
export const CHECK_MOBI_VERIFY = "https://api.checkmobi.com/v1/validation/verify";
//#endregion third party APIs
//#region Socket
export const SOCKET_BASE_URL = `http://44.193.16.153:5000/`;
export const CONVERSION = `${BASE_URL}/user/get_chat_conversion_list`;
export const DISCONNECT_USER = `${BASE_URL}/user/disconnect_user`;
//#endregion Socket