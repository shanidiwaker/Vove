//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet, Animated, FlatList, KeyboardAvoidingView, Keyboard } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX, ifIphoneX } from 'react-native-iphone-x-helper';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as appAction from '../../../redux/actions/appActions';
import * as action from '../../../redux/actions/chatActions';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import OnBackPressed from '../../../components/OnBackPressed';
import { Spacer } from '../../../res/spacer';
import { DEVICE, DEVICE_OS, hp, wp } from '../../../utils/constants';
import { colors } from '../../../res/colors';
import { Strings } from '../../../res/string';
import { AppButton } from '../../../components/AppButton';
import { BASE_URL, COUNTRY_FLAGS } from '../../../apiHelper/APIs';
import { fonts } from '../../../res/fonts';
import { Toolbar } from '../../../components/Toolbar';
import { images } from '../../../res/images';
import { UseKeyboard } from '../../../components/UseKeyboard';
import { AppModal } from '../../../components/AppModal';
import { OptionMenu } from '../../../components/OptionMenu';
import Util from '../../../utils/utils';
//#endregion
//#endregion
export default chatting = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const chatReducers = useSelector(state => state.chatReducers);
    const appReducers = useSelector(state => state.appReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    //#endregion redux   
    //#region local state   
    const refFlatlist = useRef();
    const [usedChatInputLines, setUsedChatInputLines] = useState(0);
    const [height, setHight] = useState(0);
    const [messageInput, setMessageInput] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNotSentMessage, setIsNotSentMessage] = useState(false);
    const [isNotSentMessageInput, setIsNotSentMessageInput] = useState('');
    const [isDisconnect, setIsDisconnect] = useState(false);
    const [isOptionVisible, setIsOptionVisible] = useState(false);
    const [disconnectModalOptions, setDisconnectModalOptions] = useState([]);
    const [keyboardHeight] = UseKeyboard();
    const [refreshing, setRefreshing] = useState(false);
    const [isVisibleLastMessage, setIsVisibleLastMessage] = useState(true);
    const [isNoMessage, setIsNoMessage] = useState(false);
    //#endregion local state

    useEffect(() => {
        dispatch(action.onGetConversion(authReducers.userDetails, chatReducers, (array) => {
            dispatch(action.onNewMessageListener(authReducers.userDetails, chatReducers, array, (response) => {
                try {
                    authReducers.userDetails.id === response.response.sender && (setMessageInput(''), refFlatlist.current?.scrollToEnd({ animated: true }))
                    keyboardHeight !== 0 && refFlatlist.current?.scrollToEnd({ animated: true });
                } catch (error) { }
                response.isReload && setIsNoMessage(!isNoMessage);
            }));
            setTimeout(() => {
                setIsScrolled(true);
            }, 200);
        }, 'initial'));
    }, [isNoMessage, chatReducers.isRetry]);

    // useEffect(() => {
    //     console.log("appReducers.isReportModal ......................... ", appReducers.isReportModal);
    //     appReducers.isReportModal && setIsOptionVisible(true);
    // }, [appReducers.isReportModal]);

    useEffect(() => {
        setDisconnectModalOptions(isDisconnect ? ['Cancel', 'Disconnect'] : ['Delete', 'Retry']);
    }, [isDisconnect, isNotSentMessage]);

    return (
        <View style={globalStyles.flex}>
            <OnBackPressed onBackPressed={() => dispatch(action.onClearConversion(chatReducers, props))} />
            <Toolbar
                isShadowLine={DEVICE_OS === 'ios' && true}
                isChatting={true}
                title={'Settings'}
                isRightIcon={images.moreDots}
                navigation={props.navigation}
                onBackPressed={() => dispatch(action.onClearConversion(chatReducers, props))}
                onRightIconPressed={() => {
                    dispatch(appAction.onOptionModalClicked(!appReducers.appOptionMenu, 'option'));
                    // setIsOptionVisible(true);
                }}
                toolbarStyle={DEVICE_OS === 'android' && { elevation: (isOptionVisible || appReducers.isReportModal) ? 0 : 6, backgroundColor: colors.WHITE }} />

            <View style={[globalStyles.subContainer, { width: wp('93%') }]}>
                {chatReducers.conversion !== '' && <FlatList
                    ref={refFlatlist}
                    keyExtractor={(item, index) => index.toString()}
                    data={chatReducers.conversion.data}
                    extraData={chatReducers.conversion.data}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ height: wp('2%') }} />}
                    ListHeaderComponent={<View style={{ height: wp('0.5%') }} />}
                    onContentSizeChange={() => {
                        try {
                            isVisibleLastMessage && refFlatlist.current.scrollToEnd({ animated: false })
                        } catch (error) { }
                    }}
                    onLayout={(e) => {
                        try {
                            isVisibleLastMessage && refFlatlist.current.scrollToEnd({ animated: true })
                        } catch (error) { }
                    }}
                    onScroll={({ nativeEvent }) => {
                        if (Util.isCloseToBottom(nativeEvent)) {
                            setIsVisibleLastMessage(true);
                        } else setIsVisibleLastMessage(false);
                    }}
                    // scrollEventThrottle={400}
                    renderItem={({ item, index }) => {
                        let isReceive = item.receiver;
                        let userId = authReducers.userDetails.id;
                        let isReceiveCond = (isReceive === userId);
                        return (
                            <>
                                <Spacer space={wp('1%')} />
                                <View style={[globalStyles.rowView, { justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={[!item.date ? ({ height: 0 }) : ([globalStyles.text, styles.timeDateTxt, { padding: 0 }]), !isScrolled && { color: colors.TRANS }]}>{item.date}</Text>
                                    {/* <Text style={[!item.time ? ({ height: 0 }) : (globalStyles.text, styles.timeDateTxt), !isScrolled && { color: colors.TRANS }]}>{item.time} </Text> */}
                                    <Text style={[!item.time ? ({ height: 0 }) : globalStyles.text, styles.timeDateTxt, item.date && { fontFamily: fonts.VR }, !isScrolled && { color: colors.TRANS }]}>{item.time}</Text>
                                </View>
                                <View style={[globalStyles.rowView, { alignSelf: isReceiveCond ? 'flex-start' : 'flex-end', alignItems: 'flex-start' }, !isScrolled && { backgroundColor: colors.TRANS }]}>
                                    {isReceiveCond && (chatReducers.conversion.data[index - 1] !== undefined ? (chatReducers.conversion.data[index - 1].receiver !== userId) : isReceiveCond) ?
                                        isScrolled && <>
                                            <FastImage source={{ uri: BASE_URL + '/' + chatReducers.selectedChatItem.photos[0] }} style={[globalStyles.roundImg, styles.chatItemProfileImg, !isScrolled && { tintColor: colors.TRANS }]} />
                                            <Spacer row={wp('2%')} />
                                        </> : <>
                                            <View style={[globalStyles.roundImg, styles.chatItemProfileImg]} />
                                            <Spacer row={wp('2%')} />
                                        </>}
                                    <View style={globalStyles.rowView}>
                                        {item.isNotSent && <FastImage source={images.problem} style={[globalStyles.img, styles.problemImg, !isScrolled && { tintColor: colors.TRANS }]} />}
                                        <TouchableOpacity disabled={item.isNotSent ? 0 : 1} style={[styles.msgContainer, isReceiveCond ?
                                            { backgroundColor: colors.WHITE2, borderTopRightRadius: wp('3%'), borderTopLeftRadius: 0 } :
                                            { backgroundColor: item.isNotSent ? colors.CHAT_BUBBLE2 : colors.CHAT_BUBBLE, marginRight: wp('2.8%') }, !isScrolled && { backgroundColor: colors.TRANS }]}
                                            onPress={() => {
                                                setIsNotSentMessage(!isNotSentMessage);
                                                setIsNotSentMessageInput(item);
                                            }}>
                                            <Text style={[globalStyles.text, styles.msgText, item.isNotSent && { color: colors.RED }, !isScrolled && { color: colors.TRANS }]}>{item.message}</Text>
                                            <Image source={!isReceiveCond ? images.pointingElement : images.pointingElement2} style={[globalStyles.img, styles.pointingImg, !isReceiveCond ? { right: -wp('2.8%') } : { left: -wp('3%') }, !isScrolled && { tintColor: colors.TRANS }]} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {!item.isNotSent && !isReceiveCond && index === chatReducers.conversion.data.length - 1 && <Text style={[globalStyles.text, styles.timeDateTxt, { textAlign: 'right', right: wp('1%') }, !isScrolled && { color: colors.TRANS }]}>Sent</Text>}
                                {item.isNotSent && <Text style={[globalStyles.text, styles.timeDateTxt, { textAlign: 'right', right: wp('1%'), color: colors.RED, top: -wp('0.5%') }, !isScrolled && { color: colors.TRANS }]}>Not Sent</Text>}
                            </>
                        )
                    }}
                    // onEndReached={onScrollTop}
                    onRefresh={() => {
                        dispatch(action.onClearConversion(chatReducers, undefined, true, () => {
                            dispatch(action.onGetConversion(authReducers.userDetails, chatReducers, (array) => {
                                setIsVisibleLastMessage(false);
                                dispatch(action.onNewMessageListener(authReducers.userDetails, chatReducers, array, (response) => {
                                    try {
                                        authReducers.userDetails.id === response.response.sender && (setMessageInput(''), refFlatlist.current?.scrollToEnd({ animated: true }))
                                        keyboardHeight !== 0 && refFlatlist.current?.scrollToEnd({ animated: true });
                                    } catch (error) { }
                                    response.isReload && setIsNoMessage(!isNoMessage);
                                }));
                            }));
                        }));
                    }}
                    refreshing={refreshing} />}
            </View>
            <View style={[styles.bottomContainer, { borderRadius: usedChatInputLines === 1 ? wp('8%') : usedChatInputLines >= 2 ? wp('6%') : wp('10%') }]}>
                <TextInput
                    multiline
                    value={messageInput}
                    onChangeText={(input) => {
                        if (input.length <= 500) {
                            setMessageInput(input);
                        } else {
                            setTimeout(() => {
                                setMessageInput(messageInput);
                                Keyboard.dismiss();
                            }, 1);
                        }
                    }}
                    placeholder={Strings.MESSAGE}
                    placeholderTextColor={colors.GREY7}
                    style={[globalStyles.text, styles.messageInput]}
                    onLayout={(e) => {
                        //#region logic for count number of filled line of textinput
                        if (height < e.nativeEvent.layout.height) {
                            setUsedChatInputLines(usedChatInputLines + 1);
                        }
                        if (height > e.nativeEvent.layout.height) {
                            setUsedChatInputLines(usedChatInputLines - 1);
                        }
                        if (height != e.nativeEvent.layout.height) {
                            setHight(e.nativeEvent.layout.height);
                        }
                        //#endregion logic for count number of filled line of textinput                        
                    }} />
                <TouchableOpacity style={styles.sendWrapper} disabled={(messageInput === '' || messageInput.match(/^ *$/) !== null) && true} onPress={() =>
                    dispatch(action.onSendMessage(chatReducers, authReducers.userDetails, messageInput.trimStart(), () => {
                        setMessageInput('');
                        // refFlatlist.current?.scrollToOffset({ animated: false, offset: 0 })
                        refFlatlist.current?.scrollToEnd({ animated: true });
                    }))
                }>
                    <Image source={(messageInput === '' || messageInput.match(/^ *$/) !== null) ? images.sendGrey : images.sendBlue} style={[globalStyles.img, styles.sendImage]} />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={DEVICE_OS == "ios" ? "padding" : "height"} />

            {/* //#region App Modal for not sent message modal */}
            <AppModal
                isAlert={true}
                isChild={true}
                modalStyle={{ width: wp('85%'), paddingTop: hp('5%') }}
                isModalVisible={isNotSentMessage || isDisconnect}
                onRequestClose={() => {
                    isDisconnect ? setIsDisconnect(!isDisconnect) : setIsNotSentMessage(!isNotSentMessage);
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.4%'), textAlign: 'center' }]}>{isDisconnect ? Strings.DISCONNECT : Strings.MESSAGE_NOT_SENT}</Text>
                    <Spacer space={wp('6%')} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: isDisconnect ? wp('85%') : wp('100%') }}>
                        {disconnectModalOptions.map((data, index) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    if (isDisconnect) {
                                        setIsDisconnect(!isDisconnect);
                                        index === 1 && dispatch(action.onDisconnectUser(chatReducers, authReducers.userDetails, props));
                                    } else {
                                        setIsNotSentMessage(!isNotSentMessage);
                                        index === 1 ? dispatch(action.onSendMessage(chatReducers, authReducers.userDetails, isNotSentMessageInput.message, () => {
                                            setMessageInput('');
                                            // refFlatlist.current?.scrollToOffset({ animated: false, offset: 0 })
                                            refFlatlist.current?.scrollToEnd({ animated: true });
                                        }, 'retry')) : dispatch(action.onDeleteMessage(chatReducers, isNotSentMessageInput));
                                    }
                                    // isDisconnect ? (setIsDisconnect(!isDisconnect)) : setIsNotSentMessage(!isNotSentMessage);
                                }}>
                                    <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>{data}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </AppModal>
            {/* //#endregion App Modal for not sent message modal */}

            {/* //#region option menu */}
            <OptionMenu
                options={[{ title: 'Disconnect', isReport: false }, { title: 'Report &\nDisconnect' }]}
                onRequestClose={() => {
                    dispatch(appAction.onOptionModalClicked(!appReducers.appOptionMenu, 'option'));
                }}
                onOptionItemClicked={() => setIsDisconnect(!isDisconnect)}
                onVisibleTransparentView={() => setIsOptionVisible(true)}
                isWithoutTransparent={true} />
            {/* //#endregion option menu */}
            {/* //#region Report and Reported Modal */}
            <AppModal
                isAlert={true}
                isChild={true}
                modalStyle={{ width: wp('93%'), paddingTop: hp('4%') }}
                mainContainer={{ backgroundColor: colors.TRANS }}
                isModalVisible={appReducers.isReportModal}
                onRequestClose={() => {
                    dispatch(appAction.onOptionModalClicked(!appReducers.isReportModal, 'report'));
                    setIsOptionVisible(false);
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('6%') }]}>Report Member</Text>
                    <Spacer space={wp('1.5%')} />
                    <Image source={images.shield} style={[globalStyles.img, { width: wp('15%'), height: wp('17%') }]} />
                    <Spacer space={wp('1.5%')} />
                    <Text style={[globalStyles.text, { color: colors.GREY1, fontSize: wp('5%') }]}>{Strings.THEY_DID}</Text>
                    <Spacer space={wp('3.5%')} />
                    {appReducers.reportOptions.map((data, index) => {
                        return (
                            <TouchableOpacity
                                style={{ width: wp('85%'), padding: wp('4%') }}
                                onPress={() => {
                                    dispatch(appAction.onReportOptionsClicked(data, index, authReducers, homeReducers, chatReducers.selectedChatItem));
                                    // dispatch(action.onDisconnectUser(chatReducers, authReducers.userDetails, props));
                                }}>
                                <Text style={[globalStyles.text, { fontSize: wp('4.8%'), fontFamily: fonts.VM }]}>{data.key_name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </AppModal>
            <AppModal
                isAlert={true}
                isChild={true}
                isReported={true}
                modalStyle={{ width: wp('93%'), paddingTop: hp('4%') }}
                mainContainer={{ backgroundColor: colors.TRANS }}
                isModalVisible={appReducers.isReportedModal}
                onRequestClose={() => {
                    dispatch(appAction.onOptionModalClicked(!appReducers.isReportedModal, 'reported'));
                    setIsOptionVisible(false);
                    dispatch(action.onDisconnectUser(chatReducers, authReducers.userDetails, props));
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('6%') }]}>Member Reported</Text>
                    <Image source={images.reportCheck} style={[globalStyles.img, { width: wp('17%'), height: wp('17%'), paddingTop: hp('25%') }]} />
                </View>
            </AppModal>
            {/* //#endregion Report and Reported Modal */}
            {isOptionVisible && <View style={[globalStyles.transPlaceholderView, { zIndex: 20, backgroundColor: colors.BLACK_TRANSPARENT }]} />}
        </View>
    );
};
const styles = StyleSheet.create({
    subContainer: {
        alignItems: 'center',
        flex: 0,
        width: DEVICE.DEVICE_WIDTH
    },
    newConnectionImg: {
        height: wp('16%'),
        width: wp('16%'),
    },
    newConnectionContainer: {
        backgroundColor: colors.SUN_FLOWER,
        justifyContent: 'center',
        alignItems: 'center'
    },
    newTxt: {
        fontFamily: fonts.VM,
        fontSize: wp('5.5%'),
        color: colors.WHITE
    },
    chatContainer: {
        alignSelf: 'flex-end',
        width: wp('95%')
    },
    messageHeader: {
        fontFamily: fonts.VM,
        fontSize: wp('5.5%'),
    },
    lastMessage: {
        fontFamily: fonts.VR,
        fontSize: wp('4.7%'),
        width: DEVICE.DEVICE_WIDTH / 1.5,
        color: colors.GREY2,
        marginTop: wp('0.5%'),
    },
    chatItemProfileImg: {
        height: wp('11.5%'),
        width: wp('11.5%'),
    },
    flagImg: {
        width: wp('9%'),
        height: wp('6.5%'),
        resizeMode: 'contain',
        top: DEVICE_OS === 'android' ? -wp('0.3%') : 0
    },
    replyTag: {
        position: 'absolute',
        top: 0,
        right: wp('3%'),
        backgroundColor: colors.SUN_FLOWER,
        borderRadius: 10,
        padding: wp('1.5%'),
        paddingTop: wp('0.1%'),
        paddingBottom: wp('0.5%')
    },
    bottomContainer: {
        flexDirection: 'row',
        marginBottom: isIphoneX() ? wp('5%') : wp('2%'),
        width: wp('95%'),
        alignSelf: 'center',
        borderRadius: wp('10%'),
        padding: wp('1%'),
        paddingLeft: DEVICE_OS === 'android' ? wp('5%') : wp('4%'),
        borderWidth: 1,
        borderColor: colors.GREY2
    },
    messageInput: {
        flex: 1,
        maxHeight: isIphoneX() ? wp('30%') : wp('29%'),
        padding: DEVICE_OS == 'android' ? wp('1.5%') : wp('1.8%'),
        marginTop: DEVICE_OS == 'ios' ? wp('0.4%') : 0,
        fontSize: DEVICE_OS === 'ios' ? wp('5%') : wp('4.9%'),
        color: colors.BLACK2,
        // backgroundColor: 'red'
    },
    sendWrapper: {
        // flex: 0.2,
        alignSelf: 'flex-end',
        padding: wp('2.5%')
    },
    sendImage: {
        width: wp('5%'),
        height: wp('5%'),
        alignSelf: "center",
    },
    msgContainer: {
        backgroundColor: 'red',
        maxWidth: DEVICE.DEVICE_WIDTH / 1.35,
        padding: wp('2.5%'),
        paddingLeft: wp('4%'),
        paddingRight: wp('4%'),
        borderRadius: wp('3%'),
        borderTopRightRadius: 0
    },
    msgText: {
        fontSize: wp('5%'),
        color: colors.BLACK
    },
    timeDateTxt: {
        fontFamily: fonts.VM,
        fontSize: wp('3.7%'),
        textAlign: 'center',
        color: colors.GREY2,
        padding: wp('1%'),
    },
    pointingImg: {
        width: wp('5%'),
        height: wp('5%'),
        // backgroundColor: 'red',
        position: 'absolute',
        top: -wp('1.2%'),
        // transform: [{ rotate: '120deg' }],
    },
    problemImg: {
        width: wp('6%'),
        height: wp('6%'),
        marginRight: wp('4%')
    }
});