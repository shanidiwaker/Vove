//#region import 
//#region RN
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
//#endregion
//#region common files
import { hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
//#endregion
//#region third party libs
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
//#endregion
//#endregion

export const PhoneTextInput = (props) => {
    return (
        !props.withFlag ?
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.DARK, alignItems: 'center' }}>
                    <Text style={{ fontSize: wp('5.4%'), fontFamily: fonts.VR, position: 'absolute', color: colors.DARK }}>{props.cca2} </Text>
                    <CountryPicker
                        withModal={true}
                        withCallingCode={true}
                        withCallingCodeButton={true}
                        withFlag={false}
                        countryCode={props.cca2}
                        withFilter={true}
                        withCurrencyButton={false}
                        withFlagButton={false}
                        onSelect={(value) => props.selectCountry(value)}
                        theme={{ fontFamily: fonts.VR, fontSize: wp('5.2%'), itemHeight: wp('13%'), onBackgroundTextColor: colors.DARK }}
                        containerButtonStyle={{ marginTop: 0, paddingLeft: wp(props.cca2.length * 4), zIndex: 1 }}
                        excludeCountries={['AQ', 'HM', 'TF', 'UM', 'BV']} />
                </View>
                <PhoneInput
                    ref={(ref) => { props.onRef(ref) }}
                    flagStyle={{ height: 0, width: 0 }}
                    style={[styles.phoneInput, props.value !== '' && { borderBottomColor: colors.DARK }]}
                    textStyle={styles.phoneInputTxt}
                    textProps={{ placeholder: props.placeholder }}
                    onChangePhoneNumber={(value) => props.onChange(value)}
                    value={props.value}
                    initialCountry={props.cca2.toLowerCase()} />
            </View> :
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CountryPicker
                    withModal={true}
                    withCallingCode={false}
                    withCallingCodeButton={false}
                    withFlag={true}
                    countryCode={props.cca2}
                    withFilter={true}
                    withCurrencyButton={false}
                    withFlagButton={true}
                    isProfile={props.isProfile}
                    onSelect={(value) => props.selectCountry(value)}
                    theme={{ fontFamily: fonts.VR, fontSize: wp('5.2%'), itemHeight: wp('13%'), onBackgroundTextColor: colors.DARK }}
                    // theme={{ fontFamily: fonts.VR, fontSize: wp('5.4%'), itemHeight: wp('13%'), onBackgroundTextColor: colors.DARK }}
                    containerButtonStyle={{ marginTop: 0 }}
                    excludeCountries={['AQ', 'HM', 'TF', 'UM', 'BV']} />
            </View>
    )
}

const styles = StyleSheet.create({
    phoneInput: {
        width: wp('60%'),
        padding: hp('1%'),
        paddingLeft: 0,
        borderBottomWidth: 2,
        marginLeft: wp('4%'),
        borderBottomColor: colors.GREY3
    },
    phoneInputTxt: {
        fontSize: wp('5.4%'),
        fontFamily: fonts.VR,
        color: colors.DARK
    },
    img: {
        height: hp('1%'),
        width: hp('1%'),
        marginLeft: wp('2%'),
    }
})