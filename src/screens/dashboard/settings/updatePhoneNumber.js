//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, TouchableHighlight, View, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import OnBackPressed from '../../../components/OnBackPressed';
import { Spacer } from '../../../res/spacer';
import { DEVICE, DEVICE_OS, wp, hp } from '../../../utils/constants';
import { colors } from '../../../res/colors';
import { AppButton } from '../../../components/AppButton';
import { Toolbar } from '../../../components/Toolbar';
import { fonts } from '../../../res/fonts';
import * as action from '../../../redux/actions/authActions';

//#endregion
import { useSelector, useDispatch } from 'react-redux';

import ImageSlider from 'react-native-image-slider';
export default updatePhoneNumber = (props) => {
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const [number, setNumber] = useState(authReducers.userDetails.phone);

    useEffect(() => {
        console.log('userDetails', authReducers.userDetails);
    }, []);

    return (
        <View style={[globalStyles.flex,]}>
            <OnBackPressed onBackPressed={() => props.navigation.goBack()} />
            <Toolbar
                isShadowLine={true}
                title={'Update Phone Number'}
                onBackPressed={() => props.navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.conatiner}>
                    <Spacer space={wp('3%')} />
                    <Text style={styles.pauseText}>My Current Number</Text>
                    <Spacer space={hp('1.5%')} />
                    <TextInput style={styles.input} value={number}
                        onChangeText={setNumber} keyboardType='number-pad' />
                    <Spacer space={hp('7.5%')} />
                    <AppButton
                        colors={[colors.GRADIENT1, colors.GRADIENT2]}
                        txtStyle={{ color: colors.WHITE }}
                        title={'Update Phone Number'}
                        onPress={() => dispatch(action.onUpdatePhoneNumber(props, authReducers.userDetails, number))} />
                </View>

            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    conatiner: {
        paddingHorizontal: wp(8)
    },
    pauseText: {
        color: colors.DARK,
        fontSize: wp(7.5),
        fontFamily: fonts.VM,
    },
    input: {
        fontSize: wp(5.6),
        fontFamily: fonts.RR,
        color: colors.GREY2,
        padding: 0
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    slider: { backgroundColor: '#000', height: 350 },
    content1: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content2: {
        width: '100%',
        height: 100,
        marginTop: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: { color: '#fff' },
    buttons: {
        zIndex: 1,
        height: 15,
        marginTop: -25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        margin: 3,
        width: 15,
        height: 15,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSelected: {
        opacity: 1,
        color: 'red',
    },
    customSlide: {
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customImage: {
        width: 100,
        height: 100,
    },
});