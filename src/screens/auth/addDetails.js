//#region import 
//#region RN
import React, { useState, useRef } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import { hp } from "../../utils/constants";
import Util from '../../utils/utils';
import { Spacer } from '../../res/spacer';
import { Toolbar } from '../../components/Toolbar';
import { AppButton } from '../../components/AppButton';
import { DetailsTextInput } from '../../components/DetailsTextInput';
import { AppModal } from '../../components/AppModal';
import { Strings } from '../../res/string';
import OnBackPressed from '../../components/OnBackPressed';
import { validateUserName } from '../../utils/validations';
//#endregion
//#region redux
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#endregion

export default addDetails = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers)
    //#endregion redux
    //#region local state
    const [nameInput, setNameInput] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [iAm, setIAm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    //#endregion local state
    //#region ref    
    let inputRef = useRef();
    //#endregion ref

    return (
        <View style={globalStyles.flex}>
            <OnBackPressed />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
                <Toolbar
                    bottomTitle={"About you"}
                    isBackDisable={true} />

                <View style={globalStyles.subContainer}>
                    <DetailsTextInput
                        header='Name'
                        autoFocus={true}
                        value={nameInput}
                        autoCapitalize={'words'}
                        maxLength={13}
                        onChangeText={(input) => validateUserName(input) && setNameInput(input.charAt(0).toUpperCase() + input.slice(1))}
                        onKeyPress={(e, input) => {
                            if (e.nativeEvent.key === 'Backspace') {
                                nameInput.length === 1 && setNameInput('');
                            }
                        }} />
                    <Spacer space={hp('1%')} />
                    <DetailsTextInput
                        refs={(ref) => { inputRef = ref }}
                        header='Birthday'
                        isEditable={true}
                        placeholder={'D D / M M / Y Y Y Y'}
                        onChangeText={(extracted) => setBirthDate(extracted)}
                    />
                    <Spacer space={hp('1%')} />
                    <DetailsTextInput
                        header='I’m a '
                        isSelectable={true}
                        array={["Woman", "Man"]}
                        iAm={iAm}
                        onGenderPressed={(value) => { setIAm(value), Keyboard.dismiss() }} />
                    <Spacer space={hp('2%')} />
                    <AppButton
                        disabled={nameInput === '' || birthDate.length !== 8 || iAm === ''}
                        title={'Next'}
                        onPress={() => {
                            Keyboard.dismiss();
                            let formatedDate = birthDate.slice(0, 2) + "/" + birthDate.slice(2, 4) + "/" + birthDate.slice(4, 8);
                            let age = Util.onAgeCalculation(formatedDate);
                            let aboutMe = {
                                "fullname": nameInput,
                                "birth_date": moment(formatedDate).format("YYYY-MM-DD"),
                                "gender": iAm
                            };
                            age < 18 ?
                                setIsModalVisible(!isModalVisible) :
                                dispatch(action.onNextToPhotos(aboutMe, props, authReducers.userDetails));
                        }}
                    />
                    <AppModal
                        isAlert={true}
                        isModalVisible={isModalVisible}
                        alertTitle={Strings.INVALID_AGE}
                        yesButton={'OK'}
                        onYesBtnPressed={() => {
                            setIsModalVisible(!isModalVisible);
                            props.navigation.popToTop()
                            props.navigation.navigate('loginStart');
                        }} />
                </View>
            </ScrollView>
        </View>
    );
}