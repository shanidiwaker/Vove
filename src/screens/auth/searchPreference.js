//#region import 
//#region RN
import React, { useState } from 'react';
import { View, StyleSheet, } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import { DEVICE_OS } from "../../utils/constants";
import { Toolbar } from '../../components/Toolbar';
import { AppButton } from '../../components/AppButton';
import { DetailsTextInput } from '../../components/DetailsTextInput';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
//#endregion
//#endregion

export default searchPreference = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers)
    //#endregion redux
    //#region local state
    const [preference, setPreference] = useState('');
    //#endregion local state

    return (
        <View style={globalStyles.flex}>
            <OnBackPressed />
            <Toolbar
                bottomTitle={"Find me"}
                isBackDisable={true} />

            <View style={globalStyles.subContainer}>
                <DetailsTextInput
                    isVertical={true}
                    isSelectable={true}
                    array={["Women", "Men", "Everyone"]}
                    iAm={preference}
                    onGenderPressed={(value) => setPreference(value)} />
            </View>
            <View style={[globalStyles.subContainer, { flex: DEVICE_OS === 'android' ? 0.2 : isIphoneX() ? 0.2 : 0.232 }]}>
                <AppButton
                    disabled={preference === ''}
                    title={'Go Vove!'}
                    onPress={() => dispatch(action.onNextToLocation(authReducers.userDetails, authReducers.authRequest, preference, props))} />
            </View>
        </View>
    );
}