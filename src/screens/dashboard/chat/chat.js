//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet, Animated, ScrollView } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/chatActions';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import OnBackPressed from '../../../components/OnBackPressed';
import { Spacer } from '../../../res/spacer';
import { DEVICE, DEVICE_OS, wp } from '../../../utils/constants';
import { colors } from '../../../res/colors';
import { Strings } from '../../../res/string';
import { AppButton } from '../../../components/AppButton';
import { BASE_URL, COUNTRY_FLAGS } from '../../../apiHelper/APIs';
import { fonts } from '../../../res/fonts';
import { images } from '../../../res/images';
//#endregion
//#endregion

export default chat = (Props) => {
    const props = Props.props;
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const chatReducers = useSelector(state => state.chatReducers);
    //#endregion redux    
    //#region local state  

    // console.log("chatReducers.chatScreenData : ", chatReducers.chatScreenData);
    //#endregion local state    
    return (
        <ScrollView style={globalStyles.flex} showsVerticalScrollIndicator={false}>
            {/* <OnBackPressed /> */}
            {/* //#region if there is are no messages */}
            {/* {Object.keys(chatReducers.chatScreenData).length &&(chatReducers.chatScreenData.chat_list.length === 0 && chatReducers.chatScreenData.connected.length <= 1) ? <View> */}
            {(Object.keys(chatReducers.chatScreenData).length === 0 || (chatReducers.chatScreenData.chat_list.length === 0 && chatReducers.chatScreenData.connected.length === 0)) ? <View>
                <Spacer space={wp('13%')} />
                <Text style={[globalStyles.text, { textAlign: 'center', color: colors.GREY2, fontSize: wp('6.5%') }]}>{Strings.NO_MESSAGES}</Text>
                <Spacer space={wp('9%')} />
                <AppButton
                    colors={[colors.GRADIENT1, colors.GRADIENT2]}
                    txtStyle={{ color: colors.WHITE }}
                    title={'Search'}
                    onPress={() => Props.onSearchClicked()} />
            </View> :
                <View style={styles.subContainer}>
                    {chatReducers.chatScreenData.connected.length !== 0 &&
                        <>
                            <Spacer space={wp('3%')} />
                            <View style={styles.subContainer}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {chatReducers.chatScreenData.connected.map((data, index) => {
                                        return (
                                            <>
                                                <Spacer row={wp('2.3%')} />
                                                <TouchableOpacity style={[globalStyles.roundImg, styles.newConnectionImg, index === 0 && styles.newConnectionContainer]} disabled={index === 0 && true} key={data.id} onPress={() => dispatch(action.onChatItemClicked(data, props.navigation))}>
                                                    {index !== 0 ? <FastImage source={data.photos ? { uri: BASE_URL + '/' + data.photos[0] } : images.logoWordsGrey} style={[globalStyles.roundImg, styles.newConnectionImg]} /> :
                                                        <Text style={styles.newTxt}>New</Text>}
                                                </TouchableOpacity>
                                                {index === (chatReducers.newConnection.length - 1) && <Spacer row={wp('2.3%')} />}
                                            </>
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        </>}
                    <Spacer space={wp('2.5%')} />
                    <View style={[globalStyles.subContainer, styles.chatContainer]}>
                        <Text style={[globalStyles.text, styles.messageHeader]}>Messages</Text>
                        <Spacer space={wp('1.5%')} />
                        <View style={globalStyles.rowDevider} />
                        {chatReducers.chatScreenData.chat_list.map((data, index) => {
                            return (
                                <>
                                    <Spacer space={index === 0 ? wp('1.6%') : wp('3.5%')} />
                                    <TouchableOpacity style={[globalStyles.rowView, { justifyContent: 'flex-start' }]} onPress={() => dispatch(action.onChatItemClicked(data, props.navigation))}>
                                        <FastImage source={{ uri: BASE_URL + '/' + data.photos[0] }} style={[globalStyles.roundImg, styles.chatItemProfileImg]} />
                                        <Spacer row={wp('2.5%')} />
                                        <View>
                                            <View style={[globalStyles.rowView, { justifyContent: 'flex-start' }]}>
                                                <Text style={[globalStyles.text, styles.messageHeader]}>{data.fullname.length > 13 ? `${data.fullname.substring(0, 13)}` : `${data.fullname}`}</Text>
                                                <Spacer row={wp('3%')} />
                                                <FastImage source={{ uri: COUNTRY_FLAGS(data.fly_country_code.toLowerCase()) }} style={[globalStyles.img, styles.flagImg]} />
                                            </View>
                                            <Text style={[globalStyles.text, styles.messageHeader, styles.lastMessage, data.last_message.is_read === 0 && { color: colors.DARK }]} numberOfLines={1}>{data.last_message.message}</Text>
                                            <View style={{ position: 'absolute', bottom: -wp('8%') }}>
                                                <View style={globalStyles.rowDevider} />
                                            </View>
                                        </View>
                                        {data.last_message.is_read === 0 && <View style={styles.replyTag}>
                                            <Text style={[globalStyles.text, styles.messageHeader, { fontSize: wp('3.5%'), color: colors.WHITE }]}>Reply</Text>
                                        </View>}
                                    </TouchableOpacity>
                                    {index === chatReducers.chatScreenData.chat_list.length - 1 && <Spacer space={isIphoneX() ? wp('4%') : wp('3%')} />}
                                </>
                            )
                        })}
                    </View>
                </View>}
        </ScrollView>

    );
};
const styles = StyleSheet.create({
    subContainer: {
        // alignItems: 'center',
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
        height: wp('22%'),
        width: wp('22%'),
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
    }
});