//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import { DEVICE, DEVICE_OS, hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
import { Spacer } from '../res/spacer';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import { Strings } from '../res/string';
import { BlurView } from '@react-native-community/blur';
import ReactNativeModal from "react-native-modal";
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import TermsPolicy from '../screens/auth/termsPolicy';
import { Toolbar } from './Toolbar';
//#endregion
//#endregion

export const AppModal = (props) => {
    //#region local state   
    const [privacyModal, setPrivacyModal] = useState(false);
    const [privacyModalTitle, setPrivacyModalTitle] = useState(false);
    //#endregion local state    
    return (
        <Modal
            animationType={props.isAlert ? 'fade' : !props.isModalVisible ? 'none' : 'fade'}
            visible={props.isModalVisible}
            transparent={true}
            onRequestClose={props.onRequestClose}>
            <TouchableOpacity style={[styles.container, props.mainContainer, !props.isAlert && { backgroundColor: colors.TRANS }, props.isConnectModal && { backgroundColor: colors.BLACK_TRANSPARENT_OPTION2 }]} activeOpacity={1} onPress={props.isChacractersLimit ? null : !props.isConnectModal ? props.onRequestClose : null}>
                {props.isUpgrade && <BlurView
                    style={styles.absolute}
                    blurType={DEVICE_OS === 'ios' ? 'light' : 'dark'}
                    blurAmount={DEVICE_OS === 'ios' ? 4 : 20}
                    reducedTransparencyFallbackColor={colors.BLACK} />}
                {props.isUpgrade && DEVICE_OS === 'ios' && <View style={styles.blurDarkView} />}
                {props.isConnectModal ?
                    props.children :
                    // <View style={props.isUpgrade && { flex: 0.9, justifyContent: 'center', marginBottom: wp('8%') }}>
                    <View style={props.isUpgrade && { flex: 0.9, justifyContent: 'center' }}>
                        {props.isAlert ?
                            <TouchableOpacity style={[styles.subContainer, props.modalStyle]} activeOpacity={1} onPress={(props.isReported || props.isChacractersLimit) && props.onRequestClose}>
                                {!props.isChild ?
                                    <>
                                        <Text style={[globalStyles.text, styles.titleTxt, props.titleStyle]}>{props.alertTitle}</Text>
                                        <Spacer space={hp('5%')} />
                                        <TouchableOpacity onPress={props.onYesBtnPressed}>
                                            <Text style={[globalStyles.text, styles.titleTxt, { color: colors.BLUE1, fontFamily: fonts.VR }]}>{props.yesButton}</Text>
                                        </TouchableOpacity>
                                    </> :
                                    props.children}
                            </TouchableOpacity> :
                            props.children}
                    </View>}
                {props.isUpgrade &&
                    <TouchableOpacity activeOpacity={1} onPress={props.onRequestClose}>
                        {DEVICE_OS === 'ios' ?
                            <Text style={[styles.termsTxt, { lineHeight: wp('3.7%') }]}>{Strings.UPGRADE_IOS}
                                <Text style={{ fontFamily: fonts.VR }}>{Strings.UPGRADE_IOS2}</Text>
                                {/* <Text style={{ textDecorationLine: 'underline' }} onPress={() => props.onTermsPress('Privacy Policy')}>Privacy Policy</Text> and <Text style={{ textDecorationLine: 'underline' }} onPress={() => props.onTermsPress('Terms of Use')}>Terms.</Text> */}
                                <Text style={{ fontFamily: fonts.VR, textDecorationLine: 'underline' }} onPress={() => (setPrivacyModal(!privacyModal), setPrivacyModalTitle('Privacy Policy'))}>Privacy Policy</Text><Text style={{ fontFamily: fonts.VR }}> and </Text><Text style={{ fontFamily: fonts.VR, textDecorationLine: 'underline' }} onPress={() => (setPrivacyModal(!privacyModal), setPrivacyModalTitle('Terms of Use'))}>Terms.</Text>
                            </Text> :
                            <Text style={styles.termsTxt}>{Strings.UPGRADE_ANDROID}
                                <Text style={{ fontFamily: fonts.VR }}>{Strings.UPGRADE_ANDROID2}</Text>
                                <Text style={{ fontFamily: fonts.VR, textDecorationLine: 'underline' }} onPress={() => (setPrivacyModal(!privacyModal), setPrivacyModalTitle('Terms of Use'))}>Terms.</Text>
                            </Text>}
                    </TouchableOpacity>}
            </TouchableOpacity>
            {/* #region privacy policy modal #SubModal */}
            <ReactNativeModal
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                isVisible={privacyModal}
                style={{ margin: 0 }}
                onBackButtonPress={() => setPrivacyModal(!privacyModal)}>
                <View style={[globalStyles.flex, { height: DEVICE.DEVICE_HEIGHT }]}>
                    <Toolbar
                        isShadowLine={true}
                        title={privacyModalTitle}
                        onBackPressed={() => setPrivacyModal(!privacyModal)} />
                    <Spacer space={hp('1%')} />
                    <View style={globalStyles.subContainer}>
                        <Text>Coming Soon</Text>
                    </View>
                </View>
            </ReactNativeModal>
            {/* #endregion  privacy policy modal #SubModal */}
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        backgroundColor: colors.BLACK_TRANSPARENT,
        flex: 1,
        alignItems: 'center'
    },
    subContainer: {
        backgroundColor: colors.WHITE,
        paddingTop: hp('5%'),
        padding: wp('2%'),
        paddingBottom: hp('3%'),
        borderRadius: wp('3%'),
        width: wp('80%')
    },
    titleTxt: {
        fontFamily: fonts.VM,
        fontSize: wp('5.4%'),
        textAlign: 'center',
    },
    termsTxt: {
        color: colors.GREY3,
        width: wp('93%'),
        fontFamily: fonts.VM,
        marginTop: hp('1%'),
        fontSize: wp('3.3%'),
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    blurDarkView: {
        position: 'absolute',
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        backgroundColor: colors.BLACK_TRANSPARENT_OPTION1
    },
})