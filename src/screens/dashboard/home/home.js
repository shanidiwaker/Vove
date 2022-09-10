//#region import 
//#region RN
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, Image, StyleSheet, BackHandler, Animated, ScrollView, TouchableOpacity } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageSlider from 'react-native-image-slider';
import NetInfo from "@react-native-community/netinfo";
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
import * as appAction from '../../../redux/actions/appActions';
import * as homeAction from '../../../redux/actions/homeActions';
import * as authAction from '../../../redux/actions/authActions';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import { hp, wp, DEVICE, DEVICE_OS } from "../../../utils/constants";
import { images } from '../../../res/images';
import { colors } from '../../../res/colors';
import { fonts } from '../../../res/fonts';
import { Spacer } from '../../../res/spacer';
import { AppButton } from '../../../components/AppButton';
import OnBackPressed from '../../../components/OnBackPressed';
import { BASE_URL, COUNTRY_FLAGS } from '../../../apiHelper/APIs';
import { TouchableOpacity as RNGHTouchableOpacity } from 'react-native-gesture-handler';
import Util from '../../../utils/utils';
import ConnectMember from './connectMember';
import UpgradeTimerModal from './upgradeTimerModal';
import { AppModal } from '../../../components/AppModal';
import { Strings } from '../../../res/string';

//#endregion
//#endregion

