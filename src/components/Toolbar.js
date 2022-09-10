//#region import 
//#region RN
import React from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX, getStatusBarHeight } from "react-native-iphone-x-helper";
import { BASE_URL, COUNTRY_FLAGS } from '../apiHelper/APIs';
import { Spacer } from '../res/spacer';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as homeAction from "../redux/actions/homeActions";
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import { hp, wp, DEVICE_OS, APP_NAME, DEVICE } from "../utils/constants";
import { images } from '../res/images';
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
import { Strings } from '../res/string';
//#endregion
//#endregion

export const Toolbar = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const chatReducers = useSelector(state => state.chatReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    //#endregion redux
    return (
        props.title !== APP_NAME ?
            <View style={[globalStyles.paddingTop, styles.container, props.toolbarStyle, props.isShadowLine && [globalStyles.shadow, { justifyContent: 'flex-start', zIndex: 10 }], props.isInput && { justifyContent: 'space-between' }, props.title === 'Edit Profile' && { shadowOffset: { width: 0, height: 4 }, elevation: 12 }, props.isChatting && styles.chattingPadding]}>
                <View>
                    <TouchableOpacity onPress={props.onBackPressed} disabled={props.isBackDisable}>
                        <Image source={!props.leftArrow ? images.leftArrow : props.leftArrow} style={[globalStyles.img, styles.img, props.isBackDisable && { tintColor: colors.TRANS }, props.isProfile && { height: wp('9%'), width: wp('7%') }]} />
                    </TouchableOpacity>
                    {props.bottomTitle !== undefined && <Text style={[styles.bottomTitle, { marginTop: hp('5%'), marginLeft: wp('3%') }]}>{props.bottomTitle}</Text>}
                </View>

                {props.isChatting ?
                    <View style={[globalStyles.rowView, { justifyContent: 'flex-start', width: wp('81%') }]}>
                        <TouchableOpacity style={{ position: 'absolute', left: wp('6%') }} onPress={() => dispatch(homeAction.onCurrentMember({ location_name: Strings.NO_LOCATION }, chatReducers.selectedChatItem, props.navigation, 'chatting'))}>
                            <FastImage source={chatReducers.selectedChatItem.photos ? { uri: BASE_URL + '/' + chatReducers.selectedChatItem.photos[0] } : images.logoWordsGrey} style={[globalStyles.roundImg, styles.chatItemProfileImg]} />
                        </TouchableOpacity>
                        <Spacer space={wp('4%')} />
                        <Spacer row={wp('10%')} />
                        <TouchableOpacity onPress={() => dispatch(homeAction.onCurrentMember({ location_name: Strings.NO_LOCATION }, chatReducers.selectedChatItem, props.navigation, 'chatting'))}>
                            {/* <Text style={[globalStyles.text, styles.messageHeader]}>{chatReducers.selectedChatItem.fullname.length > 10 ? `${chatReducers.selectedChatItem.fullname.substring(0, 10)}` : `${chatReducers.selectedChatItem.fullname}`}</Text> */}
                            <Text style={[globalStyles.text, styles.messageHeader]} numberOfLines={1}>{chatReducers.selectedChatItem.fullname}</Text>
                        </TouchableOpacity>
                        <Spacer row={wp('1.5%')} />
                        <FastImage source={{ uri: COUNTRY_FLAGS(chatReducers.selectedChatItem.fly_country_code.toLowerCase()) }} style={[globalStyles.img, styles.flagImg]} />
                    </View> :
                    !props.isInput ? <Text style={[styles.bottomTitle, { fontSize: wp('6.8%') }, props.isShadowLine && { color: colors.DARK, marginLeft: wp('8%'), fontSize: wp('5.6%') }, (props.title === 'Edit Profile' || props.isChatting) && { width: wp('70%') }]}>{props.title}</Text> :
                        <TextInput
                            ref={props.refs}
                            placeholder={props.placeTxt}
                            style={[styles.text, { color: colors.BLACK, width: wp('70%'), fontFamily: fonts.VR, paddingLeft: wp('5%') }, Platform.OS === 'android' && { padding: 0, paddingLeft: isIphoneX() ? wp('5%') : wp('2%'), margin: -hp('2%') }]}
                            placeholderTextColor={colors.GREY2}
                            onChangeText={props.onChangeText}
                            value={props.value}
                            autoFocus={false}
                            onSubmitEditing={props.onSubmitEditing}
                            keyboardType={props.keyboardType}
                            autoCorrect={false}
                            selectionColor={colors.DARK}
                            editable={props.editable} />}
                {/* <TouchableOpacity onPress={props.onRightIconPressed} style={[props.isChatting && { position: 'absolute', alignSelf: 'center', bottom: DEVICE_OS === 'android' ? wp('3.6%') : isIphoneX() ? wp('4%') : wp('3.3%'), right: wp('3%') }, props.isInput && { height: wp('7%'), width: wp('7%'), alignItems: 'center', justifyContent: 'center' }, props.title === 'Edit Profile' && { right: wp('2%') }]}>
                    <Image source={(props.title === 'Edit Profile' || props.isChatting) ? props.isRightIcon : props.isProfile ? images.more : images.closeIcon} style={[globalStyles.img, { height: hp('2%'), width: hp('2%') }, props.title === 'Edit Profile' && { height: wp('5%'), width: wp('8%') }, props.isProfile && { height: wp('10.5%'), width: wp('6%') }, props.isChatting && { height: wp('7%'), width: wp('7%') }, !props.isRightIcon && { tintColor: colors.TRANS }]} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={props.onRightIconPressed} style={[props.isChatting && {}, props.isInput && { height: wp('7%'), width: wp('7%'), alignItems: 'center', justifyContent: 'center' }, props.title === 'Edit Profile' && { right: wp('2%') }]}>
                    <Image source={(props.title === 'Edit Profile' || props.isChatting) ? props.isRightIcon : props.isProfile ? images.more : images.closeIcon} style={[globalStyles.img, { height: hp('2%'), width: hp('2%') }, props.title === 'Edit Profile' && { height: wp('5%'), width: wp('8%') }, props.isProfile && { height: wp('10.5%'), width: wp('15%'), left: wp('4%') }, props.isChatting && { height: wp('7%'), width: wp('7%') }, !props.isRightIcon && { tintColor: colors.TRANS }]} />
                </TouchableOpacity>
            </View> :
            <View style={[globalStyles.paddingTopTabBar, styles.container, props.toolbarStyle, { padding: hp('1.5%'), zIndex: props.isDeleteModalVisible ? 0 : 10, paddingBottom: hp('1.3%') }, props.tabIndex !== 1 && globalStyles.shadow]}>
                {props.tab.map((data, index) => {
                    return (
                        <View style={[{ flex: 1, alignItems: 'center' }]}>
                            <TouchableOpacity style={[index === 0 && { marginRight: wp('10%') }, index === 2 && { marginLeft: wp('12%'), alignItems: 'center', justifyContent: 'center' }]} onPress={() => props.onTabClicked(index)}>
                                {index === 0 ?
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        {props.tabIndex === 0 && <Image source={images.ring} style={[globalStyles.roundImg, { height: wp('12.5%'), width: wp('12.5%'), position: 'absolute' }]} />}
                                        <FastImage source={data} style={[globalStyles.roundImg, { height: wp('10.4%'), width: wp('10.4%') }]} />
                                    </View> :
                                    <Image source={props.tabIndex === index ? index === 1 ? images.logoWords : images.chat : data} style={[globalStyles.img, styles.tabIcons, index === 2 && { height: wp('9%'), width: wp('9%') }]} />}
                                {Object.keys(chatReducers.chatScreenData).length !== 0 && index === 2 && chatReducers.chatScreenData.total !== 0 &&
                                    <View style={styles.chatCount}>
                                        <View style={styles.chatCount2}>
                                            <Text style={styles.chatCountTxt} numberOfLines={1}>{chatReducers.chatScreenData.total}</Text>
                                        </View>
                                    </View>}
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: hp('2%'),
        flexDirection: 'row'
    },
    text: {
        fontFamily: fonts.VM,
        fontSize: wp('5.4%'),
        color: colors.BROWN
    },
    bottomTitle: {
        fontFamily: fonts.VM,
        fontSize: wp('8.7%'),
        color: colors.RED
    },
    img: {
        height: wp('6%'),
        width: wp('6%')
    },
    tabIcons: {
        height: wp('10%'),
        width: wp('22%'),
        // backgroundColor: 'red'
    },
    chatCount: {
        position: 'absolute',
        right: -wp('3.8%'),
        bottom: wp('2.2%'),
        borderRadius: 100,
        padding: wp('0.5%'),
        backgroundColor: colors.WHITE,
        height: wp('5.4%'),
        width: wp('5.4%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatCount2: {
        height: wp('4.2%'),
        width: wp('4.2%'),
        backgroundColor: colors.RED2,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatCountTxt: {
        color: colors.WHITE,
        fontSize: wp('2.7%'),
        fontFamily: fonts.VM,
    },
    messageHeader: {
        fontSize: wp('6%'),
        maxWidth: wp('48%'),
        color: colors.DARK
    },
    flagImg: {
        width: wp('9%'),
        height: wp('7%'),
        resizeMode: 'contain',
        top: DEVICE_OS === 'android' ? -wp('0.1%') : 0
    },
    chatItemProfileImg: {
        height: wp('11%'),
        width: wp('11%')
    },
    chattingPadding: {
        paddingTop: isIphoneX() ? (getStatusBarHeight() + hp('2.3%')) : DEVICE_OS === 'ios' ? (getStatusBarHeight() + hp('2.4%')) : hp('2.4%')
    }
})