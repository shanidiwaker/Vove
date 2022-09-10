//#region import 
//#region RN
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
//#endregion
//#region common files
import { hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
//#endregion
//#region third party libs
import LinearGradient from 'react-native-linear-gradient';
//#endregion
//#endregion

export const AppButton = (props) => {
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={props.onPress} style={[{ alignSelf: 'center', padding: 0.1 }, props.style]} disabled={props.disabled || props.isChild}>
            <LinearGradient
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                colors={props.disabled === undefined ? props.colors : (props.disabled ? [colors.GREY3, colors.GREY3] : [colors.GRADIENT1, colors.GRADIENT2])}
                style={[styles.linearGradient, props.linearGradient]}>
                {props.isChild ? props.children : <Text style={[styles.text, props.disabled === undefined ? props.txtStyle : { color: colors.WHITE }]}>{props.title}</Text>}
            </LinearGradient>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('2%'),
        borderRadius: hp('5%'),
        width: wp('80%')
    },
    text: {
        fontFamily: fonts.VM,
        // fontSize: hp('2.5%'),
        fontSize: wp('5.4%'),
        color: colors.BROWN
    }
})