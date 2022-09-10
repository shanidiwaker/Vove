//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Keyboard } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import { hp } from "../../utils/constants";
import { colors } from '../../res/colors';
import { Spacer } from '../../res/spacer';
import { Toolbar } from '../../components/Toolbar';
import { AppButton } from '../../components/AppButton';
import { PhoneTextInput } from '../../components/PhoneTextInput';
import validations from '../../utils/validations';
import { Strings } from '../../res/string';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#endregion

export default loginPhone = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers)
    //#endregion redux
    //#region local state
    const [state, setState] = useState({
        mobileNumber: '',
        cca2: authReducers.countryCode,
        validationMsg: 'e'
    });
    //#endregion local state
    //#region ref    
    let inputRef = useRef();
    //#endregion ref

    useEffect(() => {
        inputRef.selectCountry(authReducers.countryCode.toLowerCase());
    }, []);
    const selectCountry = (country) => {
        inputRef.selectCountry(country.cca2.toLowerCase());
        setState({ ...state, cca2: country.cca2 });
    }

    return (
        <View style={globalStyles.flex}>
            <Toolbar
                bottomTitle={"My number is"}
                onBackPressed={() => props.navigation.goBack()} />
            <Spacer space={hp('1%')} />
            <View style={globalStyles.subContainer}>
                <PhoneTextInput
                    onRef={(ref) => { inputRef = ref }}
                    placeholder={'Phone Number'}
                    cca2={state.cca2}
                    onChange={(value) => value === '' ? setState({ ...state, mobileNumber: value, validationMsg: '' }) : setState({ ...state, mobileNumber: value })}
                    value={state.mobileNumber}
                    selectCountry={(value) => selectCountry(value)} />
                <Spacer space={hp('0.5%')} />
                <Text style={[globalStyles.text, { color: colors.GREY2 }]}>Message and data rates may apply. Once verified, this will be your login number.</Text>
                <Spacer space={hp('0.5%')} />
                <Text style={[globalStyles.text, { color: state.validationMsg === 'e' ? colors.TRANS : colors.RED, fontSize: hp('2.3%') }]}>{state.validationMsg}</Text>
                <Spacer space={hp('5%')} />
                <AppButton
                    disabled={state.mobileNumber === ''}
                    title={'Continue'}
                    onPress={() => {
                        if (!validations.validatePhnNumber(state.mobileNumber) || !inputRef.isValidNumber()) {
                            setState({ ...state, validationMsg: Strings.ENTER_VALID_PHONE_NUMBER });
                        } else {
                            setState({ ...state, validationMsg: 'e' });
                            dispatch(action.onVerifyMobileNumber(props, state.cca2 === '' ? authReducers.countryCode : state.cca2, state.mobileNumber));
                            Keyboard.dismiss();
                        }
                    }} />
            </View>
        </View>
    );
}