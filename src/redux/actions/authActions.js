//#region import
//#region RN
import { Alert, Linking } from "react-native";
//#endregion
//#region common files
import { Strings } from "../../res/string";
import { GET, POST, DELETE } from "../../apiHelper/apiService";
import * as types from "../actionTypes/authActionTypes";
import * as homeTypes from "../actionTypes/homeActionTypes";
import * as appTypes from "../actionTypes/appActionTypes";
import { DEVICE_OS, APP_NAME } from "../../utils/constants";
import { saveData, getData } from "../../utils/asyncStorageHelper";
import {
    GEO_CODING, AUTO_LOCATION, LOGIN_REGISTER, UPDATE_INFO, UPDATE_ADDRESS, UPDATE_PROFILE, UPDATE_PHONE, UPDATE_SETTINGS,
    GET_STAYS_LOCATION, MEMBER, GET_REPORT_KEYS, USER_SETTINGS, IS_ONLINE, DELETE_USER
} from "../../apiHelper/APIs";
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

global.isMemberChange = true;
export const onGetUserDetails = () => {
    return dispatch => {
        getData('userDetails', (userDetails) => {
            if (userDetails.birth_date !== null) {
                let formatedDate = userDetails.birth_date;
                let age = Util.onAgeCalculation(formatedDate);
                userDetails.age = age;
            }
            console.log({ userDetails });
            dispatch({ type: types.USER_DETAILS, userDetails: userDetails });
            getUserStays(dispatch, userDetails);
            isUserOnline(dispatch, userDetails);
            getUserSettings(dispatch, userDetails);
            getReports(dispatch, userDetails);
        }, (failure) => {
            console.log(failure);
        });
    }
}
const getReports = async (dispatch, userDetails) => {
    await GET(GET_REPORT_KEYS, undefined, function (response) {
        if (response.status) {
            dispatch({ type: appTypes.APP_REPORT_KEYS, reportOptions: response.responseData.data });
        }
    }, userDetails.access_token);
}
const getUserStays = async (dispatch, userDetails) => {
    await GET(GET_STAYS_LOCATION, undefined, function (response) {
        SplashScreen.hide();
        if (response.status) {
            dispatch({ type: homeTypes.UPDATE_USER_STAYS, userStays: response.responseData.data });
        } else {
            // setTimeout(() => {
            //     // Toast.show(response.response.msg);
            // }, 500);
        }
    }, userDetails.access_token);
}
const isUserOnline = async (dispatch, userDetails) => {
    let requestBody = {
        "timezone": RNLocalize.getTimeZone()
    };
    await POST(IS_ONLINE, JSON.stringify(requestBody), function (response) {
    }, userDetails.access_token);
}
const getUserSettings = async (dispatch, userDetails) => {
    await POST(USER_SETTINGS, undefined, function (response) {
        console.log('userSettings response : ', response);
        if (response.status) {
            dispatch({ type: types.USER_SETTINGS, userSettings: response.response.data });
            global.isMemberChange && getMembers(dispatch, userDetails, response.response.data);
        }
    }, userDetails.access_token);
}
const getMembers = async (dispatch, userDetails, userSettings, callBack) => {
    let requestBody = {
        "page": 1,
        "distance": userSettings.search_distance,
        "ageFrom": userSettings.ageFrom,
        "ageTo": userSettings.ageTo,
        "gender": userSettings.fine_me === 'Everyone' ? 0 : userSettings.fine_me === 'Men' ? 1 : 2
    };
    await POST(MEMBER, JSON.stringify(requestBody), function (response) {
        // console.log("response.response member llist: ", response);
        if (response.response.status === undefined) {
            dispatch({ type: types.MEMBER_LIST, memberList: [] });
            callBack();
        } else if (response.status) {
            dispatch({ type: types.MEMBER_LIST, memberList: response.response.data });
            callBack !== undefined && callBack();
        }
        else if (!response.response.status) {
            dispatch({ type: types.MEMBER_LIST, memberList: [] });
            callBack();
        } else {
            callBack();
            // setTimeout(() => {
            //     // Toast.show(response.response.msg);
            // }, 500);
        }
    }, userDetails.access_token);
}

