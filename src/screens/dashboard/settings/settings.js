//#region import 
//#region RN
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Text, TouchableOpacity, ScrollView, View, Switch, Image,
    TouchableHighlight, StyleSheet, Share, Linking, Alert, ImageBackground
} from 'react-native';
//#endregion
import ImageSlider from 'react-native-image-slider';
//#region common files
import globalStyles from '../../../res/globalStyles';
import * as action from '../../../redux/actions/authActions';
import { Toolbar } from '../../../components/Toolbar';
import { removeData } from "../../../utils/asyncStorageHelper";
import * as authAction from '../../../redux/actions/authActions';
import { clearAllData } from '../../../utils/asyncStorageHelper';
import { hp, wp, DEVICE, DEVICE_OS } from "../../../utils/constants";
import { colors } from '../../../res/colors';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../../../res/images';
import { Spacer } from '../../../res/spacer';
import { fonts } from '../../../res/fonts';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import OnBackPressed from '../../../components/OnBackPressed';
//#endregion
//#endregion
import RangeSlider from 'rn-range-slider';
import { AppModal } from "../../../components/AppModal";
import { Strings } from "../../../res/string";
import { BlurView } from '@react-native-community/blur';
import { WebView } from 'react-native-webview';
import { AppButton } from '../../../components/AppButton';
import Toast from 'react-native-simple-toast';

