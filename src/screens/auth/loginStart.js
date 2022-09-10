//#region import 
//#region RN
import React, { useEffect } from 'react';
import { Text, View, Image, StyleSheet, BackHandler } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import { hp, wp, DEVICE } from "../../utils/constants";
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { Spacer } from '../../res/spacer';
import { AppButton } from '../../components/AppButton';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#endregion

export default loginStart = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers)
    //#endregion redux  
    useEffect(() => {
        dispatch(action.getCurrentCountryCode(props));
    }, []);

    return (
        <View style={globalStyles.flex}>
            <OnBackPressed onBackPressed={() => BackHandler.exitApp()} />
            <View style={[styles.mainContainer, globalStyles.paddingTop]}>
                <View style={[globalStyles.subContainer, { alignItems: 'center' }]}>
                    <Spacer space={hp('2%')} />
                    <Image source={images.logoWords} style={[globalStyles.img, styles.logoImg]} />
                    <Spacer space={hp('2%')} />
                    <Text style={[globalStyles.text, styles.text, { fontSize: wp('5.4%'), color: colors.ORANGE }]}>Be the next great adventure</Text>
                </View>
                <View style={[globalStyles.subContainer, globalStyles.bottomSpace, { alignItems: 'center', flex: 0 }]}>
                    <AppButton
                        colors={[colors.WHITE, colors.WHITE]}
                        title={'Log in with Phone'}
                        onPress={() => props.navigation.navigate('loginPhone')} />
                    <Spacer space={hp('2%')} />
                    <Text style={[globalStyles.text, { fontSize: wp('4%'), color: colors.WHITE, textAlign: 'center' }]}>By logging in or signing up, you agree with our <Text style={styles.underlineText} onPress={() => props.navigation.navigate("termsPolicy", { Title: "Terms of Use" })}>Terms of Use</Text> and <Text style={styles.underlineText} onPress={() => props.navigation.navigate("termsPolicy", { Title: "Privacy Policy" })}>Privacy Policy.</Text></Text>
                </View>
            </View>
            <Image source={images.loginStartBg} style={styles.bgImg} />
        </View>
    );
}
const styles = StyleSheet.create({
    bgImg: {
        resizeMode: 'cover',
        flex: 1,
        height: DEVICE.DEVICE_HEIGHT,
        width: DEVICE.DEVICE_WIDTH,
        position: 'absolute'
    },
    logoImg2: {
        height: hp('8%'),
        width: hp('24%')
    },
    logoImg: {
        height: wp('18%'),
        width: wp('52%')
    },
    underlineText: {
        textDecorationLine: 'underline'
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    }
})