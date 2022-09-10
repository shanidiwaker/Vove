//#region import 
//#region RN
import React from 'react';
import { Text, TouchableOpacity, View, TextInput, StyleSheet, Platform } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import { DEVICE_OS, hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
import { Spacer } from '../res/spacer';
import { AppButton } from '../components/AppButton';
import BirthdateTextInput from './BirthdateTextInput';
//#endregion
//#endregion

export const DetailsTextInput = (props) => {
    return (
        <View style={[styles.textInputContainer, props.isSelectable && { borderBottomWidth: 0 }, props.type === 'multiLine' && { borderBottomWidth: 0, marginLeft: wp('5%') }, props.isVertical && { padding: 0 }]}>
            <Text style={[globalStyles.text, styles.text]}>{props.header}</Text>
            {props.isEditable ?
                props.header === 'Birthday' ?
                    <BirthdateTextInput onChangeTextValue={props.onChangeText} /> :
                    <TouchableOpacity style={styles.textInput} onPress={props.onPress}>
                        <Text style={[globalStyles.text, styles.text, { color: colors.DARK }]}>{props.placeholder}</Text>
                    </TouchableOpacity> :
                props.isSelectable ?
                    <View style={{ flex: 1, marginLeft: props.isVertical ? 0 : wp('8%'), justifyContent: 'space-between', flexDirection: props.isVertical ? 'column' : 'row' }}>
                        {props.array.map((data, index) => {
                            return (
                                <>
                                    {props.isVertical && <Spacer space={wp('4.4%')} />}
                                    <AppButton
                                        isSelectable={true}
                                        title={data}
                                        style={props.iAm !== data ? { alignSelf: 'center', borderWidth: 1, borderRadius: hp('5%') } : { borderWidth: 1, borderRadius: hp('5%'), borderColor: colors.TRANS }}
                                        linearGradient={{ width: props.isVertical ? wp('40%') : wp('28%') }}
                                        txtStyle={[{ fontSize: wp('4.4%') }, props.iAm === data && { color: colors.WHITE }]}
                                        colors={props.iAm === data ? [colors.RED, colors.RED] : [colors.WHITE, colors.WHITE]}
                                        onPress={() => props.onGenderPressed(data)} />
                                </>
                            )
                        })}
                    </View> :
                    props.type === 'multiLine' ?
                        <>
                            <TextInput
                                onLayout={props.onLayout}
                                ref={props.refs}
                                placeholder={props.placeTxt}
                                style={[styles.textInput, styles.multiLineTextInput, props.multilineStyle, Platform.OS === 'android' && { padding: 0 }]}
                                placeholderTextColor={colors.GREY2}
                                onChangeText={props.onChangeText}
                                value={props.value}
                                onFocus={props.onFocus}
                                autoFocus={props.autoFocus}
                                keyboardType={props.keyboardType}
                                autoCorrect={false}
                                selectionColor={DEVICE_OS === 'ios' ? colors.DARK : colors.GREY3}
                                onKeyPress={props.onKeyPress}
                                // maxLength={props.maxLength}
                                returnKeyType={props.returnKeyType}
                                blurOnSubmit={props.blurOnSubmit}
                                autoCapitalize={props.autoCapitalize}
                                multiline={true}
                                onContentSizeChange={props.onContentSizeChange} />
                            <Text style={[styles.text, styles.lengthCounterTxt, props.connect && { fontSize: wp('5%'), zIndex: 10, top: -wp('5%'), right: DEVICE_OS === 'ios' ? wp('7%') : wp('7%'), color: props.value === '' ? colors.TRANS : colors.WHITE, textShadowRadius: props.value === '' ? 0 : 2 }, props.connect && styles.shadowTxt]}>{props.maxLength - ((props.value === null || props.value === undefined) ? 0 : props.value.length)}</Text>
                        </> :
                        <TextInput
                            ref={props.refs}
                            placeholder={props.placeTxt}
                            style={[styles.textInput, Platform.OS === 'android' && { padding: 0, margin: -hp('2%') }]}
                            placeholderTextColor={colors.GREY2}
                            onChangeText={props.onChangeText}
                            value={props.value}
                            autoFocus={props.autoFocus}
                            onSubmitEditing={props.onSubmitEditing}
                            keyboardType={props.keyboardType}
                            autoCorrect={false}
                            selectionColor={DEVICE_OS === 'ios' ? colors.DARK : colors.GREY3}
                            onKeyPress={props.onKeyPress}
                            maxLength={props.maxLength}
                            returnKeyType={props.returnKeyType}
                            blurOnSubmit={false}
                            autoCapitalize={props.autoCapitalize} />}
        </View>
    )
}


const styles = StyleSheet.create({
    textInputContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: hp('1.5%'),
        paddingLeft: 0,
        borderBottomWidth: 1,
        borderBottomColor: colors.GREY2
    },
    text: {
        fontSize: wp('5.4%'),
        color: colors.GREY2
    },
    textInput: {
        flex: 1,
        marginLeft: wp('8%'),
        fontSize: wp('5.4%'),
        fontFamily: fonts.VR,
        color: colors.DARK
    },
    multiLineTextInput: {
        marginLeft: wp('0%'),
        marginRight: wp('2%'),
        fontSize: wp('5.2%'),
        textAlignVertical: 'top',
        lineHeight: wp('7.3%'),
        color: colors.GREY1,
        borderBottomWidth: 0
    },
    lengthCounterTxt: {
        position: 'absolute',
        bottom: -wp('7%'),
        right: wp('5%'),
        fontSize: wp('4%')
    },
    shadowTxt: {
        backgroundColor: colors.TRANS,
        textShadowColor: colors.BLACK_TRANSPARENT,
        textShadowOffset: { width: 0, height: 1 },
    },
})