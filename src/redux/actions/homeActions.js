//#region import
//#region RN
//#endregion
//#region common files
import { GET, POST } from "../../apiHelper/apiService";
import * as types from "../actionTypes/homeActionTypes";
import * as authActionTypes from "../actionTypes/authActionTypes";
import * as authAction from '../actions/authActions';
import { ADD_STAYS_LOCATION, DELETE_STAYS_LOCATION, UPDATE_STAYS_LOCATION, SET_STAYS_LOCATION, REJECT_USER, CONNECT_USER } from "../../apiHelper/APIs";
//#endregion
//#region third party libs
import Toast from 'react-native-simple-toast';
//#endregion
//#endregion

export const onDeleteStays = (userStays, selectedStays, authReducers, callBack) => {
    return async dispatch => {
        let requestBody = {
            "location_id": selectedStays.data.id
        }
        await POST(DELETE_STAYS_LOCATION, JSON.stringify(requestBody), function (response) {
            if (response.status) {
                userStays.splice(selectedStays.index, 1);
                dispatch({ type: types.UPDATE_USER_STAYS, userStays });
                dispatch({ type: types.SELECTED_STAYS, selectedStays: '' });
                callBack(userStays);
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, authReducers.userDetails.access_token);
    }
}
export const onAddStays = (isAddStays, navigation, id) => {
    return dispatch => {
        dispatch({ type: types.ADD_STAYS, isAddStays });
        id !== 0 && navigation.navigate('userLocation');
    }
}
export const onAddedStays = (userDetails, selectedLocation, selectedLocationAddress, props, homeReducers) => {
    return async dispatch => {
        if (homeReducers.selectedStays !== '') {
            let requestBody;
            if (selectedLocation.address === undefined) {

                requestBody = {
                    "location_id": homeReducers.selectedStays.data.id,
                    "location_name": !selectedLocation.response.addresses[0].address.municipality ?
                        (!selectedLocation.response.addresses[0].address.countrySubdivision ? selectedLocation.response.addresses[0].address.freeformAddress : selectedLocation.response.addresses[0].address.countrySubdivision) :
                        (!selectedLocation.response.addresses[0].address.municipalitySubdivision ? selectedLocation.response.addresses[0].address.municipality : selectedLocation.response.addresses[0].address.municipalitySubdivision),
                    "latitude": selectedLocation.position.coords.latitude,
                    "longitude": selectedLocation.position.coords.latitude
                }
            } else requestBody = {
                "location_id": homeReducers.selectedStays.data.id,
                "location_name": !selectedLocation.address.municipality ?
                    (!selectedLocation.address.countrySubdivision ? selectedLocation.address.freeformAddress : selectedLocation.address.countrySubdivision) :
                    (!selectedLocation.address.municipalitySubdivision ? selectedLocation.address.municipality : selectedLocation.address.municipalitySubdivision),
                "latitude": selectedLocation.position.lat,
                "longitude": selectedLocation.position.lon
            }
            dispatch({ type: authActionTypes.APP_LOADER, flag: true });
            await POST(UPDATE_STAYS_LOCATION, JSON.stringify(requestBody), function (response) {
                dispatch({ type: authActionTypes.APP_LOADER, flag: false });
                if (response.status) {
                    props.navigation.goBack();
                } else {
                    if (response.response.msg === 'That location is already added' || response.response.msg === 'That location is exist') {
                        props.navigation.goBack();
                    } else {
                        setTimeout(() => {
                            Toast.show(response.response.msg);
                        }, 500);
                    }
                }
            }, userDetails.access_token);
        } else {
            let requestBody;
            if (selectedLocationAddress === undefined) {
                requestBody = {
                    "location_name": !selectedLocation.address.municipality ?
                        (!selectedLocation.address.countrySubdivision ? selectedLocation.address.freeformAddress : selectedLocation.address.countrySubdivision) :
                        (!selectedLocation.address.municipalitySubdivision ? selectedLocation.address.municipality : selectedLocation.address.municipalitySubdivision),
                    "latitude": selectedLocation.position.lat,
                    "longitude": selectedLocation.position.lon
                }
            } else requestBody = {
                "location_name": !selectedLocationAddress.municipality ?
                    (!selectedLocationAddress.countrySubdivision ? selectedLocationAddress.freeformAddress : selectedLocationAddress.countrySubdivision) :
                    (!selectedLocationAddress.municipalitySubdivision ? selectedLocationAddress.municipality : selectedLocationAddress.municipalitySubdivision),
                "latitude": selectedLocation.position.coords.latitude,
                "longitude": selectedLocation.position.coords.longitude
            }
            dispatch({ type: authActionTypes.APP_LOADER, flag: true });
            await POST(ADD_STAYS_LOCATION, JSON.stringify(requestBody), function (response) {
                dispatch({ type: authActionTypes.APP_LOADER, flag: false });
                if (response.status) {
                    props.navigation.goBack();
                } else {
                    if (response.response.msg === 'That location is already added' || response.response.msg === 'That location is exist') {
                        props.navigation.goBack();
                    } else {
                        setTimeout(() => {
                            Toast.show(response.response.msg);
                        }, 500);
                    }
                }
            }, userDetails.access_token);
        }
    }
}
export const onSelectStays = (selectedStays) => {
    return dispatch => {
        dispatch({ type: types.SELECTED_STAYS, selectedStays });
    }
}
export const onSetSelectStays = (data, authReducers) => {
    return async dispatch => {
        let requestBody = {
            "location_id": data.id
        }
        await POST(SET_STAYS_LOCATION, JSON.stringify(requestBody), function (response) {
            if (response.status) {
                // props.navigation.goBack();
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, authReducers.userDetails.access_token);
    }
}
export const onCurrentMember = (memberDetails, currentMemberDetails, navigation, type) => {
    return dispatch => {
        type === 'chatting' ? navigation.navigate('chattingProfile') : (navigation.navigate('fullProfile'), dispatch({ type: types.CURRENT_MEMBER, currentMemberDetails: { ...currentMemberDetails, memberDetails } }));
    }
}
export const onConnectMember = (currentMemberDetails, authReducers, callBack) => {
    return async dispatch => {
        dispatch({ type: types.CURRENT_MEMBER_IMAGE, currentMemberImage: 0 });
        dispatch({ type: types.IS_MEMBER_CHANGED, isMemberChanged: true });
        dispatch({ type: types.IS_MEMBER_CHANGED, isMemberChanged: false });

        if ((currentMemberDetails.memberCurrentIndex + 1) >= authReducers.memberList.length) {
            dispatch({ type: authActionTypes.MEMBER_LIST, memberList: [] });
            dispatch({ type: types.CURRENT_MEMBER, currentMemberDetails: { ...currentMemberDetails, memberCurrentIndex: 0 } });
            dispatch({ type: authActionTypes.APP_LOADER, flag: true });
            await dispatch(authAction.getMember(authReducers.userDetails, authReducers.userSettings, () => {
                dispatch({ type: authActionTypes.APP_LOADER, flag: false });
                try {
                    callBack();
                } catch (error) {
                    console.log({ error });
                }
            }));
        } else {
            dispatch({ type: types.CURRENT_MEMBER, currentMemberDetails: { ...currentMemberDetails, memberCurrentIndex: currentMemberDetails.memberCurrentIndex + 1 } });
            callBack();
        }
    }
}
export const onClearCurrentMemberIndex = (currentMemberDetails, index) => {
    return dispatch => {
        dispatch({ type: types.CURRENT_MEMBER, currentMemberDetails: { ...currentMemberDetails, memberCurrentIndex: index } });
    }
}
export const onRejectUser = (authReducers, id, callBack) => {
    return async dispatch => {
        let requestBody = {
            "cancel_user_id": id
        }
        await POST(REJECT_USER, JSON.stringify(requestBody), function (response) {
            if (response.status) {
                callBack();
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, authReducers.userDetails.access_token);
    }
}
export const onConnectUser = (authReducers, id, introTextInput, callBack) => {
    return async dispatch => {
        let requestBody = {
            "user_id": authReducers.userDetails.id,
            "like_to": id,
            "message": introTextInput
        }
        await POST(CONNECT_USER, JSON.stringify(requestBody), function (response) {
            if (response.status) {
                dispatch({ type: types.CONNECT_USER_RESPONSE, connectUserResponse: response.response });
                // setTimeout(() => {
                callBack(response);
                // }, 500);
            } else {
                setTimeout(() => {
                    Toast.show(response.response.msg);
                }, 500);
            }
        }, authReducers.userDetails.access_token);
    }
}
export const onMemberChanged = () => {
    return dispatch => {
        dispatch({ type: types.CURRENT_MEMBER_IMAGE, currentMemberImage: 0 });
        setTimeout(() => {
            dispatch({ type: types.IS_MEMBER_CHANGED, isMemberChanged: true });
            dispatch({ type: types.IS_MEMBER_CHANGED, isMemberChanged: false });
        }, 400);

    }
}
export const onMemberImageChanged = (index) => {
    return dispatch => {
        dispatch({ type: types.CURRENT_MEMBER_IMAGE, currentMemberImage: index });
    }
}
export const onDeleteModalVisibility = (flag) => {
    return dispatch => {
        dispatch({ type: types.IS_DELETE_MODAL_VISIBLE, flag });
    }
}