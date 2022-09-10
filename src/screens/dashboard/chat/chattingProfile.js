//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Image, StyleSheet, Animated } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
import * as appAction from '../../../redux/actions/appActions';
import * as chatAction from '../../../redux/actions/chatActions';
//#endregion
//#region common files
import { Strings } from '../../../res/string';
import globalStyles from '../../../res/globalStyles';
import { colors } from '../../../res/colors';
import { DEVICE, DEVICE_OS, hp, wp } from '../../../utils/constants';
import { images } from '../../../res/images';
import { fonts } from '../../../res/fonts';
import { BASE_URL, COUNTRY_FLAGS } from '../../../apiHelper/APIs';
import { Spacer } from '../../../res/spacer';
import { Toolbar } from '../../../components/Toolbar';
import { OptionMenu } from '../../../components/OptionMenu';
import Util from '../../../utils/utils';
import { AppModal } from '../../../components/AppModal';
import OnBackPressed from '../../../components/OnBackPressed';
//#endregion
//#endregion

export default chattingProfile = (props) => {
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    const appReducers = useSelector(state => state.appReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    const chatReducers = useSelector(state => state.chatReducers);
    //#endregion redux
    //#region local state    
    const [isOptionVisible, setIsOptionVisible] = useState(false);
    const [currentStay, setCurrentStay] = useState({ location_name: Strings.NO_LOCATION });
    const [isDisconnect, setIsDisconnect] = useState(false);
    //#endregion local state     
    //#region ref    
    let imageSliderRef = useRef();
    //#endregion ref     
    useEffect(() => {
        if (homeReducers.userStays.length !== 0) {
            homeReducers.userStays.filter((item) => {
                return item.isDefault === 1 && setCurrentStay(item);
            });
        }
    }, [homeReducers.userStays])

    return (
        <Animated.View style={globalStyles.flex}>
            <OnBackPressed onBackPressed={() => props.navigation.goBack()} />
            <ScrollView style={globalStyles.flex}>
                <View style={{ height: hp('70%') }}>
                    <ImageSlider
                        autoPlayWithInterval={5000}
                        images={chatReducers.selectedChatItem.photos}
                        customSlide={({ index, item, style, width }) => (
                            <View key={index} style={[style, { backgroundColor: colors.WHITE }]}>
                                <FastImage source={{ uri: BASE_URL + '/' + item }} style={{ width: undefined, height: DEVICE.DEVICE_HEIGHT / 1.3 }} />
                            </View>
                        )} />
                </View>
                <View style={styles.titleContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('7.5%'), top: DEVICE_OS === 'ios' ? wp('1%') : wp('0.6%') }]}>{chatReducers.selectedChatItem.fullname.length > 15
                            ? `${chatReducers.selectedChatItem.fullname.substring(0, 15)}`
                            : `${chatReducers.selectedChatItem.fullname}`}
                            <Text style={[globalStyles.text, { fontSize: wp('7.5%') }]}> {Util.onAgeCalculation(chatReducers.selectedChatItem.birth_date)}</Text></Text>
                        <FastImage source={{ uri: COUNTRY_FLAGS(chatReducers.selectedChatItem.fly_country_code.toLowerCase()) }} style={[globalStyles.img, { width: wp('13%'), height: wp('11%') }, DEVICE_OS === 'android' && { top: -wp('0.5%') }]} />
                    </View>
                    <Spacer space={wp('1.4%')} />
                    <View style={[globalStyles.rowView, { justifyContent: 'flex-start' }]}>
                        <Image source={images.locationPinGray} style={[globalStyles.img, { width: wp('4%'), height: wp('4%'), marginLeft: -wp('0.5%') }]} />
                        <Spacer row={wp('1%')} />
                        <Text style={[globalStyles.text, { color: colors.GREY2, fontSize: wp('5%') }]}>{currentStay.location_name}</Text>
                    </View>
                    <Text style={[globalStyles.text, styles.bioTxt]}>{chatReducers.selectedChatItem.bio_content}</Text>
                </View>
                <Toolbar
                    toolbarStyle={styles.toolbar}
                    leftArrow={images.leftArrowWhite}
                    isRightIcon={images.more}
                    isProfile={true}
                    onBackPressed={() => props.navigation.goBack()}
                    onRightIconPressed={() => {
                        dispatch(appAction.onOptionModalClicked(!appReducers.appOptionMenu, 'option'));
                        setIsOptionVisible(true);
                    }} />
            </ScrollView>

            {/* //#region option menu */}
            <OptionMenu
                options={[{ title: 'Disconnect', isReport: false }, { title: 'Report &\nDisconnect' }]}
                onRequestClose={() => {
                    dispatch(appAction.onOptionModalClicked(!appReducers.appOptionMenu, 'option'));
                    setIsOptionVisible(false);
                }}
                onOptionItemClicked={() => setIsDisconnect(!isDisconnect)}
                onVisibleTransparentView={() => setIsOptionVisible(true)}
                isWithoutTransparent={true} />
            {/* //#endregion option menu */}
            <AppModal
                isAlert={true}
                isChild={true}
                modalStyle={{ width: wp('85%'), paddingTop: hp('5%') }}
                isModalVisible={isDisconnect}
                onRequestClose={() => {
                    setIsDisconnect(!isDisconnect);
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.4%'), textAlign: 'center' }]}>{Strings.DISCONNECT}</Text>
                    <Spacer space={wp('6%')} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: wp('85%') }}>
                        {['Cancel', 'Disconnect'].map((data, index) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    setIsDisconnect(!isDisconnect);
                                    index === 1 && dispatch(chatAction.onDisconnectUser(chatReducers, authReducers.userDetails, props, 'profile'));
                                    setIsOptionVisible(false);
                                }}>
                                    <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>{data}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </AppModal>

            {/* //#region Report and Reported Modal */}
            <AppModal
                isAlert={true}
                isChild={true}
                modalStyle={{ width: wp('93%'), paddingTop: hp('4%') }}
                isModalVisible={appReducers.isReportModal}
                mainContainer={{ backgroundColor: colors.TRANS }}
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
                    <Spacer space={DEVICE_OS === 'ios' ? wp('4%') : wp('3.5%')} />
                    {appReducers.reportOptions.map((data, index) => {
                        return (
                            <TouchableOpacity
                                style={{ width: wp('85%'), padding: wp('4%') }}
                                onPress={() => {
                                    dispatch(appAction.onReportOptionsClicked(data, index, authReducers, homeReducers, chatReducers.selectedChatItem));
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
                isModalVisible={appReducers.isReportedModal}
                mainContainer={{ backgroundColor: colors.TRANS }}
                onRequestClose={() => {
                    dispatch(appAction.onOptionModalClicked(!appReducers.isReportedModal, 'reported'));
                    setIsOptionVisible(false);
                    dispatch(chatAction.onDisconnectUser(chatReducers, authReducers.userDetails, props, 'profile'))
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('6%') }]}>Member Reported</Text>
                    <Image source={images.reportCheck} style={[globalStyles.img, { width: wp('17%'), height: wp('17%'), paddingTop: hp('25%') }]} />
                </View>
            </AppModal>
            {/* //#endregion Report and Reported Modal */}

            {isOptionVisible && <View style={globalStyles.transPlaceholderView} />}
        </Animated.View>
    );
};
const styles = StyleSheet.create({
    titleContainer: {
        width: wp('100%'),
        padding: hp('3%'),
        paddingTop: DEVICE_OS === 'android' ? wp('4%') : wp('3.6%'),
        marginBottom: wp('30%')
    },
    bioTxt: {
        fontSize: wp('5.2%'),
        color: colors.GREY1,
        marginTop: hp('2.5%'),
        lineHeight: wp('7.3%')
    },
    toolbar: {
        backgroundColor: colors.TRANS,
        position: 'absolute',
        top: -wp('1%'),
        width: DEVICE.DEVICE_WIDTH
    }
})