export default settings = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const appReducers = useSelector(state => state.appReducers);

    //#endregion redux
    //#region local state  
    const [isMen, setIsMen] = useState(false);
    const [isWomen, setIsWomen] = useState(false);
    const [unit, setUnit] = useState();
    const [isProfile, setIsProfile] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [isContect, setIsContect] = useState(false);
    const toggleSwitchMen = () => {
        if (!isMen || isWomen) setIsMen(!isMen);
        else { setIsMen(false); setIsWomen(true); }
    }

    const toggleSwitchWomen = () => {
        if (!isWomen || isMen) setIsWomen(!isWomen);
        else { setIsMen(true); setIsWomen(false); }
    }

    const toggleSwitchProfile = () => setIsProfile(previousState => !previousState);
    const toggleSwitchMessage = () => setIsMessage(previousState => !previousState);
    const toggleSwitchContect = () => setIsContect(previousState => !previousState);

    //#region slider callback
    const renderRail = useCallback(() => <View style={styles.rail} />, []);
    const renderRailSelected = useCallback(() => <View style={styles.railSelected} />, []);
    const renderThumb = useCallback(() => <View style={styles.root} ></View>, []);
    //#endregion
    const [low, setLow] = useState(1);
    const [high, setHigh] = useState(10);
    const [close, setClose] = useState();
    const [km, setKm] = useState(false);
    let imageSliderRef = useRef();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const titles =
        [
            {
                title: "Unlimited Connection Likes"
            },
            {
                title: "Make use of 8 Stay Locations"
            }
        ];

    const onShare = async () => {
        try {
            const result = await Share.share({
                title: 'App link',
                message: 'Hi, check out Vove. Find great people across the world or down the street, AppLink :Hi, check out Vove. Find great people across the world or down the street, AppLink :http://www.vove.cc',
                url: 'http://www.vove.cc'
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    // const onSupport = () => {
    //     <WebView source={{ uri: 'https://www.google.com/' }} />
    // };

    //#endregion local state
    useEffect(() => {
        console.log("Settings data:", authReducers.userSettings);
        setLow(authReducers.userSettings.ageFrom)
        setHigh(authReducers.userSettings.ageTo)
        setClose(authReducers.userSettings.search_distance)
        setIsMessage(authReducers.userSettings.message_notification)
        setIsContect(authReducers.userSettings.new_contact_notification)
        setIsProfile(authReducers.userSettings.paused)
        setIsMen((authReducers.userSettings.fine_me == 'Everyone' || authReducers.userSettings.fine_me == 'men') ? true : false)
        setIsWomen((authReducers.userSettings.fine_me == 'Everyone' || authReducers.userSettings.fine_me == 'women') ? true : false)
        setKm(authReducers.userSettings.unit == 1 ? true : false)
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <View style={[globalStyles.flex,]}>
                <OnBackPressed />
                <Toolbar
                    isShadowLine={true}
                    title={'Settings'}
                    onBackPressed={() => dispatch(action.onUpdateUserSetting(props, authReducers.userDetails, close, low, high, isProfile, isMen && isWomen ? "Everyone" : isMen ? 'men' : 'women', isMessage,
                        isContect, km ? 1 : 2))}
                />
                <ScrollView style={styles.staysContainer}>
                    <View style={styles.cardContainer}>

                        <ImageSlider
                            ref={(ref) => { imageSliderRef = ref }}
                            autoPlayWithInterval={3000}
                            loop
                            images={titles}
                            customSlide={({ index, item, style, width }) => (
                                <LinearGradient
                                    start={{ x: 1, y: 1 }}
                                    end={{ x: 0, y: 1 }}
                                    colors={[colors.WHITE3, colors.BLACK3]}
                                >
                                    <View key={index} style={[style, { paddingTop: hp(3), }]}>

                                        {!index ? <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                                            <LinearGradient
                                                start={{ x: 1, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                colors={[colors.GRADIENT3, colors.GRADIENT5]}
                                                style={[styles.linearGradient]}>
                                                <Text style={styles.cardUpperText}>Go Vove Xpress!</Text>
                                                <Spacer space={wp('0.5%')} />
                                                <Image source={images.Wand_small} style={[globalStyles.img, styles.speechImg]} />
                                                {/* <Spacer space={wp('1.5%')} /> */}
                                                <Text style={styles.cardMiddleText}>{item?.title}</Text>
                                                <Spacer space={wp('0.7%')} />
                                                <Text style={styles.cardLowerText}>Like as many new members as you want from all your stay locations.</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                                                <LinearGradient
                                                    start={{ x: 0.5, y: 1 }}
                                                    end={{ x: 0, y: 0 }}
                                                    colors={[colors.BLUE4, colors.BLUE3]}
                                                    style={[styles.linearGradient]}>
                                                    <Text style={styles.cardUpperText}>Go Vove Xpress!</Text>
                                                    <Spacer space={wp('0.5%')} />
                                                    <Image source={images.Combinedicons} style={[globalStyles.img, styles.speechImg]} />
                                                    {/* <Spacer space={wp('1.5%')} /> */}
                                                    <Text style={styles.cardMiddleText}>{item?.title}</Text>
                                                    <Spacer space={wp('0.7%')} />
                                                    <Text style={styles.cardLowerText}>Get an extra 5 Stay slots to add more locations anywhere in the world.</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>}
                                    </View>
                                </LinearGradient>
                            )}
                            customButtons={(position, move) => (
                                <View style={styles.buttons}>
                                </View>
                            )}
                        />
                    </View>

                    <AppModal
                        isAlert={true}
                        isChild={true}
                        isUpgrade={true}
                        modalStyle={{ width: wp('93%'), }}
                        isModalVisible={modalVisible}
                        onRequestClose={() => { }}
                    >
                        <View style={{ alignSelf: 'center', width: '105%', marginTop: hp(-7), }}>
                            <ImageBackground source={images.gradientback} resizeMode='contain' style={{ width: '100%', height: wp(95), }}>
                                <Spacer space={wp('4%')} />
                                <Text style={[globalStyles.text, { fontSize: wp(7.4), textAlign: 'center', color: colors.WHITE, fontFamily: fonts.VM }]}>{'Go Vove Xpress'}</Text>
                                <Spacer space={wp('2.5%')} />
                                <Image source={images.Wand} style={[globalStyles.img, styles.WandImg,]} />
                                <Spacer space={wp('3.5%')} />
                                <Text style={[{ fontSize: wp(5.4), textAlign: 'center', color: colors.WHITE, fontFamily: fonts.VM }]}>Get more out of life!<Text style={{ fontSize: wp('4.7%'), fontFamily: fonts.VR }}>{Strings.STAY_LIMIT1}</Text><Text style={{ color: colors.WHITE, fontSize: wp('4.7%'), fontFamily: fonts.VR, }}>{"\n\nOnly $7 per month"}</Text></Text>
                            </ImageBackground>
                        </View>
                        <Spacer space={wp('3%')} />
                        <View >
                            <AppButton
                                colors={[colors.BLUE3, colors.BLUE3]}
                                txtStyle={{ color: colors.WHITE }}
                                title={'Go Vove Xpress'}
                                onPress={() => alert('Coming soon...')} />
                        </View>
                        {/* <Spacer space={wp('1%')} /> */}
                    </AppModal>

                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.WHITE3, colors.BLACK3]}
                    >
                        <View style={styles.searchView}>
                            <Text style={styles.searchText}>Search Settings</Text>
                        </View>
                    </LinearGradient>
                    <View style={{ paddingHorizontal: wp(4) }}>
                        <Text style={styles.showText}>Show Me</Text>
                        <View style={styles.toggleView}>
                            <Text style={styles.genderText}>Men</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#f72d0d" }}
                                thumbColor={isMen ? "#fff" : "#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchMen}
                                value={isMen}
                            />
                        </View>
                        <Spacer space={wp('1.8%')} />
                        <View style={styles.toggleView}>
                            <Text style={styles.genderText}>Women</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#f72d0d" }}
                                thumbColor={isWomen ? "#fff" : "#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchWomen}
                                value={isWomen}
                            />
                        </View>
                        <View style={styles.divider}></View>
                        <View style={styles.ageView}>
                            <Text style={styles.ageText}>Age Range</Text>
                            <Text style={styles.ageText}>{low} - {high}</Text>
                        </View>
                        <Spacer space={hp('0.5%')} />
                        <RangeSlider
                            style={styles.slider}
                            low={low}
                            high={high}
                            min={18}
                            max={55}
                            step={1}
                            renderThumb={renderThumb}
                            renderRail={renderRail}
                            renderRailSelected={renderRailSelected}
                            onValueChanged={(low, high) => { setLow(low); setHigh(high); }}
                        />
                        <View style={styles.divider}></View>
                        <View style={styles.ageView}>
                            <Text style={styles.ageText}>Search Distance</Text>
                            <Text style={styles.ageText}>{close} {km ? 'km' : 'mi'}</Text>
                        </View>
                        <Spacer space={hp('0.5%')} />
                        <RangeSlider
                            style={styles.slider}
                            low={close}
                            disableRange={true}
                            min={1}
                            max={!km ? 110 : 180}
                            step={1}
                            renderThumb={renderThumb}
                            renderRail={renderRail}
                            renderRailSelected={renderRailSelected}
                            onValueChanged={(close) => { setClose(close) }}
                        />
                        <View style={styles.distanceView}>
                            {!km ? <TouchableOpacity style={styles.miView}
                                onPress={(km) => { setKm(false) }}>
                                <Text style={styles.miText}>Mi</Text></TouchableOpacity>
                                : <TouchableOpacity style={styles.kmView}
                                    onPress={(km) => { setKm(false) }}>
                                    <Text style={styles.kmText}>Mi</Text></TouchableOpacity>}
                            <Spacer row={wp('2%')} />
                            {!km ? <TouchableOpacity style={styles.kmView}
                                onPress={(km) => { setKm(true) }}>
                                <Text style={styles.kmText}>Km</Text></TouchableOpacity>
                                : <TouchableOpacity style={styles.miView}
                                    onPress={(km) => { setKm(true) }}>
                                    <Text style={styles.miText}>Km</Text></TouchableOpacity>}
                        </View>
                        <Spacer space={hp('0.5%')} />
                        <View style={styles.divider}></View>
                        <View style={styles.ageView}>
                            <Text style={styles.ageText}>Pause Profile</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#f72d0d" }}
                                thumbColor={isProfile ? "#fff" : "#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchProfile}
                                value={isProfile}
                                style={{ marginRight: wp(2) }}
                            />
                        </View>
                        <Spacer space={hp('-0.2%')} />
                        <Text style={styles.pauseText}>Your profile won’t show up in searches and you won’t be able to search other members but you can still message people in your chat list.</Text>
                        <Spacer space={hp('1%')} />
                    </View>
                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.WHITE3, colors.BLACK3]}
                    >
                        <View style={styles.searchView}>
                            <Text style={styles.searchText}>App Settings</Text>
                        </View>
                    </LinearGradient>
                    <View style={{ paddingHorizontal: wp(4) }}>

                        <Text style={styles.showText}>Notifications</Text>
                        <View style={styles.toggleView}>
                            <Text style={styles.genderText}>Messages</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#f72d0d" }}
                                thumbColor={isMen ? "#fff" : "#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchMessage}
                                value={isMessage}
                            />
                        </View>
                        <Spacer space={hp('1.2%')} />
                        <View style={styles.toggleView}>
                            <Text style={styles.genderText}>New Contacts</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#f72d0d" }}
                                thumbColor={isContect ? "#fff" : "#fff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitchContect}
                                value={isContect}
                            />
                        </View>
                        <Spacer space={hp('0.5%')} />
                        <View style={styles.divider}></View>
                        <Spacer space={hp('0.5%')} />
                        <TouchableOpacity onPress={() => props.navigation.navigate('updatePhoneNumber')}>
                            <Text style={styles.updateText}>Update my Phone Number</Text>
                        </TouchableOpacity>
                        <Spacer space={hp('1.5%')} />
                    </View>
                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.WHITE3, colors.BLACK3]}
                    >
                        <View style={styles.searchView}>
                            <Text style={styles.searchText}>About</Text>
                        </View>
                    </LinearGradient>
                    <View style={{ paddingHorizontal: wp(4) }}>
                        <TouchableOpacity onPress={onShare}><Text style={styles.helpsText}>Share Vove</Text></TouchableOpacity>
                        <View style={styles.divider}></View>
                        <TouchableOpacity onPress={() => { Linking.openURL('https://google.com') }}><Text style={styles.helpText}>Support</Text></TouchableOpacity>
                        <View style={styles.divider}></View>
                        <TouchableOpacity><Text style={styles.helpText}>Privacy Policy</Text></TouchableOpacity>
                        <View style={styles.divider}></View>
                        <TouchableOpacity><Text style={styles.helpText}>Terms of Use</Text></TouchableOpacity>
                        <Spacer space={hp('1.5%')} />
                    </View>
                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.WHITE3, colors.BLACK3]}
                    >
                        <View style={styles.searchView}>
                        </View>
                    </LinearGradient>
                    <AppModal
                        isAlert={true}
                        isChild={true}
                        modalStyle={{ width: wp('85%'), paddingTop: hp('3%'), height: wp(50) }}
                        mainContainer={{ backgroundColor: colors.BLACK_TRANSPARENT }}
                        isModalVisible={isModalVisible}
                        onRequestClose={() => {
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.4%'), textAlign: 'center' },]}>{Strings.LOGOUT}</Text>
                            <Spacer space={wp('9%')} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: wp('85%') }}>
                                {isModalVisible &&
                                    ['Cancel', 'Log Out'].map((data, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                if (index === 1) {
                                                    clearAllData((success) => {
                                                        props.navigation.replace('loginStart');
                                                    });
                                                    setTimeout(() => {
                                                        Toast.show(response.response.msg ? response.response.msg : 'Something went wrong!');
                                                    }, 500);
                                                    setIsModalVisible(!isModalVisible);
                                                } else {
                                                    setIsModalVisible(!isModalVisible);
                                                }
                                            }}>
                                                <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>{data}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                            </View>
                        </View>
                    </AppModal>
                    <View style={{ paddingHorizontal: wp(4) }}>
                        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                            <Text style={styles.helpsText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                    <Spacer space={hp('1.5%')} />
                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.WHITE3, colors.BLACK3]}
                    >
                        <View style={styles.voveView}>
                            <Text style={styles.voveText}>Vove 3.1.1</Text>
                        </View>
                    </LinearGradient>
                    <View style={{ paddingHorizontal: wp(4) }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('deleteAccount')}>
                            <Text style={styles.helpsText}>Delete Account</Text>
                        </TouchableOpacity>
                    </View>

                    <Spacer space={hp('1.5%')} />
                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 1 }}
                        colors={[colors.WHITE3, colors.BLACK3]}
                    >
                        <View style={styles.bottomView}>
                        </View>
                    </LinearGradient>
                </ScrollView>
            </View>
            {isModalVisible && <BlurView
                style={styles.absolute}
                blurType={DEVICE_OS === 'ios' ? 'light' : 'light'}
                blurAmount={DEVICE_OS === 'ios' ? 4 : 4}
                reducedTransparencyFallbackColor={colors.DARK} />}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: DEVICE.DEVICE_WIDTH,
        height: DEVICE.DEVICE_HEIGHT / 3.1,
        backgroundColor: colors.DARK_HEADER,
        justifyContent: 'center',
        zIndex: 1,
    },
    staysContainer: {
        flex: 1,
        width: DEVICE.DEVICE_WIDTH,
        marginBottom: hp('3%'),
    },
    linearGradient: {
        alignSelf: 'center',
        padding: hp('2%'),
        borderRadius: hp('3%'),
        height: DEVICE.DEVICE_HEIGHT / 3.8,
        width: wp('92%'),
        backgroundColor: colors.WHITE,
        shadowColor: colors.DARK,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.45,
        shadowRadius: 4,
        elevation: 6
    },
    cardUpperText: {
        fontFamily: fonts.VM,
        fontSize: wp(8),
        textAlign: 'center',
        color: colors.WHITE
    },
    cardMiddleText: {
        fontFamily: fonts.VM,
        fontSize: wp(5.4),
        textAlign: 'left',
        color: colors.WHITE,
        paddingLeft: wp(2),
        paddingTop: hp(0.5)
    },
    cardLowerText: {
        fontFamily: fonts.RR,
        fontSize: wp(4.5),
        textAlign: 'left',
        color: colors.WHITE,
        paddingLeft: wp(2),
    },
    speechImg: {
        height: wp('12%'),
        width: wp('100%'),
        alignSelf: 'center',
        // marginRight: wp('8%'),
        backgroundColor: null
    },
    WandImg: {
        height: wp('14%'),
        width: wp('100%'),
        alignSelf: 'center',
        // marginRight: wp('8%'),
        backgroundColor: null,
    },
    searchView: {
        // backgroundColor: colors.DARK_HEADER,
        height: DEVICE.DEVICE_HEIGHT * 0.08,
        justifyContent: 'flex-end'
    },
    searchText: {
        fontFamily: fonts.VM,
        fontSize: wp(5.4),
        color: colors.WHITE,
        paddingLeft: wp(4),
        paddingBottom: wp(3),
    },
    showText: {
        fontFamily: fonts.VM,
        fontSize: wp(5.4),
        color: colors.RED,
        // paddingLeft: wp(4),
        paddingVertical: wp(5),
    },
    toggleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(3)
    },
    genderText: {
        fontFamily: fonts.VR,
        fontSize: wp(4.8),
        color: colors.DARK,
    },
    divider: {
        height: hp(0.1),
        backgroundColor: colors.DIVIDER,
        width: wp(92),
        alignSelf: 'center',
        marginVertical: hp(2)
    },
    ageView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ageText: {
        fontFamily: fonts.VM,
        fontSize: wp(5.4),
        color: colors.DARK,
        // paddingHorizontal: wp(3),
        paddingVertical: wp(1)
    },
    slider: {
        paddingHorizontal: wp('6%'),
        paddingVertical: wp('3%'),
    },
    root: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('5%') / 2,
        borderWidth: 1,
        borderColor: colors.GREY3,
        backgroundColor: colors.WHITE
    },
    rail: {
        flex: 1,
        height: wp(1.5),
        borderRadius: wp(1),
        backgroundColor: colors.RANGE_SLIDER_BORDER
    },
    railSelected: {
        flex: 1,
        height: wp(1.5),
        backgroundColor: colors.RED,
        borderRadius: wp(2),
    },
    distanceView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // marginRight: wp(2)
    },
    kmView: {
        width: DEVICE.DEVICE_WIDTH / 5.5,
        borderWidth: wp(0.3),
        borderColor: colors.BLACK,
        alignItems: 'center',
        borderRadius: wp(5.4),
        padding: wp(3)
    },
    kmText: {
        fontFamily: fonts.VM,
        // fontWeight: '700'
    },
    miView: {
        width: DEVICE.DEVICE_WIDTH / 5.5,
        alignItems: 'center',
        borderRadius: wp(5.4),
        padding: wp(3),
        backgroundColor: colors.RED
    },
    miText: {
        color: colors.WHITE,
        fontFamily: fonts.VM,
    },
    pauseText: {
        // paddingHorizontal: wp(6),
        color: colors.GREY1,
        fontFamily: fonts.RR,
        fontSize: wp(3.5),
        marginVertical: hp(1)
    },
    updateText: {
        fontFamily: fonts.VR,
        fontSize: wp(4.8),
        color: colors.DARK,
        marginLeft: wp(3)
    },
    helpsText: {
        fontFamily: fonts.VR,
        fontSize: wp(4.8),
        color: colors.DARK,
        marginLeft: wp(3),
        marginTop: hp(3),
        marginBottom: hp(0.5)
    },
    helpText: {
        fontFamily: fonts.VR,
        fontSize: wp(4.8),
        color: colors.DARK,
        marginLeft: wp(3),
        marginVertical: hp(0.6)
    },
    voveView: {
        // backgroundColor: colors.DARK_HEADER,
        height: DEVICE.DEVICE_HEIGHT * 0.12,
        justifyContent: 'center'
    },
    voveText: {
        fontFamily: fonts.RR,
        fontSize: wp(4.8),
        color: colors.WHITE,
        paddingLeft: wp(7),
    },
    bottomView: {
        // backgroundColor: colors.DARK_HEADER,
        height: DEVICE.DEVICE_HEIGHT * 0.3,
    },
    modal: {
        width: wp(85),
        paddingTop: hp('4%'),
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});