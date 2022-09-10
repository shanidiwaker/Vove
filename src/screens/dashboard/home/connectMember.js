//#region import 
//#region RN
import React, { useState, useRef, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Animated, Keyboard, TouchableOpacity } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { Strings } from '../../../res/string';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
import * as appAction from '../../../redux/actions/appActions';
import * as homeAction from '../../../redux/actions/homeActions';
import * as chatAction from '../../../redux/actions/chatActions';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import { hp, wp, DEVICE, DEVICE_OS } from "../../../utils/constants";
import { images } from '../../../res/images';
import { colors } from '../../../res/colors';
import { fonts } from '../../../res/fonts';
import { Spacer } from '../../../res/spacer';
import { Toolbar } from '../../../components/Toolbar';
import { AppButton } from '../../../components/AppButton';
import { AppModal } from '../../../components/AppModal';
import { UseKeyboard } from "../../../components/UseKeyboard";
import { DetailsTextInput } from '../../../components/DetailsTextInput';
import { BASE_URL } from '../../../apiHelper/APIs';
import Util from '../../../utils/utils';
//#endregion
//#endregion

export default ConnectMember = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    const appReducers = useSelector(state => state.appReducers);
    //#endregion redux
    //#region local state  
    const [keyboardHeight] = UseKeyboard();
    const [maxIntroTextHeight, setMaxIntroTextHeight] = useState(hp('50%'));
    const [usedLines, setUsedLines] = useState(0);
    const [height, setHight] = useState(0);
    const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
    //#endregion local state  
    //#region ref    
    let viewRef = useRef();
    let toolBarRef = useRef();
    let scrollViewRef = useRef();
    //#endregion ref 
    const onConnectToUser = () => {
        Keyboard.dismiss();
        dispatch(homeAction.onConnectUser(authReducers, authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].id, props.introTextInput, (response) => {
            if (response.response.isLimit) {
                props.onUpgradeModal();
            } else {
                Util.slideLeftAnim(props.likeConnectAnimation, DEVICE.DEVICE_HEIGHT / 2.9, 'y', () => {
                    setTimeout(() => {
                        props.hideConnectModal('isConnected');
                    }, 300);
                })
            }
        }));
    }
    // useEffect(() => {
    //     DEVICE_OS === 'android' && keyboardHeight !== 0 && scrollViewRef.scrollToEnd({ animated: true });
    // }, [keyboardHeight])
    return (
        authReducers.memberList.length !== 0 &&
        <>
            <AppModal isModalVisible={props.isConnect} onRequestClose={() => authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].status === 0 && props.hideConnectModal("back")} isConnectModal={true}>
                {/* <Animated.View style={{ backgroundColor: colors.TRANS, width: props.connectShrinkAnimation, position: 'absolute', }}>
                    <AnimatedFastImage source={{ uri: BASE_URL + '/' + authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].photos[0] }} style={{ width: undefined, height: props.connectShrinkAnimation, resizeMode: 'contain' }} />
                </Animated.View> */}

                <Animated.View style={{ backgroundColor: colors.TRANS, width: props.connectShrinkAnimation, position: 'absolute' }}>
                    <Animated.Image source={{ uri: BASE_URL + '/' + authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex]?.photos[0] }} style={{ opacity: props.fadeFullProfilePicAnimation, width: undefined, height: props.connectShrinkAnimation, resizeMode: 'contain' }} />
                </Animated.View>
                {props.isConnectContent &&
                    (authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].status === 0 ?
                        <>
                            <Toolbar
                                isProfile={true}
                                leftArrow={images.leftArrowWhite}
                                toolbarStyle={{ width: DEVICE.DEVICE_WIDTH }}
                                onBackPressed={() => props.hideConnectModal("back")} />
                            {/* <ScrollView bounces={true} keyboardShouldPersistTaps={'handled'}
                                // scrollEnabled={keyboardHeight === 0}
                                scrollEnabled={true}
                                ref={(ref) => { scrollViewRef = ref }}
                                showsVerticalScrollIndicator={false}> */}
                            {DEVICE_OS === 'ios' && <Spacer space={isIphoneX() ? hp('1%') : hp('1.5%')} />}
                            {/* <View style={{ width: DEVICE.DEVICE_WIDTH }}> */}
                            {/* <Toolbar
                                    isProfile={true}
                                    leftArrow={images.leftArrowWhite}
                                    toolbarStyle={DEVICE_OS === 'android' && { marginTop: StatusBar.currentHeight - wp('4%'), backgroundColor: 'red' }}
                                    onBackPressed={() => (setprops.isConnectContent(!props.isConnectContent), setIsConnect(!isConnect), props.connectShrinkAnimation = new Animated.Value(hp('15%')))} /> */}
                            <View
                                refs={(ref) => { toolBarRef = ref }}
                                onLayout={({ nativeEvent }) => setMaxIntroTextHeight(nativeEvent.layout.height)}
                                style={[styles.introContainer, {
                                    // height: DEVICE_OS === 'ios' ? hp('78%') : DEVICE.DEVICE_HEIGHT < 700 ? hp('78%') : hp('82%')
                                    // marginBottom: keyboardHeight === 0 ? wp('15%') : DEVICE_OS === 'ios' ? keyboardHeight + wp('10%') : keyboardHeight - wp('30%')
                                }]}>
                                <DetailsTextInput
                                    refs={(ref) => { viewRef = ref }}
                                    maxLength={120}
                                    type={'multiLine'}
                                    placeTxt={'Add a great introduction...'}
                                    value={props.introTextInput}
                                    connect={true}
                                    blurOnSubmit={true}
                                    returnKeyType={'done'}
                                    multilineStyle={[styles.introTxtInput, {
                                        maxHeight: DEVICE_OS === 'ios' ? maxIntroTextHeight - hp('11%') : maxIntroTextHeight - hp('15%'), borderRadius: usedLines === 2 ? hp('4%') : usedLines === 3 ? hp('3%') : usedLines >= 4 ? hp('2.5%') : hp('5%')
                                    }, DEVICE_OS === 'ios' && { paddingTop: wp('3%'), paddingBottom: wp('3%') }]}
                                    onChangeText={(input) => {
                                        if (input.length <= 120) {
                                            props.setIntroTextInput(input);
                                        } else {
                                            setTimeout(() => {
                                                props.setIntroTextInput(props.introTextInput);
                                                Keyboard.dismiss();
                                                dispatch(appAction.onChacractersModal(!appReducers.isChacractersLimitModal));
                                            }, 1);
                                        }
                                    }}
                                    onLayout={(e) => {
                                        //#region logic for count number of filled line of textinput
                                        if (height < e.nativeEvent.layout.height) {
                                            setUsedLines(usedLines + 1);
                                        }
                                        if (height > e.nativeEvent.layout.height) {
                                            setUsedLines(usedLines - 1);
                                        }
                                        if (height != e.nativeEvent.layout.height) {
                                            setHight(e.nativeEvent.layout.height);
                                        }
                                        //#endregion logic for count number of filled line of textinput
                                    }} />
                                <Spacer space={wp('2%')} />
                                <AppButton
                                    disabled={false}
                                    colors={[colors.GRADIENT1, colors.GRADIENT2]}
                                    title={'Connect'}
                                    onPress={() => onConnectToUser()} />
                                {DEVICE_OS === 'ios' && <KeyboardSpacer topSpacing={isIphoneX() ? -wp('5%') : -wp('1%')} />}
                                {/* </View> */}
                                <View style={{ height: isIphoneX() ? wp('15%') : wp('14%') }} />
                            </View>
                            {/* </ScrollView> */}
                            <Animated.View style={[props.likeConnectAnimation.getLayout(), { position: 'absolute', width: DEVICE.DEVICE_WIDTH }]}>
                                <FastImage source={images.likeConnect} style={[globalStyles.img, { height: wp('28%'), width: wp('28%'), alignSelf: 'center' }]} />
                            </Animated.View>
                        </> :
                        <View style={[globalStyles.paddingTop, styles.introContainer, { justifyContent: 'flex-start' }]}>
                            <Spacer space={wp('2%')} />
                            <Image source={images.connectHeading} style={[globalStyles.img, { height: wp('30%'), width: wp('100%') }]} />
                            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                {/* {sliderIndex === 0 && */}
                                {authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message !== null &&
                                    authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message !== '' &&
                                    /\S/.test(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message) &&
                                    <>
                                        <View style={styles.introBubble}>
                                            <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLACK, lineHeight: wp('6.7%'), fontFamily: fonts.VI }]} numberOfLines={4}>{authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message}</Text>
                                        </View>
                                        <Image source={images.speech} style={[globalStyles.img, styles.speechImg]} />
                                    </>}
                                <Spacer space={wp('2%')} />
                                <AppButton
                                    disabled={false}
                                    colors={[colors.GRADIENT1, colors.GRADIENT2]}
                                    title={'Message Now'}
                                    onPress={() => {
                                        console.log("authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex] : ", authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex]);
                                        dispatch(homeAction.onConnectUser(authReducers, authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].id, props.introTextInput, (response) => {
                                            if (response.response.isLimit) {
                                                props.onUpgradeModal();
                                            } else {
                                                props.hideConnectModal('isConnected');
                                                dispatch(chatAction.onChatItemClicked(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex], props.navigation, 'homeScreen'))
                                            }
                                        }));
                                    }} />
                                <Spacer space={wp('3%')} />
                                <AppButton
                                    title={'Later'}
                                    // onPress={() => props.hideConnectModal('isLater')}
                                    onPress={() => onConnectToUser()}
                                    style={{ borderWidth: 2, borderRadius: hp("5%"), borderColor: colors.WHITE }}
                                    txtStyle={{ color: colors.WHITE }}
                                    colors={[colors.TRANS, colors.TRANS]} />
                                <Spacer space={wp('5.5%')} />
                            </View>
                        </View>)
                }
                {/* //#region 8 Stays */}
                <AppModal
                    isAlert={true}
                    isChild={true}
                    modalStyle={{ width: wp('85%'), paddingTop: hp('5%') }}
                    isModalVisible={appReducers.isChacractersLimitModal}
                    isChacractersLimit={true}
                    onRequestClose={() => dispatch(appAction.onChacractersModal(!appReducers.isChacractersLimitModal))}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.4%'), textAlign: 'center' }]}>{Strings.LIMIT_CHARACTERS}</Text>
                        <Spacer space={wp('9%')} />
                        <TouchableOpacity onPress={() => dispatch(appAction.onChacractersModal(!appReducers.isChacractersLimitModal))}>
                            <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </AppModal>
                {/* //#endregion 8 Stays */}
            </AppModal>
        </>
    );
};
const styles = StyleSheet.create({
    locationContainer: {
        width: DEVICE.DEVICE_WIDTH,
        paddingTop: hp('1%'),
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 },
        elevation: 7,
        zIndex: 1
    },
    locationSubContainer: {
        width: wp('90%'),
        alignSelf: 'center',
        paddingBottom: hp('1%'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mainContainer: {
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: colors.GREY5,
        width: DEVICE.DEVICE_WIDTH,
    },
    memberCardView: {
        backgroundColor: colors.GREY5,
        height: isIphoneX() ? hp('72%') : hp('70%'),
        width: wp('90%'),
        borderRadius: wp('3%'),
        shadowColor: colors.DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 10,
        // overflow: DEVICE_OS === 'android' ? 'hidden' : 'visible'
    },
    shadowTxt: {
        backgroundColor: colors.TRANS,
        fontFamily: fonts.VM,
        fontSize: wp('7.5%'),
        color: colors.WHITE,
        textShadowColor: colors.BLACK_TRANSPARENT,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    bioTxt: {
        fontSize: wp('5.2%'),
        color: colors.WHITE,
        lineHeight: wp('7.3%')
    },
    bioSlider: {
        position: 'absolute',
        bottom: 0,
        // backgroundColor: 'rgba(168, 67, 18,0.7)',
        width: wp('90%'),
        borderBottomLeftRadius: wp('3%'),
        borderBottomRightRadius: wp('3%'),
        alignItems: 'center'
    },
    introBubble: {
        backgroundColor: colors.WHITE,
        padding: wp('2%'),
        paddingLeft: wp('4%'),
        paddingRight: wp('4%'),
        borderRadius: wp('5%'),
        width: wp('85%'),
        opacity: 0.8
    },
    speechImg: {
        height: wp('5%'),
        width: wp('9%'),
        alignSelf: 'flex-end',
        marginRight: wp('8%'),
        backgroundColor: null
    },
    introContainer: {
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        width: DEVICE.DEVICE_WIDTH,
        alignItems: 'center'
    },
    introTxtInput: {
        borderRadius: hp('5%'),
        width: wp('95%'),
        flex: 0,
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        lineHeight: null,
        paddingTop: hp('1.2%'),
        paddingBottom: hp('1.2%'),
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
        textAlignVertical: 'center',
        color: colors.DARK
    }
})