//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Image, StyleSheet } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import OnBackPressed from '../../../components/OnBackPressed';
import { colors } from '../../../res/colors';
import { DEVICE, DEVICE_OS, hp, wp } from '../../../utils/constants';
import { images } from '../../../res/images';
import { fonts } from '../../../res/fonts';
import { BASE_URL, COUNTRY_FLAGS } from '../../../apiHelper/APIs';
//#endregion
//#endregion

export default profile = (props) => {
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    //#endregion redux
    //#region local state
    const [icons, setIcons] = useState([images.pencilProfile, images.setting]);
    //#endregion local state     
    //#region ref    
    let imageSliderRef = useRef();
    //#endregion ref 

    return (
        <ScrollView style={globalStyles.flex}>
            {/* <OnBackPressed /> */}
            <View style={{ height: wp('122%') }}>
                <ImageSlider
                    ref={(ref) => { imageSliderRef = ref }}
                    autoPlayWithInterval={5000}
                    images={authReducers.userDetails.user_photos}
                    customSlide={({ index, item, style, width }) => (
                        <View key={index} style={[style, { backgroundColor: colors.WHITE }]}>
                            {/* <Image source={{ uri: BASE_URL + '/' + item.user_photo }} style={{ height: wp('122%'), width: DEVICE.DEVICE_WIDTH, }} /> */}
                            <FastImage source={{ uri: BASE_URL + '/' + item.user_photo }} style={{ width: undefined, height: DEVICE.DEVICE_HEIGHT / 1.3 }} />
                        </View>
                    )} />
                <View style={styles.settingsIconContainer}>
                    {icons.map((data, index) => {
                        return (
                            <TouchableOpacity style={[index === 0 && { left: wp('4%') }]} onPress={() => (
                                props.onBtnsClicked(index),
                                index === 0 && setTimeout(() => {
                                    imageSliderRef && imageSliderRef._move(0, false);
                                }, 200))}>
                                <Image source={data} style={[globalStyles.img, styles.settingIcon]} />
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </View>
            <View style={styles.titleContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('7.5%') }]}>{authReducers.userDetails?.fullname}<Text style={[globalStyles.text, { fontSize: wp('7.5%') }]}> {authReducers.userDetails?.age}</Text></Text>
                    {/* <FastImage source={{ uri: COUNTRY_FLAGS(authReducers.userDetails?.fly_country_code.toLowerCase()) }} style={[globalStyles.img, { width: wp('13%'), height: wp('11%') }, DEVICE_OS === 'android' ? { top: -wp('0.5%') } : { top: 0 }]} /> */}
                    <FastImage source={{ uri: COUNTRY_FLAGS(authReducers.userDetails?.fly_country_code.toLowerCase()) }} style={[globalStyles.img, { width: DEVICE_OS === 'ios' ? wp('11%') : wp('11.7%'), height: wp('10%'), top: -wp('0.7%') }, DEVICE_OS === 'ios' && !isIphoneX() && { right: wp('1%') }]} />
                </View>
                <Text style={[globalStyles.text, styles.bioTxt]}>{authReducers.userDetails?.bio_content}</Text>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    settingIcon: {
        height: wp('20%'),
        width: wp('20%')
    },
    settingsIconContainer: {
        position: 'absolute',
        bottom: -wp('8.2%'),
        right: 0,
        flexDirection: 'row'
    },
    titleContainer: {
        width: wp('100%'),
        padding: hp('3%'),
        paddingTop: DEVICE_OS === 'ios' ? wp('5%') : wp('4%'),
        marginBottom: wp('30%')
    },
    bioTxt: {
        fontSize: wp('5.2%'),
        color: colors.GREY1,
        marginTop: wp('3.5%'),
        lineHeight: wp('7.3%')
    }
})