export const getMember = (userDetails, userSettings, callBack) => {
    return dispatch => {
        getMembers(dispatch, userDetails, userSettings, callBack);
    }
}
export const getUserStayss = (userDetails) => {
    return dispatch => {
        getUserStays(dispatch, userDetails);
    }
}
export const getCurrentCountryCode = (props) => {
    return dispatch => {
        dispatch({ type: types.COUNTRY_CODE, countryCode: RNLocalize.getCountry() });
        getData('authRequest', (authRequest) => {
            if (authRequest !== null) {
                loginRegister(dispatch, authRequest, props);
            } else {
                SplashScreen.hide();
            }
        }, (failure) => {
            SplashScreen.hide();
        });
    }
}
export const onVerifyMobileNumber = (props, countryCode, mobileNumber) => {
    return async dispatch => {
        let callingCode = (countryCode === 'PR' || countryCode === 'DO') ? '1' : await getCallingCode(countryCode);
        let number = "+" + callingCode + mobileNumber;
        dispatch({ type: types.APP_LOADER, flag: true });
        // firebase.auth().verifyPhoneNumber(number, true, false).then(confirmResult => {        
        firebase.auth().signInWithPhoneNumber(number).then(confirmResult => {
            confirmResult.mobileNumber = "+" + callingCode + mobileNumber;
            confirmResult.mobileNumberFormatting = "+" + callingCode + " " + mobileNumber;
            let authRequest = {
                "phone": mobileNumber,
                "country": countries[countryCode].name,
                "country_code": countryCode,
                "device_type": DEVICE_OS,
                "fcm_token": 123456456456,
                "id": confirmResult.verificationId
            }
            dispatch({ type: types.AUTH_REQUEST, authRequest });
            dispatch({ type: types.FORMATTED_MOBILE_NUMBER, formattedMobileNumber: confirmResult });
            dispatch({ type: types.APP_LOADER, flag: false });
            props.navigation.navigate('OTP');
        }).catch(error => {
            console.log({ error });
            dispatch({ type: types.APP_LOADER, flag: false });
        });
        //#region CHECK_MOBI_REQUEST
        // let requestBody = JSON.stringify({
        //     "number": number,
        //     "type": "sms",
        //     "platform": DEVICE_OS
        // });
        // await POST(CHECK_MOBI_REQUEST, requestBody, function (response) {
        //     dispatch({ type: types.APP_LOADER, flag: false });
        //     if (response.status) {
        //         let authRequest = {
        //             "phone": mobileNumber,
        //             "country": countries[countryCode].name,
        //             "country_code": countryCode,
        //             "device_type": DEVICE_OS,
        //             "fcm_token": 123456456456,
        //             "id": response.response.id
        //         }
        //         dispatch({ type: types.AUTH_REQUEST, authRequest });
        //         dispatch({ type: types.FORMATTED_MOBILE_NUMBER, formattedMobileNumber: response });
        //         props.navigation.navigate('OTP');
        //     } else {
        //         setTimeout(() => {
        //             Toast.show(response.response.error);
        //         }, 500);
        //     }
        // }, undefined, true);
        //#endregion CHECK_MOBI_REQUEST
    }
}
export const onResendOTP = (formattedMobileNumber, authRequest, callBack) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });
        // firebase.auth().verifyPhoneNumber(formattedMobileNumber.mobileNumber, true, false).then(confirmResult => {
        firebase.auth().signInWithPhoneNumber(formattedMobileNumber.mobileNumber).then(confirmResult => {
            authRequest.id = confirmResult.verificationId;
            dispatch({ type: types.AUTH_REQUEST, authRequest });
            dispatch({ type: types.APP_LOADER, flag: false });
            callBack();
        }).catch(error => {
            dispatch({ type: types.APP_LOADER, flag: false });
        });
        //#region CHECK_MOBI_REQUEST
        // let requestBody = JSON.stringify({
        //     "number": formattedMobileNumber.response.validation_info.e164_format,
        //     "type": "sms",
        //     "platform": DEVICE_OS
        // });

        // await POST(CHECK_MOBI_REQUEST, requestBody, function (response) {
        //     dispatch({ type: types.APP_LOADER, flag: false });
        //     if (response.status) {
        //         authRequest.id = response.response.id;
        //         dispatch({ type: types.AUTH_REQUEST, authRequest });
        //         callBack();
        //     } else {
        //         Toast.show(response.response.error);
        //     }
        // }, undefined, true);
        //#endregion CHECK_MOBI_REQUEST
    }
}
export const onVerifyOTP = (props, OTPCode, authRequest, callBack) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });
        var credential = firebase.auth.PhoneAuthProvider.credential(authRequest.id, OTPCode);
        firebase.auth().signInWithCredential(credential).then(async response => {
            callBack(true);
            loginRegister(dispatch, authRequest, props);
        }).catch(error => {
            dispatch({ type: types.APP_LOADER, flag: false });
            callBack(false);
        })
        //#region CHECK_MOBI_REQUEST
        // let requestBody = JSON.stringify({
        //     "id": authRequest.id,
        //     "pin": OTPCode,
        // });
        // await POST(CHECK_MOBI_VERIFY, requestBody, async function (response) {
        //     if (response.status) {
        //         if (response.response.validated) {
        //             callBack(true);
        //             var formdata = new FormData();
        //             formdata.append("phone", authRequest.phone);
        //             formdata.append("device_type", authRequest.device_type);
        //             formdata.append("country", authRequest.country);
        //             formdata.append("country_code", authRequest.country_code);
        //             formdata.append("fcm_token", authRequest.fcm_token);

        //             await POST(LOGIN_REGISTER, formdata, function (response) {
        //                 dispatch({ type: types.APP_LOADER, flag: false });
        //                 if (response.status) {
        //                     response.response.data.access_token = response.response.access_token;
        //                     response.response.data.already_login = response.response.already_login;
        //                     dispatch({ type: types.USER_DETAILS, userDetails: response.response.data })
        //                     if (response.response.already_login) {
        //                         response.response.data.fullname === null ? props.navigation.navigate('addDetails') :
        //                             response.response.data.fly_country_code === null ? props.navigation.navigate('addPhotos') :
        //                                 response.response.data.fine_me === null ? props.navigation.navigate('searchPreference') :
        //                                     response.response.data.latitude === null ? props.navigation.navigate('userLocation') :
        //                                         (saveData('userDetails', response.response.data, (success) => {
        //                                             console.log("success : ", success);
        //                                         }, (failure) => {
        //                                             console.log("failure : ", failure);
        //                                         }), props.navigation.navigate('tabNavigator'));
        //                     } else {
        //                         props.navigation.navigate('addDetails');
        //                     }
        //                 } else {
        //                     setTimeout(() => {
        //                         Toast.show(response.response.msg);
        //                     }, 500);
        //                 }
        //             });
        //         } else {
        //             dispatch({ type: types.APP_LOADER, flag: false });
        //             callBack(false);
        //         }
        //     } else {
        //         dispatch({ type: types.APP_LOADER, flag: false });
        //         callBack(false);
        //     }
        // }, undefined, true);
        //#endregion CHECK_MOBI_REQUEST
    }
}
const loginRegister = async (dispatch, authRequest, props) => {
    var formdata = new FormData();
    formdata.append("phone", authRequest.phone);
    formdata.append("device_type", authRequest.device_type);
    formdata.append("country", authRequest.country);
    formdata.append("country_code", authRequest.country_code);
    formdata.append("fcm_token", authRequest.fcm_token);
    await POST(LOGIN_REGISTER, formdata, function (response) {
        dispatch({ type: types.APP_LOADER, flag: false });
        SplashScreen.hide();
        if (response.status) {
            response.response.data.access_token = response.response.access_token;
            response.response.data.already_login = response.response.already_login;
            dispatch({ type: types.USER_DETAILS, userDetails: response.response.data });
            saveData('authRequest', authRequest);
            if (response.response.already_login) {
                response.response.data.fullname === null ? props.navigation.navigate('addDetails') :
                    response.response.data.fly_country_code === null ? props.navigation.navigate('addPhotos') :
                        response.response.data.fine_me === null ? props.navigation.navigate('searchPreference') :
                            response.response.data.latitude === null ? props.navigation.navigate('userLocation') :
                                (saveData('userDetails', response.response.data, (success) => {
                                    console.log("success : ", success);
                                }, (failure) => {
                                    console.log("failure : ", failure);
                                }), props.navigation.navigate('tabNavigator'));
            } else {
                props.navigation.navigate('addDetails');
            }
        } else {
            setTimeout(() => {
                Toast.show(response.response.msg ? response.response.msg : 'Something went wrong!');
            }, 500);
        }
    });
}
export const onNextToPhotos = (aboutMe, props, userDetails) => {
    return async dispatch => {
        dispatch({ type: types.AUTH_REQUEST, authRequest: aboutMe });
        props.navigation.navigate('addPhotos');
        aboutMe.fly_country_name = '';
        aboutMe.fly_country_code = '';
        aboutMe.photos = [];
        await POST(UPDATE_INFO, JSON.stringify(aboutMe), function (response) {
            console.log("response : ", response);
        }, userDetails.access_token);
    }
}
export const onNextToPreference = (authRequest, photosDetails, props, userDetails) => {
    return async dispatch => {
        let photosArray = [];
        photosDetails.photosArray.forEach((element, index) => {
            // element.base64 !== '' && photosArray.push("data:image/png;base64," + element.base64);
            element.base64 !== '' && photosArray.push("data:image/png;base64," + element.base64);
            // element.base64 !== '' && photosArray.push(element.base64);
        });
        authRequest.fly_country_name = photosDetails.countryName;
        authRequest.fly_country_code = photosDetails.cca2;
        authRequest.photos = photosArray;
        if (authRequest.fullname === undefined) {
            authRequest.fullname = userDetails?.fullname;
            authRequest.gender = userDetails.gender;
            authRequest.birth_date = userDetails.birth_date;
        }
        dispatch({ type: types.AUTH_REQUEST, authRequest });
        props.navigation.navigate('searchPreference');
        await POST(UPDATE_INFO, JSON.stringify(authRequest), function (response) {
            console.log("response : ", response);
        }, userDetails.access_token);
    }
}
export const onNextToLocation = (userDetails, authRequest, preference, props) => {
    return async dispatch => {
        authRequest.fine_me = preference;
        if (authRequest.fullname === undefined) {
            authRequest.fullname = userDetails?.fullname;
            authRequest.gender = userDetails.gender;
            authRequest.birth_date = userDetails.birth_date;
            authRequest.fly_country_name = userDetails.fly_country_name;
            authRequest.fly_country_code = userDetails?.fly_country_code;
            // authRequest.photos = [];
        };
        authRequest.photos = [];
        dispatch({ type: types.APP_LOADER, flag: true });
        await POST(UPDATE_INFO, JSON.stringify(authRequest), function (response) {
            dispatch({ type: types.APP_LOADER, flag: false });
            if (response.status) {
                props.navigation.navigate('userLocation');
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, userDetails.access_token);
    }
}
export const onNextToHome = (userDetails, selectedLocation, selectedLocationAddress, props) => {
    return async dispatch => {
        let requestBody;
        if (selectedLocationAddress === undefined) {
            requestBody = {
                "address": selectedLocation.address.freeformAddress,
                "latitude": selectedLocation.position.lat,
                "longitude": selectedLocation.position.lon,
                "city": !selectedLocation.address.municipality ?
                    (!selectedLocation.address.countrySubdivision ? selectedLocation.address.freeformAddress : selectedLocation.address.countrySubdivision) :
                    (!selectedLocation.address.municipalitySubdivision ? selectedLocation.address.municipality : selectedLocation.address.municipalitySubdivision)
            }
        } else requestBody = {
            "address": selectedLocationAddress.freeformAddress,
            "latitude": selectedLocation.position.coords.latitude,
            "longitude": selectedLocation.position.coords.longitude,
            "city": !selectedLocationAddress.municipality ?
                (!selectedLocationAddress.countrySubdivision ? selectedLocationAddress.freeformAddress : selectedLocationAddress.countrySubdivision) :
                (!selectedLocationAddress.municipalitySubdivision ? selectedLocationAddress.municipality : selectedLocationAddress.municipalitySubdivision)
        }
        dispatch({ type: types.APP_LOADER, flag: true });
        await POST(UPDATE_ADDRESS, JSON.stringify(requestBody), function (response) {
            dispatch({ type: types.APP_LOADER, flag: false });
            if (response.status) {
                response.response.data.access_token = userDetails.access_token;
                dispatch({ type: types.USER_DETAILS, userDetails: response.response.data });
                saveData('userDetails', response.response.data, (success) => {
                    console.log("success : ", success);
                }, (failure) => {
                    console.log("failure : ", failure);
                });
                props.navigation.navigate('tabNavigator');
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, userDetails.access_token);
    }
}
export const onReOrderImages = (data) => {
    return async dispatch => {
        dispatch({ type: types.ON_REORDER_IMAGE, data });
    }
}
export const onGetLocation = (userDetails) => {
    return dispatch => {
        checkLocationService(dispatch, userDetails);
    };
};
export const onClearSelectedLocation = () => {
    return dispatch => {
        dispatch({ type: types.LOCATION, selectedLocation: '' });
    };
};
const checkLocationService = async (dispatch, userDetails) => {
    await SystemSetting.isLocationEnabled().then((enable) => {
        if (!enable) {
            Alert.alert(APP_NAME, Strings.ENABLE_LOCATION_SERVICE, [
                {
                    text: "OK",
                    onPress: async () => {
                        DEVICE_OS === "android"
                            ? await SystemSetting.switchLocation(() => {
                                getGeoLocation(dispatch, userDetails);
                            })
                            : Linking.openURL("App-Prefs:Privacy&path=LOCATION");
                    },
                },
            ]);
        } else {
            getGeoLocation(dispatch, userDetails);
        }
    });
};
const getGeoLocation = async (dispatch, userDetails) => {
    dispatch({ type: types.APP_LOADER, flag: true });
    await Geolocation.getCurrentPosition(async (position) => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        await GET(GEO_CODING(lat, lng), 'Tomtom', function (response) {
            dispatch({ type: types.LOCATION, selectedLocation: { position, response } });
            dispatch({ type: types.APP_LOADER, flag: false });
        });
    },
        (error) => {
            dispatch({ type: types.APP_LOADER, flag: false });
            checkLocationService(dispatch, userDetails);
        },
        {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000,
        }
    );
};
export const onAutoLocationList = (input) => {
    return async dispatch => {
        input === undefined ? dispatch({ type: types.AUTO_LOCATION_LIST, autoLocationList: [] }) :
            await GET(AUTO_LOCATION(input), 'Tomtom', function (response) {
                if (response.results !== undefined) {
                    dispatch({ type: types.AUTO_LOCATION_LIST, autoLocationList: response.httpStatusCode === 400 ? [] : response.results });
                }
            });
    };
};
export const onUpdateProfile = (props, userDetails, updatedDeatils) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });
        let photos = [];
        updatedDeatils.photosArray.forEach((element, index) => {
            if (element.pickedImage !== '') {
                if (element.base64 !== '') {
                    photos.push({ "isBase64": 1, "data": "data:image/png;base64," + element.base64 });
                } else
                    photos.push({ "isBase64": 0, "data": element.imageLink });
            }
        });
        let requestBody = {
            fly_country_name: updatedDeatils.countryName,
            fly_country_code: updatedDeatils.cca2,
            bio_content: updatedDeatils.bio === null ? '' : updatedDeatils.bio,
            delete_urls: updatedDeatils.deletePhotos,
            photos
        };
        await POST(UPDATE_PROFILE, JSON.stringify(requestBody), function (response) {
            dispatch({ type: types.APP_LOADER, flag: false });
            if (response.status) {
                response.response.data.access_token = userDetails.access_token;
                if (userDetails.birth_date !== null) {
                    let formatedDate = userDetails.birth_date;
                    let age = Util.onAgeCalculation(formatedDate);
                    response.response.data.age = age;
                }
                dispatch({ type: types.USER_DETAILS, userDetails: response.response.data });
                saveData('userDetails', response.response.data, () => { }, () => { });
                props.navigation.goBack();
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg ? response.response.msg : 'Something went wrong!');
                }, 500);
            }
        }, userDetails.access_token);
    };
};


