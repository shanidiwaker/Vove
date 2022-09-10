//#region import 
//#region RN
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import { hp, wp } from "../../utils/constants";
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';
import { Spacer } from '../../res/spacer';
import { Toolbar } from '../../components/Toolbar';
import { AppButton } from '../../components/AppButton';
import { Strings } from '../../res/string';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region third party libs
import CodeInput from 'react-native-confirmation-code-input';
//#endregion
//#endregion

export default OTP = (props) => {
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    //#endregion redux
    //#region local state
    const [isResend, setIsResend] = useState(false);
    const [OTPCode, setOTPCode] = useState('');
    const [resendCount, setResendCount] = useState(1);
    const [validationMsg, setValidationMsg] = useState('e');
    //#endregion local state   

    return (
        <View style={globalStyles.flex}>
            <Toolbar
                bottomTitle={"Enter your code"}
                onBackPressed={() => props.navigation.goBack()} />

            <View style={globalStyles.subContainer}>
                <Text style={[globalStyles.text, { color: colors.GREY2, fontSize: wp('6%'), textAlign: 'center' }]}>We sent a code to{'\n'}{authReducers.formattedMobileNumber !== '' && authReducers.formattedMobileNumber.mobileNumberFormatting}</Text>
                <Spacer space={hp('0.5%')} />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity disabled={isResend} onPress={() => {
                        if (resendCount <= 2) {
                            dispatch(action.onResendOTP(authReducers.formattedMobileNumber, authReducers.authRequest, () => {
                                setIsResend(!isResend);
                                setOTPCode('');
                                setResendCount(resendCount + 1);
                                setTimeout(() => {
                                    setIsResend(isResend);
                                }, 30000);
                            }));
                        }
                    }}>
                        <Text style={[globalStyles.text, { fontSize: wp('4.8%'), fontFamily: fonts.VM, }, isResend && { color: colors.RED }]}>{isResend ? "Resent, check your messages" : "Resend?"}</Text>
                    </TouchableOpacity>
                </View>
                <Spacer space={hp('0.5%')} />
                <CodeInput
                    autoFocus={true}
                    ignoreCase={true}
                    codeLength={6}
                    inputPosition='center'
                    activeColor={colors.DARK}
                    onFulfill={setOTPCode}
                    codeInputStyle={styles.codeInput}
                    onBackPressed={() => { setOTPCode(''), setValidationMsg('e') }} />
                <Spacer space={hp('1.2%')} />
                <Text style={[globalStyles.text, { color: validationMsg === 'e' ? colors.TRANS : colors.RED, fontSize: wp('4.8%'), textAlign: 'center' }]}>{validationMsg}</Text>
                <Spacer space={hp('3%')} />
                <AppButton
                    disabled={OTPCode === ''}
                    title={'Continue'}
                    onPress={() => {
                        dispatch(action.onVerifyOTP(props, OTPCode, authReducers.authRequest, (params) => {                           
                            params ? setValidationMsg('e') : setValidationMsg(Strings.INVALID_OTP);
                        }));
                    }} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    codeInput: {
        width: wp('10%'),
        height: wp('12.5%'),
        backgroundColor: colors.LIGHT_WHITE,
        borderWidth: 0,
        borderRadius: 5,
        fontFamily: fonts.VM,
        color: colors.DARK,
        fontSize: wp('6.5%')
    }
})