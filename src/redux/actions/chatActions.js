//#region import
//#region RN
//#endregion
//#region third party libs
import Toast from 'react-native-simple-toast';
import * as RNLocalize from "react-native-localize";
//#endregion
//#region common files
import * as types from "../actionTypes/chatActionTypes";
import { CONVERSION, DISCONNECT_USER } from '../../apiHelper/APIs';
import { POST } from '../../apiHelper/apiService';
import SocketManager from '../../socket/socketManager';
import { getData, saveData } from '../../utils/asyncStorageHelper';
import * as authActionTypes from "../actionTypes/authActionTypes";
//#endregion
//#endregion
export const onChatItemClicked = (item, navigation, type) => {
    return dispatch => {
        dispatch({ type: types.ON_CHATLIST_ITEM_CLICKED, item });
        navigation.navigate('chatting', { type });
    }
}
export const onSocketConnect = (item, navigation) => {
    return async dispatch => {
        const instance = new SocketManager();
        await Object.assign(instance);
        setTimeout(() => {
            SocketManager.instance.listenChatScreen(response => {
                response.connected.length !== 0 && response.connected.splice(0, 0, { id: null });
                dispatch({ type: types.ON_LISTEN_CHAT_SCREEN, payload: response });
                saveData('chatScreen', response);
            });
        }, 100);
    }
}
export const onGetConversion = (userDetails, chatReducers, callBack, type) => {
    return async dispatch => {
        console.log("type............ ", type);
        console.log("chatReducers............ ", chatReducers);
        if (chatReducers.isRetryFrom === 'retryMessage') {
            console.log("chatReducers.isRetryFrom : ", chatReducers.isRetryFrom);
            console.log("chatReducers.conversion : ", chatReducers.conversion);
            callBack(chatReducers.conversion);
        } else {
            if (global.isNetworkDisable) {
                onGetOfflineConversion(chatReducers.selectedChatItem, dispatch, callBack);
            } else {
                if (type === undefined) {
                    getConversion(userDetails, chatReducers, callBack, dispatch, type);
                } else {
                    onGetOfflineConversion(chatReducers.selectedChatItem, dispatch, (offlineChat) => {
                        console.log({ offlineChat });
                        offlineChat === undefined && getConversion(userDetails, chatReducers, callBack, dispatch, type);
                        if (offlineChat !== undefined) {
                            let flag = false;
                            var BreakException = {};
                            try {
                                // conversion.forEach(element => {
                                //     if (chatItem.id === element.receiverId) {
                                //         flag = true;
                                //         selectedElement = element.data;
                                //         throw BreakException;
                                //     } else {
                                //         flag = false;
                                //     }
                                // });
                                offlineChat.data.forEach(element => {
                                    if (element.isNotSent) {
                                        flag = true;
                                        throw BreakException;
                                    }
                                });
                            } catch (e) {
                                if (e !== BreakException) throw e;
                            }
                            !flag ? getConversion(userDetails, chatReducers, callBack, dispatch, type) :
                                (dispatch({ type: types.ON_GET_CONVERSION, payload: offlineChat }), callBack(offlineChat));
                        }
                    }, 'initial');
                }
            }
        }
    }
}
const getConversion = async (userDetails, chatReducers, callBack, dispatch, type) => {
    console.log("chatReducers......... : ", chatReducers.conversion);
    // dispatch({ type: authActionTypes.APP_LOADER, flag: true });
    let requestBody = {
        "receiver": chatReducers.selectedChatItem.id,
        "timezone": RNLocalize.getTimeZone(),
        "page": type === 'initial' ? 1 : (Object.keys(chatReducers.conversion).length === 0 ? 1 : chatReducers.conversion.CurrentPage + 1)
    };
    console.log({ requestBody });
    await POST(CONVERSION, JSON.stringify(requestBody), function (response) {
        // dispatch({ type: authActionTypes.APP_LOADER, flag: false });
        if (response.status) {
            let array = response.response;
            if (chatReducers.conversion !== '' && type === undefined) {
                try {
                    // array.data.push(...array.data, ...chatReducers.conversion.data);
                    array.data.push(...chatReducers.conversion.data);
                } catch (error) {
                    console.log({ error });
                }
            }
            // console.log({ array });
            dispatch({ type: types.ON_GET_CONVERSION, payload: array });
            // Object.keys(chatReducers.conversion).length === 0 &&
            onStoreConversions(chatReducers.selectedChatItem.id, array);
            type === 'initial' && SocketManager.instance.emitReadMessage({ sender: userDetails.id, receiver: chatReducers.selectedChatItem.id });
        }
        callBack(response.response);
    }, userDetails.access_token);
}
const onStoreConversions = (id, array, callBack) => {
    console.log("onStoreConversions array : .........  :", array);
    getData('conversion', (conversion) => {
        console.log("conversion ,,,,,,,,,,,,,,,, : ", conversion);
        let storeArray = conversion === null ? [] : conversion;
        if (storeArray.length === 0) {
            storeArray.push({ receiverId: id, data: array });
        } else {
            let flag = false;
            var BreakException = {};
            try {
                storeArray.forEach(element => {
                    if (id === element.receiverId) {
                        // console.log("same array  : ", array);
                        // console.log("element,,,,,, ", element);
                        // if (array.data.length !== element.data.data.length) {
                        //     // console.log("Need to merge : ", element.data.data = array.data);
                        // }
                        // let newMarkers = element.data.data.map(el => (
                        //     el.name === 'name' ? { ...el, key: value } : el
                        // ))
                        element.data.data = array.data === undefined ? array : array.data;
                        flag = true;
                        throw BreakException;
                    } else {
                        flag = false;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }
            !flag && storeArray.push({ receiverId: id, data: array });
            console.log({ storeArray });
        }
        saveData('conversion', storeArray, () => {
            callBack !== undefined && callBack();
        });
    }, (failure) => {
        console.log(failure);
        // saveData('conversion', []);
    });
}
export const onNewMessageListener = (userDetails, chatReducers, array, callBack) => {
    return dispatch => {
        console.log("onNewMessageListener array : ", array);
        SocketManager.instance.listenNewMessage(chatReducers.selectedChatItem.id, response => {
            console.log("onNewMessageListener: ", response);
            if (Object.keys(array.data).length === 0) {
                callBack({ isReload: true, response });
                SocketManager.instance.listenNewMessageOFF(chatReducers.selectedChatItem.id);
            } else {
                console.log("onNewMessageListener array : ", array);
                array.data.push(response);
                dispatch({ type: types.ON_GET_CONVERSION, payload: array });
                SocketManager.instance.emitReadMessage({ sender: userDetails.id, receiver: chatReducers.selectedChatItem.id });
                callBack({ isReload: false, response });
            }
        });
    }
}
export const onSendMessage = (chatReducers, userDetails, messageInput, callBack, type) => {
    return async dispatch => {
        console.log("messageInput............ : ", messageInput);
        if (!global.isNetworkDisable) {
            let requestBody = {
                sender: userDetails.id,
                receiver: chatReducers.selectedChatItem.id,
                message_type: 'text',
                message: messageInput,
                timezone: RNLocalize.getTimeZone()
            };
            SocketManager.instance.emitSendMessage(requestBody);
        }

        console.log("onSendMessage type.....  : ", type);
        if (type === undefined) {
            let requestBody2 = {
                created: "",
                created_at: "",
                d: "",
                date: "",
                id: '',
                is_read: 0,
                message: messageInput,
                receiver: chatReducers.selectedChatItem.id,
                sender: userDetails.id,
                time: "",
                updated_at: "",
                isNotSent: global.isNetworkDisable
            }
            let copyData = !global.isNetworkDisable ? [...chatReducers.conversion.data] : chatReducers.conversion.data;
            console.log({ copyData });
            copyData.push(requestBody2);
            onStoreConversions(chatReducers.selectedChatItem.id, copyData);
            global.isNetworkDisable && callBack();
        } else {
            console.log("onSendMessage else");
            if (!global.isNetworkDisable) {

                // chatReducers.conversion.data
                getData('conversion', (conversion) => {
                    console.log("conversion ///////////// . : ", conversion);
                    console.log("messageInput : ", messageInput);

                    var BreakException = {};
                    try {
                        conversion.forEach(element => {
                            if (chatReducers.selectedChatItem.id === element.receiverId) {
                                console.log("element : ", element);
                                element.data.data.forEach((item, index) => {
                                    if (item.isNotSent && messageInput === item.message) {
                                        console.log("deleted indes=x.......... `", index);
                                        element.data.data[index].isNotSent = false;
                                        dispatch({ type: types.ON_GET_CONVERSION, payload: element.data });
                                        console.log("after retry conversion : ", conversion);
                                        SocketManager.instance.listenNewMessageOFF(chatReducers.selectedChatItem.id);
                                        onStoreConversions(chatReducers.selectedChatItem.id, element.data, () => {
                                            dispatch({ type: types.IS_RETRY, flag: !chatReducers.isRetry, from: 'retryMessage' });
                                            element.data.data.splice(index, 1);
                                        });
                                        throw BreakException;
                                    }
                                });
                            }
                        });
                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }


                    // saveData('conversion', conversion, () => {
                    //     console.log("chatReducers : ", chatReducers);
                    //     SocketManager.instance.listenNewMessageOFF(chatReducers.selectedChatItem.id);
                    //     dispatch({ type: types.ON_GET_CONVERSION, payload: '' });
                    //     dispatch({ type: types.IS_RETRY, flag: !chatReducers.isRetry });
                    // });
                });
            }
        }
    }
}
export const onDeleteMessage = (chatReducers, isNotSentMessageInput) => {
    return async dispatch => {
        console.log("Delete will be  : ", isNotSentMessageInput);
        console.log("Delete will be chatReducers  : ", chatReducers.conversion);
        let flag = false;
        var BreakException = {};
        try {
            chatReducers.conversion.data.forEach((element, index) => {
                console.log({ element });
                // if (isNotSentMessageInput === element.message) {
                if (JSON.stringify(isNotSentMessageInput) === JSON.stringify(element)) {
                    console.log("deleted indes=x.......... `", element);
                    chatReducers.conversion.data.splice(index, 1);
                    flag = true;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        console.log("flag : ", flag);
        flag && (dispatch({ type: types.ON_GET_CONVERSION, payload: chatReducers.conversion }),
            onStoreConversions(chatReducers.selectedChatItem.id, chatReducers.conversion));
    }
}
export const onClearConversion = (chatReducers, props, isFrom, callBack) => {
    return async dispatch => {
        if (isFrom) {
            SocketManager.instance.listenNewMessageOFF(chatReducers.selectedChatItem.id);
            callBack();
        } else {
            dispatch({ type: types.ON_GET_CONVERSION, payload: '' });
            dispatch({ type: types.IS_RETRY_FROM, from: '' });
            SocketManager.instance.listenNewMessageOFF(chatReducers.selectedChatItem.id);
            props.navigation.goBack();
        }
    }
}
export const onDisconnectUser = (chatReducers, userDetails, props, type) => {
    return async dispatch => {
        let requestBody = {
            "disconnect_user_id": chatReducers.selectedChatItem.id
        };
        await POST(DISCONNECT_USER, JSON.stringify(requestBody), function (response) {
            SocketManager.instance.listenNewMessageOFF(chatReducers.selectedChatItem.id);
            type === undefined ? props.navigation.goBack() : (props.navigation.goBack(), props.navigation.goBack());
        }, userDetails.access_token);
    }
}
export const onGetOfflineChat = (chatReducers) => {
    return async dispatch => {
        getData('chatScreen', (chatScreen) => {
            console.log("chatScreen ///////////// . : ", chatScreen);
            dispatch({ type: types.ON_LISTEN_CHAT_SCREEN, payload: chatScreen });
        }, (failure) => {
            console.log(failure);
        });
    }
}
const onGetOfflineConversion = async (chatItem, dispatch, callBack, type) => {
    console.log("chatItem : ", chatItem);
    getData('conversion', (conversion) => {
        console.log("conversion ///////////// . : ", conversion);
        let selectedElement;
        conversion === null && callBack(selectedElement);
        let flag = false;
        var BreakException = {};
        try {
            conversion.forEach(element => {
                if (chatItem.id === element.receiverId) {
                    flag = true;
                    selectedElement = element.data;
                    throw BreakException;
                } else {
                    flag = false;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        if (type === undefined) {
            flag && (dispatch({ type: types.ON_GET_CONVERSION, payload: selectedElement }), callBack(selectedElement));
        } else
            callBack(selectedElement);
    }, (failure) => {
        console.log(failure);
    });
}