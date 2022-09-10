//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Image, StyleSheet, Animated } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageSlider from 'react-native-image-slider';
import { Strings } from '../../../res/string';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
import * as appAction from '../../../redux/actions/appActions';
import * as homeAction from '../../../redux/actions/homeActions';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import { colors } from '../../../res/colors';
import { DEVICE, DEVICE_OS, hp, wp } from '../../../utils/constants';
import { images } from '../../../res/images';
import { fonts } from '../../../res/fonts';
import { BASE_URL, COUNTRY_FLAGS } from '../../../apiHelper/APIs';
import { Spacer } from '../../../res/spacer';
import { Toolbar } from '../../../components/Toolbar';
import { OptionMenu } from '../../../components/OptionMenu';
import ConnectMember from './connectMember';
import Util from '../../../utils/utils';
import UpgradeTimerModal from './upgradeTimerModal';
import { AppModal } from '../../../components/AppModal';
import OnBackPressed from '../../../components/OnBackPressed';
//#endregion
//#endregion

let connectShrinkAnimation = new Animated.Value(isIphoneX() ? DEVICE.DEVICE_HEIGHT / 1.36 : DEVICE_OS === 'ios' ? DEVICE.DEVICE_HEIGHT / 1.4 : DEVICE.DEVICE_HEIGHT > 700 ? DEVICE.DEVICE_HEIGHT / 1.31 : DEVICE.DEVICE_HEIGHT / 1.43);
let likeConnectAnimation = new Animated.ValueXY({ x: 0, y: DEVICE.DEVICE_HEIGHT });
let fadeCardAnimation = new Animated.Value(1);
let cardActionButtonAnimation = new Animated.Value(1);
let fadeFullProfilePicAnimation = new Animated.Value(0);
export default fullProfile = (props) => {
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    const appReducers = useSelector(state => state.appReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    //#endregion redux
    //#region local state    
    const [cardAction, setCardAction] = useState([images.hideButton, images.connectButton]);
    const [isConnect, setIsConnect] = useState(false);
    const [isConnectContent, setIsConnectContent] = useState(false);
    const [introTextInput, setIntroTextInput] = useState('');
    const [cardTappedIndex, setCardTappedIndex] = useState(0);
    const [isOptionVisible, setIsOptionVisible] = useState(false);
    const [imagePosition, setImagePosition] = useState(0);
    //#endregion local state     
    //#region ref    
    let imageSliderRef = useRef();
    //#endregion ref 

    useEffect(() => {
        DEVICE_OS === 'android' && setImagePosition(homeReducers.currentMemberImage);
    }, [homeReducers.currentMemberImage]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            Util.toValueAnimation(fadeCardAnimation, 1);
            global.isMemberChange = false;
            dispatch(homeAction.onClearCurrentMemberIndex(homeReducers.currentMemberDetails, homeReducers.currentMemberDetails.memberCurrentIndex));
        });
        return unsubscribe;
    }, [props.navigation]);

    const hideConnectModal = (type) => {
        setIsConnectContent(!isConnectContent);
        setIsConnect(!isConnect);
        setIntroTextInput('');
        connectShrinkAnimation = new Animated.Value(isIphoneX() ? DEVICE.DEVICE_HEIGHT / 1.36 : DEVICE_OS === 'ios' ? DEVICE.DEVICE_HEIGHT / 1.4 : DEVICE.DEVICE_HEIGHT > 700 ? DEVICE.DEVICE_HEIGHT / 1.31 : DEVICE.DEVICE_HEIGHT / 1.43);
        likeConnectAnimation = new Animated.ValueXY({ x: 0, y: DEVICE.DEVICE_HEIGHT });
        fadeFullProfilePicAnimation = new Animated.Value(0);
        type !== 'back' &&
            Util.toValueAnimation(fadeCardAnimation, 0, 'fade', () => {
                props.navigation.goBack();
                dispatch(homeAction.onConnectMember(homeReducers.currentMemberDetails, authReducers, () => {
                    Util.toValueAnimation(fadeCardAnimation, 1, 'fade1');
                }));
            });
    }
    return (
        <Animated.View style={[globalStyles.flex, { opacity: fadeCardAnimation }]}>
            <OnBackPressed onBackPressed={() => props.navigation.goBack()} />
            {authReducers.memberList.length !== 0 &&
                <ScrollView style={globalStyles.flex}>
                    <View style={{ height: hp('70%') }}>
                        <ImageSlider
                            ref={(ref) => { imageSliderRef = ref }}
                            autoPlayWithInterval={5000}
                            loopBothSides={false}
                            position={homeReducers.isMemberChanged ? 0 : (DEVICE_OS === 'android' ? imagePosition : homeReducers.currentMemberImage)}
                            images={authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].photos}
                            customSlide={({ index, item, style, width }) => (
                                <View key={index} style={[style, { backgroundColor: colors.WHITE }]}>
                                    <FastImage source={{ uri: BASE_URL + '/' + item }} style={{ width: undefined, height: DEVICE.DEVICE_HEIGHT / 1.3 }} />
                                </View>
                            )}
                            onPositionChanged={(number) => {
                                dispatch(homeAction.onMemberImageChanged(number));
                            }} />
                    </View>
                    <View style={styles.titleContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: DEVICE_OS === 'ios' ? wp('1%') : wp('0.6%') }}>
                            <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('7.5%') }]}>{authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fullname.length > 15
                                ? `${authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fullname.substring(0, 15)}`
                                : `${authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fullname}`}
                                <Text style={[globalStyles.text, { fontSize: wp('7.5%') }]}> {Util.onAgeCalculation(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].birth_date)}</Text></Text>
                            <FastImage source={{ uri: COUNTRY_FLAGS(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fly_country_code.toLowerCase()) }} style={[globalStyles.img, { width: DEVICE_OS === 'ios' ? wp('11%') : wp('11.7%'), height: wp('10%'), top: -wp('0.7%') }, DEVICE_OS === 'ios' && !isIphoneX() && { right: wp('1%') }]} />
                        </View>
                        <Spacer space={DEVICE_OS === 'android' ? wp('1.4%') : wp('2.4%')} />
                        <View style={[globalStyles.rowView, { justifyContent: 'flex-start' }]}>
                            <Image source={images.locationPinGray} style={[globalStyles.img, { width: wp('4%'), height: wp('4%'), marginLeft: -wp('0.5%') }]} />
                            <Spacer row={wp('1%')} />
                            <Text style={[globalStyles.text, { color: colors.GREY2, fontSize: wp('5%') }]}>{homeReducers.currentMemberDetails.memberDetails.currentStay.location_name}</Text>
                        </View>
                        <Text style={[globalStyles.text, styles.bioTxt]}>{authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].bio_content}</Text>
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
                </ScrollView>}
            <View style={[globalStyles.rowView, globalStyles.cardActions, { bottom: isIphoneX() ? wp('6.9%') : DEVICE_OS === 'ios' ? wp('4.5%') : wp('4%') }]}>
                {cardAction.map((data, index) => {
                    return (
                        <TouchableOpacity activeOpacity={1} style={index === 1 && { marginRight: -wp('2%') }} onPress={() => {
                            setCardTappedIndex(index);
                            setTimeout(() => {
                                Util.toValueAnimation(cardActionButtonAnimation, 0.78, 'cardAction', () => {
                                    index === 1 ? (
                                        setIsConnect(!isConnect),
                                        setTimeout(() => {
                                            Util.toValueAnimation(fadeFullProfilePicAnimation, 1, 'fade');
                                            Util.toValueAnimation(connectShrinkAnimation, hp('100%'), 'shrink', () => {
                                                setIsConnectContent(!isConnectContent);
                                            });
                                        }, 400)) :
                                        dispatch(homeAction.onRejectUser(authReducers, authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].id, () => {
                                            Util.toValueAnimation(fadeCardAnimation, 0, 'fade', () => {
                                                props.navigation.goBack();
                                                dispatch(homeAction.onConnectMember(homeReducers.currentMemberDetails, authReducers, props.navigation, () => {
                                                    Util.toValueAnimation(fadeCardAnimation, 1, 'fade1');
                                                }));
                                            });
                                        }));
                                    Util.toValueAnimation(cardActionButtonAnimation, 1);
                                });
                            }, 100);
                        }}>
                            <Animated.Image source={data} style={[globalStyles.img, { height: index === 1 ? wp('20%') : wp('19%'), width: index === 1 ? wp('20%') : wp('19%') }, cardTappedIndex === index && { transform: [{ scale: cardActionButtonAnimation }] }]} />
                        </TouchableOpacity>
                    )
                })}
            </View>
            {/* //#region option menu */}
            <OptionMenu options={[{ title: 'Report' }]} onRequestClose={() => {
                dispatch(appAction.onOptionModalClicked(!appReducers.appOptionMenu, 'option'));
                setIsOptionVisible(false);
            }} />
            {/* //#endregion option menu */}

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
                                    dispatch(appAction.onReportOptionsClicked(data, index, authReducers, homeReducers));
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
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('6%') }]}>Member Reported</Text>
                    <Image source={images.reportCheck} style={[globalStyles.img, { width: wp('17%'), height: wp('17%'), paddingTop: hp('25%') }]} />
                </View>
            </AppModal>
            {/* //#endregion Report and Reported Modal */}

            {/* //#region view when tap on connect button */}
            <ConnectMember
                isConnect={isConnect}
                isConnectContent={isConnectContent}
                connectShrinkAnimation={connectShrinkAnimation}
                likeConnectAnimation={likeConnectAnimation}
                fadeFullProfilePicAnimation={fadeFullProfilePicAnimation}
                hideConnectModal={(type) => hideConnectModal(type)}
                introTextInput={introTextInput}
                setIntroTextInput={(input) => setIntroTextInput(input)}
                onUpgradeModal={() => {
                    setIsConnectContent(!isConnectContent);
                    setIsConnect(!isConnect);
                    setIntroTextInput('');
                    setTimeout(() => {
                        dispatch(appAction.onUpgradeModalClicked(!appReducers.isUpgradeModal));
                    }, 200);
                }} />
            {/* //#endregion view when tap on connect button */}

            {/* //#region App Upgrade modal */}
            <UpgradeTimerModal />
            {/* //#endregion App Upgrade modal */}

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