export const onUpdatePhoneNumber = (props, userDetails, new_phone) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });

        let requestBody = { new_phone };
        await POST(UPDATE_PHONE, JSON.stringify(requestBody), function (response) {
            dispatch({ type: types.APP_LOADER, flag: false });
            if (response.status) {
                getData('userDetails', (userDetails) => {
                    userDetails.phone = new_phone;
                    console.log("updated_phone_number", userDetails.phone);
                    dispatch({ type: types.USER_DETAILS, userDetails: userDetails });
                    saveData('userDetails', userDetails, () => { }, () => { });
                    props.navigation.goBack();
                });
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg ? response.response.msg : 'Something went wrong!');
                }, 500);
            }
        }, userDetails.access_token);
    };
};
// export const onUpdateUserSetting = (props, userSettings, userDetails) => {
//     return async dispatch => {
//         dispatch({ type: types.APP_LOADER, flag: true });
//         const formData = new FormData();
//         formData.append('ageFrom', userSettings.ageFrom);
//         formData.append('ageTo', userSettings.ageTo);
//         formData.append('fine_me', userSettings.fine_me);
//         formData.append('message_notification', userSettings.message_notification);
//         formData.append('new_contact_notification', userSettings.new_contact_notification);
//         formData.append('paused', userSettings.paused);
//         formData.append('search_distance', userSettings.search_distance);
//         formData.append('unit', userSettings.unit);
//         await POST(UPDATE_SETTINGS, formData, function (response) {
//             dispatch({ type: types.APP_LOADER, flag: false });
//             console.log("im called", response);
//             if (response.status) {
//                 getData('userDetails', (userSettingsTemp) => {
//                     console.log("im called also", userDetails.ageFrom);
//                     userSettingsTemp.ageFrom = userSettings.ageFrom;
//                     userSettingsTemp.ageTo = userSettings.ageTo;
//                     userSettingsTemp.fine_me = userSettings.fine_me;
//                     userSettingsTemp.message_notification = userSettings.message_notification;
//                     userSettingsTemp.new_contact_notification = userSettings.new_contact_notification;
//                     userSettingsTemp.paused = userSettings.paused;
//                     userSettingsTemp.search_distance = userSettings.search_distance;
//                     userSettingsTemp.unit = userSettings.unit;
//                     console.log("Shani-setting-updated", userSettingsTemp);
//                     dispatch({ type: types.USER_DETAILS, userDetails: userSettingsTemp });
//                     saveData('userDetails', userSettingsTemp, () => { }, () => { });
//                     props.navigation.goBack();
//                 });

