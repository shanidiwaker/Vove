//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet, BackHandler } from 'react-native';
//#endregion
//#region third party libs
import { isIphoneX } from 'react-native-iphone-x-helper';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
import * as appAction from '../../redux/actions/appActions';
import * as homeAction from '../../redux/actions/homeActions';
import * as chatAction from '../../redux/actions/chatActions';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import * as actions from '../../redux/actions/authActions';
import { hp, wp, DEVICE, APP_NAME } from "../../utils/constants";
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';
import { Spacer } from '../../res/spacer';
import { BASE_URL } from '../../apiHelper/APIs';
import { Toolbar } from '../../components/Toolbar';
import { AppButton } from '../../components/AppButton';
import { PhoneTextInput } from '../../components/PhoneTextInput';
import validations from '../../utils/validations';
import { Strings } from '../../res/string';
import { DetailsTextInput } from '../../components/DetailsTextInput';
import Profile from './profile/profile';
import Home from './home/home';
import Chat from './chat/chat';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#endregion

export default tabBar = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    //#endregion redux
    //#region local state   
    const [tabIndex, setTabIndex] = useState(1);
    //#endregion local state    
    useEffect(() => {
        dispatch(chatAction.onSocketConnect());
    }, []);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            dispatch(action.onGetUserDetails());
        });
        return unsubscribe;
    }, [props.navigation]);
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            global.isMemberChange = true;
            dispatch(homeAction.onClearCurrentMemberIndex(homeReducers.currentMemberDetails, 0));
        });
        return unsubscribe;
    }, [props.navigation]);
    return (
        <View style={globalStyles.flex}>
            <OnBackPressed onBackPressed={() => {
                (tabIndex === 0 || tabIndex === 2) ? setTabIndex(1) : BackHandler.exitApp()
            }} />
            <Toolbar
                title={APP_NAME}
                tabIndex={tabIndex}
                tab={[authReducers.userDetails?.user_photos === undefined ? null : { uri: BASE_URL + "/" + authReducers.userDetails?.user_photos[0].user_photo }, images.logoWordsGrey, images.chatGrey]}
                onTabClicked={(index) => setTabIndex(index)}
                toolbarStyle={[{ backgroundColor: colors.WHITE }, homeReducers.isDeleteModalVisible && { zIndex: 20 }]}
                isDeleteModalVisible={homeReducers.isDeleteModalVisible}
            />
            <View style={[globalStyles.subContainer, styles.subContainer]}>
                {tabIndex === 0 ?
                    <Profile
                        onBtnsClicked={(index) => props.navigation.navigate(index === 0 ? 'editProfile' : 'settings')} /> :
                    tabIndex === 1 ? <Home props={props} /> :
                        <Chat
                            props={props}
                            onSearchClicked={() => {
                                setTabIndex(1);
                                homeReducers.userStays.length === 0 && dispatch(homeAction.onAddStays(!homeReducers.isAddStays, props.navigation));
                            }} />}
            </View>

            {/* //#region Transparent BG while delete modal visible */}
            {homeReducers.isDeleteModalVisible && <View style={{ position: 'absolute', height: DEVICE.DEVICE_HEIGHT, width: DEVICE.DEVICE_WIDTH, backgroundColor: colors.BLACK_TRANSPARENT, zIndex: 1 }} />}
            {/* //#endregion  Transparent BG while delete modal visible˝ */}
        </View>
    );
};
const styles = StyleSheet.create({
    subContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: DEVICE.DEVICE_WIDTH,
        // marginTop: hp('0.5%')
    }
})