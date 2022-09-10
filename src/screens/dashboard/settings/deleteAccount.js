//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet, Animated, ScrollView } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import OnBackPressed from '../../../components/OnBackPressed';
import { Spacer } from '../../../res/spacer';
import { DEVICE, DEVICE_OS, wp, hp } from '../../../utils/constants';
import { colors } from '../../../res/colors';
import { Strings } from '../../../res/string';
import { AppButton } from '../../../components/AppButton';
import { AppModal } from "../../../components/AppModal";
import { Toolbar } from '../../../components/Toolbar';
import { fonts } from '../../../res/fonts';
import { BlurView } from '@react-native-community/blur';

//#endregion

export default deleteAccount = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <View style={[globalStyles.flex,]}>
                <OnBackPressed onBackPressed={() => props.navigation.goBack()} />
                <Toolbar
                    isShadowLine={true}
                    title={'Delete Account'}
                    onBackPressed={() => props.navigation.goBack()} />
                <ScrollView style={globalStyles.flex} showsVerticalScrollIndicator={false}>
                    <View>
                        <Spacer space={wp('6%')} />
                        <Text style={styles.pauseText}>Pause my Profile</Text>
                        <Spacer space={wp('4%')} />
                        <Text style={styles.pauseSubText}>{Strings.PAUSEPROILE}</Text>
                        <Spacer space={wp('9%')} />
                        <AppButton
                            colors={[colors.GRADIENT1, colors.GRADIENT2]}
                            txtStyle={{ color: colors.WHITE }}
                            title={'Pause Profile'}
                            onPress={() => props.onSearchClicked()} />
                    </View>
                    <Spacer space={wp('9%')} />
                    <AppModal
                        isAlert={true}
                        isChild={true}
                        modalStyle={{ width: wp('93%'), paddingTop: hp('3%'), height: wp(115) }}
                        mainContainer={{ backgroundColor: colors.BLACK_TRANSPARENT }}
                        isModalVisible={isModalVisible}
                        onRequestClose={() => {
                        }}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5.8%'), textAlign: 'center' },]}>{Strings.DELETEACCOUNT}</Text>
                            <Spacer space={wp('3%')} />
                            <Text style={[globalStyles.text, { fontFamily: fonts.RR, fontSize: wp('5%'), textAlign: 'center', color: colors.GREY1 },]}>{Strings.DELETESUBTEXT_1}</Text>
                            <Spacer space={wp('3%')} />
                            <Text style={[globalStyles.text, { fontFamily: fonts.RR, fontSize: wp('5%'), textAlign: 'center', color: colors.GREY1 },]}>{Strings.DELETESUBTEXT_2}</Text>
                            <Spacer space={wp('3%')} />
                            <Text style={[globalStyles.text, { fontFamily: fonts.RR, fontSize: wp('5%'), textAlign: 'center', color: colors.GREY1 },]}>{Strings.DELETESUBTEXT_3}</Text>
                            <Spacer space={wp('4.5%')} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: wp('95%') }}>
                                {isModalVisible &&
                                    ['Cancel', 'Delete Account'].map((data, index) => {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                if (index === 1) {
                                                    dispatch(action.onDeleteUser(props))
                                                    setTimeout(() => {
                                                        setIsDeleteStaysModal(!isDeleteStaysModal);
                                                    }, 500);
                                                    setIsModalVisible(!isModalVisible);
                                                } else {
                                                    setIsModalVisible(!isModalVisible);
                                                }
                                            }}>
                                                <Text style={[globalStyles.text, { fontSize: wp('5.4%'), color: colors.BLUE1, fontFamily: fonts.VR }]}>{data}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                            </View>
                        </View>
                    </AppModal>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            {isModalVisible && <BlurView
                style={styles.absolute}
                blurType={DEVICE_OS === 'ios' ? 'light' : 'light'}
                blurAmount={DEVICE_OS === 'ios' ? 4 : 4}
                reducedTransparencyFallbackColor={colors.DARK} />}
        </View>

    );
};
const styles = StyleSheet.create({

    pauseText: {
        textAlign: 'center',
        color: colors.DARK,
        fontSize: wp(7.5),
        fontFamily: fonts.VM
    },
    pauseSubText: {
        textAlign: 'center',
        color: colors.GREY2,
        fontSize: wp(5.7),
        fontFamily: fonts.VR
    },
    deleteText: {
        textAlign: 'center',
        color: colors.GREY2,
        fontSize: wp(5.7),
        fontFamily: fonts.VM
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    modal: {
        width: wp(94),
        paddingTop: hp('3%'),
    },
    titleTxt: {
        textAlign: 'center',
        color: colors.DARK,
        fontSize: wp(5.7),
        fontFamily: fonts.VM
    },
    dltBtn: {
        justifyContent: 'space-around'
    }
});