let bioAnimation = new Animated.Value(0);
// let connectShrinkAnimation = new Animated.Value(hp('30%'));
let connectShrinkAnimation = new Animated.Value(isIphoneX() ? DEVICE.DEVICE_HEIGHT / 1.36 : DEVICE_OS === 'ios' ? DEVICE.DEVICE_HEIGHT / 1.4 : DEVICE.DEVICE_HEIGHT > 700 ? DEVICE.DEVICE_HEIGHT / 1.31 : DEVICE.DEVICE_HEIGHT / 1.43);
let likeConnectAnimation = new Animated.ValueXY({ x: 0, y: DEVICE.DEVICE_HEIGHT });
let editStaysAnimation = new Animated.ValueXY({ x: 0, y: -DEVICE.DEVICE_HEIGHT });
let fadeCardAnimation = new Animated.Value(1);
let fadeFullProfilePicAnimation = new Animated.Value(0);
let cardActionButtonAnimation = new Animated.Value(1);
let bioOpacityAnimation = new Animated.Value(1);
let messageOpacityAnimation = new Animated.Value(1);
export default home = (Props) => {
    const props = Props.props;
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    const appReducers = useSelector(state => state.appReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    //#endregion redux
    //#region local state   
    const [cardAction, setCardAction] = useState([images.hideButton, images.connectButton]);
    const [sliderIndex, setSliderIndex] = useState(0);
    const [isConnect, setIsConnect] = useState(false);
    const [isConnectContent, setIsConnectContent] = useState(false);
    const [introTextInput, setIntroTextInput] = useState('');
    const [isProfilePaused, setIsProfilePaused] = useState(false);
    const [isNoConnection, setIsNoConnection] = useState(false);
    const [isEditStays, setIsEditStays] = useState(false);
    const [isEditStaysContent, setIsEditStaysContent] = useState(false);
    const [currentStay, setCurrentStay] = useState({ location_name: Strings.NO_LOCATION });
    const [isEditStaysModal, setIsEditStaysModal] = useState(false);
    const [isDeleteStaysModal, setIsDeleteStaysModal] = useState(false);
    const [is8StaysModal, setIs8StaysModal] = useState(false);
    const [bioTxtHeight, setBioTxtHeight] = useState(0);
    const [usedLines, setUsedLines] = useState(0);
    const [usedIntroLines, setUsedIntroLines] = useState(0);
    const [cardTappedIndex, setCardTappedIndex] = useState(0);
    //#endregion local state  

    //#region useEffect
    useEffect(() => {
        NetInfo.addEventListener((state) => {
            if (state.isConnected != true) {
                setIsNoConnection(true);
            } else {
                setIsNoConnection(false);
            }
        });
        Util.slideLeftAnim(editStaysAnimation, -DEVICE.DEVICE_HEIGHT, 'y');
    }, []);

    useEffect(() => {
        if (homeReducers.userStays.length !== 0) {
            homeReducers.userStays.filter((item) => {
                return item.isDefault === 1 && setCurrentStay(item);
            })
        }
    }, [homeReducers.userStays, authReducers.memberList])

    useEffect(() => {
        if (homeReducers.currentMemberImage === 0) {
            usedLines === 1 ?
                Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('3%') : -wp('4%')) :
                usedLines === 2 ?
                    Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('3%') : -wp('4%')) :
                    usedLines >= 3 ?
                        Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('3%') : -wp('4%')) :
                        Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('6%') : -wp('12%'));
        }
    }, [usedLines, homeReducers.isMemberChanged]);

    useEffect(() => {
        DEVICE_OS === 'android' && setSliderIndex(homeReducers.currentMemberImage);
        if (DEVICE_OS === 'android') {
            if (homeReducers.currentMemberImage === 0) {
                Util.toValueAnimation(bioAnimation, usedLines === 1 ? (DEVICE.DEVICE_HEIGHT > 700 ? -wp('3%') : -wp('4%')) :
                    usedLines === 2 ? (DEVICE.DEVICE_HEIGHT > 700 ? -wp('3%') : -wp('4%')) :
                        usedLines >= 3 ? (DEVICE.DEVICE_HEIGHT > 700 ? -wp('3%') : -wp('4%')) : (DEVICE.DEVICE_HEIGHT > 700 ? -wp('10%') : -wp('11%')));
                Util.toValueAnimation(bioOpacityAnimation, 1, 'fade');
                Util.toValueAnimation(messageOpacityAnimation, 1, 'fade');
            } else {
                homeReducers.currentMemberImage >= 1 && (Util.toValueAnimation(bioAnimation, usedLines === 1 ? -wp('10%') : usedLines === 2 ? -wp('16%') : usedLines >= 3 ? -wp('21.5%') : (DEVICE.DEVICE_HEIGHT > 700 ? -wp('10%') : -wp('11%'))), Util.toValueAnimation(bioOpacityAnimation, 0, 'fade'), Util.toValueAnimation(messageOpacityAnimation, 0, 'fade'));
            }
        }
    }, [homeReducers.currentMemberImage, usedLines]);
    //#endregion useEffect

    //#region functions
    const hideConnectModal = (type) => {
        setIsConnectContent(!isConnectContent);
        setIsConnect(!isConnect);
        setIntroTextInput('');
        // connectShrinkAnimation = new Animated.Value(hp('30%'));
        connectShrinkAnimation = new Animated.Value(isIphoneX() ? DEVICE.DEVICE_HEIGHT / 1.36 : DEVICE_OS === 'ios' ? DEVICE.DEVICE_HEIGHT / 1.4 : DEVICE.DEVICE_HEIGHT > 700 ? DEVICE.DEVICE_HEIGHT / 1.31 : DEVICE.DEVICE_HEIGHT / 1.43);
        likeConnectAnimation = new Animated.ValueXY({ x: 0, y: DEVICE.DEVICE_HEIGHT });
        fadeFullProfilePicAnimation = new Animated.Value(0);
        type !== 'back' &&
            Util.toValueAnimation(fadeCardAnimation, 0, 'fade', () => {
                dispatch(homeAction.onConnectMember(homeReducers.currentMemberDetails, authReducers, () => {
                    Util.toValueAnimation(fadeCardAnimation, 1, 'fade1');
                }));
            });
    }
    const hideEditStaysView = () => {
        setIsEditStays(!isEditStays);
        isEditStaysContent && setIsEditStaysContent(!isEditStaysContent);
        Util.slideLeftAnim(editStaysAnimation, isEditStays ? -DEVICE.DEVICE_HEIGHT : 0, 'y', () => {
            setIsEditStaysContent(!isEditStaysContent);
        });
    }
    const onTextLayout = useCallback(e => {
        let count = 0;
        e.nativeEvent.lines.length !== 0 && e.nativeEvent.lines.forEach((element, index) => {
            if (e.nativeEvent.lines[e.nativeEvent.lines.length - 1].text !== '' || e.nativeEvent.lines[0].text !== '') {
                count = count + 1;
            }
        });
        setUsedLines(count);
    }, []);
    const onIntroTextLayout = useCallback(e => {
        let count = 0;
        e.nativeEvent.lines.length !== 0 && e.nativeEvent.lines.forEach((element, index) => {
            if (e.nativeEvent.lines[e.nativeEvent.lines.length - 1].text !== '' || e.nativeEvent.lines[0].text !== '') {
                count = count + 1;
            }
        });
        setUsedIntroLines(count);
    }, []);
    //#endregion functions
    return (
        <View style={globalStyles.flex}>
            {/* <OnBackPressed onBackPressed={() => BackHandler.exitApp()} /> */}
            {/* //#region user stay header */}
            <View style={[globalStyles.shadow, styles.locationContainer, homeReducers.isDeleteModalVisible && { shadowColor: colors.TRANS, elevation: 0 }]}>
                <TouchableOpacity onPress={() => hideEditStaysView()}>
                    <View style={styles.locationSubContainer}>
                        <Text style={[globalStyles.text, { fontSize: wp('5.3%'), color: !currentStay.location_name ? colors.TRANS : colors.RED }]} numberOfLines={1}>{currentStay.location_name ? currentStay.location_name : 'd'}</Text>
                        <Image source={images.placesDropdown} style={[globalStyles.img, { height: wp('3.5%'), width: wp('3.5%'), marginRight: wp('1%') }, isEditStays && { transform: [{ rotate: '180deg' }] }]} />
                    </View>
                    <AppButton
                        colors={[colors.GRADIENT1, colors.GRADIENT2]}
                        linearGradient={{ width: DEVICE.DEVICE_WIDTH, padding: 0, height: wp('1.8%'), borderRadius: 0 }} />
                </TouchableOpacity>
            </View>
            {/* //#endregion user stay header */}
            {/* //#region member cards */}
            <View style={[globalStyles.subContainer, styles.mainContainer, (isProfilePaused || (authReducers.memberList.length === 0 || Object.keys(authReducers.memberList).length === 0) || homeReducers.userStays.length === 0) && { backgroundColor: colors.WHITE }]}>
                <Spacer space={wp('2%')} />
                {isProfilePaused ?
                    <>
                        <Spacer space={wp('6%')} />
                        <Text style={[globalStyles.text, { textAlign: 'center', color: colors.GREY2, fontSize: wp('6.5%') }]}>{Strings.PROFILE_PAUSE}</Text>
                        <Spacer space={wp('10%')} />
                        <AppButton
                            colors={[colors.GRADIENT1, colors.GRADIENT2]}
                            txtStyle={{ color: colors.WHITE }}
                            title={'Unpause'}
                            onPress={() => setIsProfilePaused(!isProfilePaused)} />
                    </> :
                    homeReducers.userStays.length === 0 ?
                        <>
                            <Spacer space={wp('9%')} />
                            <Text style={[globalStyles.text, { textAlign: 'center', color: colors.GREY2, fontSize: wp('6.5%') }]}>{Strings.ENTER_STAY}</Text>
                            <Spacer space={wp('12%')} />
                            <AppButton
                                colors={[colors.GRADIENT1, colors.GRADIENT2]}
                                txtStyle={{ color: colors.WHITE }}
                                title={'Add Stays'}
                                onPress={() => dispatch(homeAction.onAddStays(!homeReducers.isAddStays, props.navigation))} />
                        </> :
                        (authReducers.memberList.length === 0 || Object.keys(authReducers.memberList).length === 0) ?
                            <Animated.View style={{ opacity: fadeCardAnimation }}>
                                <Spacer space={wp('3%')} />
                                <Text style={[globalStyles.text, { textAlign: 'center', color: colors.GREY2, fontSize: wp('6.5%') }]}>{Strings.UPDATE_SEARCH}</Text>
                                <Spacer space={wp('5%')} />
                                <AppButton
                                    colors={[colors.GRADIENT1, colors.GRADIENT2]}
                                    txtStyle={{ color: colors.WHITE }}
                                    title={'Update Search!'}
                                    onPress={() => props.navigation.navigate('settings')} />
                            </Animated.View> :
                            isNoConnection ?
                                <>
                                    <Spacer space={wp('6%')} />
                                    <Text style={[globalStyles.text, { textAlign: 'center', color: colors.GREY2, fontSize: wp('6.5%') }]}>{Strings.NETWORK_CONNECTION}</Text>
                                </> :
                                <Animated.View style={[globalStyles.shadow, styles.memberCardView, { opacity: fadeCardAnimation }]}>
                                    {authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].photos !== undefined &&
                                        <ImageSlider
                                            ref={(ref) => { imageSliderRef = ref }}
                                            isCustomize={true}
                                            loopBothSides={false}
                                            position={homeReducers.isMemberChanged ? 0 : homeReducers.currentMemberImage}
                                            images={authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].photos}
                                            customSlide={({ index, item, style, width }) => (
                                                <View key={index} style={[style, { backgroundColor: colors.TRANS, width: wp('92%') }]}>
                                                    <FastImage source={{ uri: BASE_URL + '/' + item }} style={{ width: undefined, height: isIphoneX() ? DEVICE.DEVICE_HEIGHT / 1.36 : DEVICE_OS === 'ios' ? DEVICE.DEVICE_HEIGHT / 1.4 : DEVICE.DEVICE_HEIGHT > 700 ? DEVICE.DEVICE_HEIGHT / 1.31 : DEVICE.DEVICE_HEIGHT / 1.43 }} />
                                                </View>
                                            )}
                                            onPositionChanged={(number) => {
                                                setSliderIndex(number);
                                                dispatch(homeAction.onMemberImageChanged(number));
                                                //#region Bio Animation on image swipe
                                                DEVICE_OS === 'ios' ?
                                                    number >= 1 && Util.toValueAnimation(bioAnimation, usedLines === 1 ? -wp('8.5%') : usedLines === 2 ? -wp('15%') : usedLines >= 3 ? -wp('20.5%') : -wp('6%')) :
                                                    number >= 1 && Util.toValueAnimation(bioAnimation, usedLines === 1 ? -wp('10%') : usedLines === 2 ? -wp('16%') : usedLines >= 3 ? -wp('21.5%') : (DEVICE.DEVICE_HEIGHT > 700 ? -wp('10%') : -wp('11%')));

                                                if (usedLines === 1) {
                                                    number === 0 && Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('3%') : (DEVICE.DEVICE_HEIGHT > 700 ? -wp('3%') : -wp('4%')));
                                                } else if (usedLines === 2) {
                                                    number === 0 && Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('3%') : (DEVICE.DEVICE_HEIGHT > 700 ? -wp('3%') : -wp('4%')));
                                                } else if (usedLines >= 3) {
                                                    number === 0 && Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('3%') : DEVICE.DEVICE_HEIGHT > 700 ? -wp('3%') : -wp('4%'));
                                                } else {
                                                    number === 0 && Util.toValueAnimation(bioAnimation, DEVICE_OS === 'ios' ? -wp('6%') : DEVICE.DEVICE_HEIGHT > 700 ? -wp('10%') : -wp('11%'));
                                                }
                                                //#endregion Bio Animation on image swipe
                                                //#region Bio change opacity
                                                number >= 1 && (Util.toValueAnimation(bioOpacityAnimation, 0, 'fade'), Util.toValueAnimation(messageOpacityAnimation, 0, 'fade'));
                                                number === 0 && (Util.toValueAnimation(bioOpacityAnimation, 1, 'fade'), Util.toValueAnimation(messageOpacityAnimation, 1, 'fade'));
                                                //#endregion Bio change opacity
                                            }}
                                            onInfoPress={() => dispatch(homeAction.onCurrentMember({ currentStay }, homeReducers.currentMemberDetails, props.navigation))}>
                                            {/* //#region childern view of slider */}
                                            <Animated.View style={[styles.bioSlider, { bottom: bioAnimation }]}>
                                                {/* //#region bubble view */}
                                                {authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message !== null &&
                                                    authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message !== '' &&
                                                    /\S/.test(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message) &&
                                                    // sliderIndex === 0 &&
                                                    <Animated.View style={{ position: 'absolute', top: usedIntroLines >= 4 ? -wp('38%') : usedIntroLines === 3 ? -wp('31%') : usedIntroLines === 2 ? -wp('24%') : -wp('17%'), opacity: messageOpacityAnimation }}>
                                                        <View style={styles.introBubble}>
                                                            <Text style={[globalStyles.text, { fontSize: wp('5.2%'), color: colors.BLACK, lineHeight: wp('6.7%'), fontFamily: fonts.VI }]} numberOfLines={4} onTextLayout={onIntroTextLayout}>{authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].message}</Text>
                                                        </View>
                                                        <Image source={images.speech} style={[globalStyles.img, styles.speechImg]} />
                                                    </Animated.View>}
                                                {/* <Spacer space={wp('1%')} /> */}
                                                {/* //#endregion bubble view */}
                                                <View style={{ width: wp('92%'), paddingBottom: DEVICE_OS === 'android' ? DEVICE.DEVICE_HEIGHT < 700 ? wp('11%') : wp('10%') : wp('10%'), backgroundColor: colors.ORANGE_TRANSPARENT, paddingLeft: wp('3%'), paddingRight: wp('3%') }}>
                                                    <Spacer space={wp('0.5%')} />
                                                    <View style={globalStyles.rowView}>
                                                        <Text numberOfLines={1} style={[globalStyles.text, styles.shadowTxt]}>{authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fullname.length > 13
                                                            ? `${authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fullname.substring(0, 13)}`
                                                            : `${authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fullname}`}
                                                            <Text style={[globalStyles.text, { fontSize: wp('7.4%'), color: colors.WHITE }]}> {Util.onAgeCalculation(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].birth_date)}</Text></Text>
                                                        <FastImage source={{ uri: COUNTRY_FLAGS(authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].fly_country_code.toLowerCase()) }} style={[globalStyles.img, { width: DEVICE_OS === 'ios' ? wp('11%') : wp('11.7%'), height: wp('10%'), top: -wp('0.7%'), right: wp('1%') }]} />
                                                    </View>
                                                    <Spacer space={authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].bio_content === null ? wp('0.3%') : wp('0.7%')} />
                                                    <Animated.Text style={[globalStyles.text, styles.bioTxt, { opacity: bioOpacityAnimation }]} numberOfLines={3} onTextLayout={onTextLayout}>{authReducers.memberList[homeReducers.currentMemberDetails.memberCurrentIndex].bio_content}</Animated.Text>
                                                </View>
                                            </Animated.View>
                                            {/* //#endregion childern view of slider */}
                                        </ImageSlider>}
                                    <View style={[globalStyles.rowView, globalStyles.cardActions, { bottom: -wp('13%') }]}>
                                        {/* <View style={[styles.rowView, { width: wp('70%'), position: 'absolute', bottom: 0, alignSelf: 'center' }]}> */}
                                        {cardAction.map((data, index) => {
                                            return (
                                                <RNGHTouchableOpacity activeOpacity={1} style={index === 1 && { marginRight: -wp('2%') }} onPress={() => {
                                                    setCardTappedIndex(index);
                                                    setTimeout(() => {
                                                        Util.toValueAnimation(cardActionButtonAnimation, index === 0 ? 0.78 : 0.86, 'cardAction', () => {
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
                                                                        dispatch(homeAction.onConnectMember(homeReducers.currentMemberDetails, authReducers, () => {
                                                                            Util.toValueAnimation(fadeCardAnimation, 1, 'fade1');
                                                                        }));
                                                                    });
                                                                }));
                                                            Util.toValueAnimation(cardActionButtonAnimation, 1);
                                                        });
                                                    }, 100);
                                                }}>
                                                    <Animated.Image source={data} style={[globalStyles.img, { height: index === 1 ? wp('20%') : wp('19%'), width: index === 1 ? wp('20%') : wp('19%') }, cardTappedIndex === index && { transform: [{ scale: cardActionButtonAnimation }] }]} />
                                                </RNGHTouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </Animated.View>
                }
            </View>
            {/* //#endregion member cards */}
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
                }}
                navigation={props.navigation} />
            {/* //#endregion view when tap on connect button */}
            {/* //#region App Upgrade modal */}
            <UpgradeTimerModal props={props} />
            {/* //#endregion App Upgrade modal */}

            {/* //#region Animated Edit stays view */}
            <Animated.View style={[editStaysAnimation.getLayout(), styles.editStaysMainContainer, DEVICE_OS === 'android' && DEVICE.DEVICE_HEIGHT > 700 && { height: DEVICE.DEVICE_HEIGHT / 1.04 }]}>
                {/* {isEditStaysContent && */}
                {/* <> */}
                <ScrollView style={styles.staysContainer}>
                    <View style={{ width: wp('87%'), alignSelf: 'center' }}>
                        {homeReducers.userStays.length === 0 ?
                            <>
                                <Spacer space={wp('9%')} />
                                <Text style={[globalStyles.text, { textAlign: 'center', color: colors.GREY2, fontSize: wp('6.5%') }]}>{Strings.ADD_LOCATION}</Text>
                            </> :
                            homeReducers.userStays.map((data, index) => {
                                let i = ''
                                currentStay.location_name === homeReducers.userStays[index].location_name && (i = index);
                                return (
                                    <>
                                        <Spacer space={index !== 0 ? wp('2.9%') : wp('3%')} />
                                        <View style={[styles.staysItems, { justifyContent: 'space-between' }]}>
                                            <TouchableOpacity style={[styles.staysItems, { width: wp('78%') }]} onPress={() => {
                                                dispatch(homeAction.onMemberChanged());
                                                setSliderIndex(0);
                                                setTimeout(() => {
                                                    hideEditStaysView(),
                                                        setCurrentStay(data),
                                                        dispatch(homeAction.onSetSelectStays(data, authReducers)),
                                                        setTimeout(() => {
                                                            dispatch(authAction.getUserStayss(authReducers.userDetails));
                                                            dispatch(homeAction.onClearCurrentMemberIndex(homeReducers.currentMemberDetails, 0));
                                                            dispatch(authAction.getMember(authReducers.userDetails, authReducers.userSettings));
                                                            Util.toValueAnimation(fadeCardAnimation, 0.5, 'fade', () => {
                                                                Util.toValueAnimation(fadeCardAnimation, 1, 'fade');
                                                            });
                                                        }, 200);
                                                }, 500);
                                            }}>
                                                <Image source={i === index ? images.staysPinSelected : images.staysPin} style={[globalStyles.img, { height: wp('6.5%'), width: wp('6.5%') }]} />
                                                <Spacer row={wp('1.5%')} />
                                                <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('4.7%'), color: i === index ? colors.RED : colors.GREY2, width: wp('70%') }]}>{data.location_name}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.pencilContainer} onPress={() => {
                                                dispatch(homeAction.onSelectStays({ data, index }));
                                                setIsEditStaysModal(!isEditStaysModal);
                                                dispatch(homeAction.onDeleteModalVisibility(true));
                                            }}>
                                                <Image source={i === index ? images.pencilRed : images.pencilGrey} style={[globalStyles.img, { height: wp('5.2%'), width: wp('5.2%') }]} />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )
                            })}
                    </View>
                </ScrollView>
                {/* <View style={{ flex: isIphoneX() ? 0.15 : 0.21 }}> */}
                <View style={{ flex: 0.22 }}>
                    <TouchableOpacity onPress={() => {
                        homeReducers.userStays.length < 3 ? dispatch(homeAction.onAddStays(!homeReducers.isAddStays, props.navigation)) : dispatch(appAction.onStaysUpgradeModalClicked(!appReducers.isStaysUpgradeModal));
                    }}>
                        <Image source={images.addStay} style={[globalStyles.img, { height: wp('12%'), width: wp('12%') }]} />
                    </TouchableOpacity>
                </View>
                {/* </>} */}
            </Animated.View>
            <AppModal
                isAlert={true}
                isChild={true}
                modalStyle={{ width: wp('85%'), paddingTop: !isDeleteStaysModal ? hp('5%') : hp('3%') }}
                mainContainer={{ backgroundColor: colors.TRANS }}
                isModalVisible={isEditStaysModal || isDeleteStaysModal}
                onRequestClose={() => {
                    setIsEditStaysModal(!isEditStaysModal);
                    isDeleteStaysModal && setIsDeleteStaysModal(false);
                    setIsEditStaysModal(false);
                    dispatch(homeAction.onSelectStays(''));
                    dispatch(homeAction.onDeleteModalVisibility(false));
                }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.4%'), textAlign: 'center' }, isDeleteStaysModal && { lineHeight: wp('10%') }]}>{!isDeleteStaysModal ? (!homeReducers.selectedStays ? '' : homeReducers.selectedStays.data.location_name) : Strings.NO_LONGER + homeReducers.selectedStays.data.location_name}</Text>
                    <Spacer space={isDeleteStaysModal ? wp('5%') : wp('9%')} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: wp('85%') }}>
                        {!isDeleteStaysModal ?
                            ['Edit Stay', 'Delete Stay'].map((data, index) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        if (index === 1) {
                                            setIsEditStaysModal(!isEditStaysModal);
                                            setTimeout(() => {
                                                setIsDeleteStaysModal(!isDeleteStaysModal);
                                            }, 500);
                                        } else {
                                            setIsEditStaysModal(!isEditStaysModal);
                                            dispatch(homeAction.onDeleteModalVisibility(false));
                                            dispatch(homeAction.onAddStays(!homeReducers.isAddStays, props.navigation));
                                        }
                                    }}>
                                        <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>{data}</Text>
                                    </TouchableOpacity>
                                )
                            }) : ['Cancel', 'Delete Stay'].map((data, index) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        setIsDeleteStaysModal(!isDeleteStaysModal);
                                        index === 1 ? (
                                            dispatch(homeAction.onDeleteStays(homeReducers.userStays, homeReducers.selectedStays, authReducers, (userStays) => {
                                                currentStay.location_name === homeReducers.selectedStays.data.location_name && setCurrentStay({ location_name: userStays[homeReducers.selectedStays.index] === undefined ? (userStays.length === 0 ? Strings.NO_LOCATION : userStays[0].location_name) : userStays[homeReducers.selectedStays.index].location_name });
                                                // userStays.length === 1 && setCurrentStay({ location_name: Strings.NO_LOCATION });
                                                dispatch(homeAction.onSetSelectStays(homeReducers.selectedStays, authReducers));
                                                dispatch(homeAction.onClearCurrentMemberIndex(homeReducers.currentMemberDetails, 0));
                                                dispatch(authAction.getMember(authReducers.userDetails, authReducers.userSettings));
                                                dispatch(homeAction.onDeleteModalVisibility(false));
                                            }))
                                        ) : index === 0 && (dispatch(homeAction.onSelectStays('')), dispatch(homeAction.onDeleteModalVisibility(false)));
                                    }}>
                                        <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>{data}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                    </View>
                </View>
            </AppModal>
            {/* //#region Stays Upgrade modal */}
            <AppModal
                isAlert={true}
                isChild={true}
                isUpgrade={true}
                modalStyle={{ width: wp('93%'), paddingTop: hp('3%') }}
                isModalVisible={appReducers.isStaysUpgradeModal}
                onRequestClose={() => dispatch(appAction.onStaysUpgradeModalClicked(!appReducers.isStaysUpgradeModal))}
            // onTermsPress={(value) => { dispatch(appAction.onStaysUpgradeModalClicked(!appReducers.isStaysUpgradeModal)), props.navigation.navigate("termsPolicy", { Title: value, isUpgradeModal: true }) }}
            >
                <View style={{ alignItems: 'center' }}>
                    <Spacer space={wp('1%')} />
                    <Text style={[globalStyles.text, { fontSize: wp('7.2%'), textAlign: 'center', color: colors.GREEN, fontFamily: fonts.VM }]}>{'Get Vove Xpress'}</Text>
                    <Spacer space={wp('3.5%')} />
                    <Text style={[globalStyles.text, { fontSize: wp('4.9%'), textAlign: 'center' }]}>{Strings.STAY_LIMIT}<Text style={{ fontSize: wp('4.7%') }}>{Strings.STAY_LIMIT1}</Text><Text style={{ color: colors.GREEN }}>{"\n\n\nOnly $5 per month"}</Text></Text>
                    <Spacer space={wp('5%')} />
                    <AppButton
                        colors={[colors.GRADIENT3, colors.GRADIENT4]}
                        txtStyle={{ color: colors.WHITE }}
                        title={'Get Vove Xpress'}
                        onPress={() => alert('Coming soon...')} />
                    <Spacer space={wp('2%')} />
                </View>
            </AppModal>
            {/* //#endregion Stays Upgrade modal */}
            {/* //#region 8 Stays */}
            <AppModal
                isAlert={true}
                isChild={true}
                modalStyle={{ width: wp('93%'), paddingTop: hp('3%') }}
                isModalVisible={is8StaysModal}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.6%'), textAlign: 'center' }]}>{Strings.FILLED_UP_STAYS}</Text>
                    <Spacer space={wp('4%')} />
                    <Text style={[globalStyles.text, { color: colors.GREY1, fontSize: wp('5%'), textAlign: 'center' }]}>{Strings.DELETE_STAYS}</Text>
                    <Spacer space={wp('10%')} />
                    <AppButton
                        colors={[colors.GRADIENT1, colors.GRADIENT2]}
                        txtStyle={{ color: colors.WHITE }}
                        title={'Edit My Stays'}
                        onPress={() => setIs8StaysModal(!is8StaysModal)} />
                </View>
            </AppModal>
            {/* //#endregion 8 Stays */}
            {/* //#endregion Animated Edit stays view */}
        </View >
    );
};
const styles = StyleSheet.create({
    locationContainer: {
        width: DEVICE.DEVICE_WIDTH,
        // paddingTop: hp('1%'),
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
        height: isIphoneX() ? hp('73%') : DEVICE_OS === 'ios' ? hp('71%') : DEVICE.DEVICE_HEIGHT > 700 ? hp('76%') : hp('70%'),
        width: wp('92%'),
        borderRadius: wp('3%'),
        shadowColor: colors.DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
        elevation: 10,
        // overflow: DEVICE_OS === 'android' ? 'hidden' : 'visible'
    },
    shadowTxt: {
        backgroundColor: colors.TRANS,
        fontFamily: fonts.VM,
        fontSize: wp('7.9%'),
        color: colors.WHITE,
        textShadowColor: colors.BLACK_TRANSPARENT,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    bioTxt: {
        fontSize: wp('5%'),
        color: colors.WHITE,
        lineHeight: wp('6%')
    },
    bioSlider: {
        position: 'absolute',
        bottom: 0,
        // backgroundColor: 'rgba(168, 67, 18,0.7)',
        width: wp('92%'),
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
    },
    editStaysMainContainer: {
        position: 'absolute',
        backgroundColor: colors.WHITE,
        height: DEVICE.DEVICE_HEIGHT / 1.1,
        width: DEVICE.DEVICE_WIDTH,
        alignItems: 'center',
    },
    staysContainer: {
        flex: 1,
        width: DEVICE.DEVICE_WIDTH,
        marginTop: hp('7%'),
        marginBottom: hp('3%')
    },
    staysItems: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    pencilContainer: {
        padding: wp('1%'),
        paddingLeft: wp('3%'),
        paddingRight: wp('3%'),
        marginRight: -wp('3.5%')
    }
})