//             } else {
//                 setTimeout(() => {
//                     Toast.show(response.response.msg ? response.response.msg : 'Something went wrong!');
//                 }, 500);
//             }
//         }, userDetails.access_token);
//     };
// };

export const onUpdateUserSetting = (props, userDetails, search_distance, ageFrom, ageTo,
    paused, fine_me, message_notification, new_contact_notification, unit) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });

        let requestBody = {
            search_distance, ageFrom, ageTo, paused, fine_me, message_notification,
            new_contact_notification, unit
        };


        await POST(UPDATE_SETTINGS, JSON.stringify(requestBody), function (response) {
            dispatch({ type: types.APP_LOADER, flag: false });
            // console.log("im called", response);
            if (response.status) {
                getData('userDetails', (userSettingsTemp) => {
                    console.log("im called also", userSettingsTemp.unit);
                    userSettingsTemp.search_distance = search_distance;
                    userSettingsTemp.ageFrom = ageFrom;
                    userSettingsTemp.ageTo = ageTo;
                    userSettingsTemp.paused = paused;
                    userSettingsTemp.fine_me = fine_me;
                    userSettingsTemp.message_notification = message_notification;
                    userSettingsTemp.new_contact_notification = new_contact_notification;
                    userSettingsTemp.unit = unit;
                    console.log("Shani-setting-updated", userSettingsTemp);
                    dispatch({ type: types.USER_DETAILS, userDetails: userSettingsTemp });
                    saveData('userDetails', userSettingsTemp, () => { }, () => { });
                    props.navigation.goBack();
                });

            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg ? response.response.msg : 'Something went wrong!');
                }, 500);
            }
        }, userDetails.access_token);
    };
};
export const onDeleteUser = (props) => {
    return async dispatch => {

        await DELETE(DELETE_USER, undefined, function (response) {
            if (response.status) {
                clearAllData((success) => {
                    props.navigation.replace('loginStart');
                });
                setIsModalVisible(!isModalVisible);
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, authReducers.userDetails.access_token);
    }
};

export const clearAsyncUserDetails = () => {
    return async dispatch => {
        console.log("object call logout")
        dispatch({ type: types.USER_DETAILS, userDetails: null });
    }
}