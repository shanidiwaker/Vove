//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../../res/globalStyles';
import { hp, wp } from "../../../utils/constants";
import { images } from '../../../res/images';
import { colors } from '../../../res/colors';
import { Spacer } from '../../../res/spacer';
import { AppButton } from '../../../components/AppButton';
import { AppModal } from '../../../components/AppModal';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
import * as appAction from '../../../redux/actions/appActions';
import * as homeAction from '../../../redux/actions/homeActions';
import { Strings } from '../../../res/string';
//#endregion
//#endregion

export default upgradeTimerModal = (Props) => {
    const props = Props.props;
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    const homeReducers = useSelector(state => state.homeReducers);
    const appReducers = useSelector(state => state.appReducers);
    //#endregion redux
    //#region local state  
    const [counterHours, setCounterHours] = useState(0);
    const [counterMins, setCounterMins] = useState(0);
    const [counterSecs, setCounterSecs] = useState(0);
    //#endregion local state  

    useEffect(() => {
        if (homeReducers.connectUserResponse !== '') {
            if (homeReducers.connectUserResponse.time !== undefined) {
                setCounterHours(Number(homeReducers.connectUserResponse.time.toString().split(":")[0]));
                setCounterMins(Number(homeReducers.connectUserResponse.time.toString().split(":")[1]));
                setCounterSecs(Number(homeReducers.connectUserResponse.time.toString().split(":")[2]));
            }
        }
    }, [homeReducers.connectUserResponse])

    useEffect(() => {
        if (appReducers.isUpgradeModal) {
            const timerId = setInterval(() => {
                if (counterSecs == 0) {
                    if (counterMins == 0) {
                        if (counterHours == 0) {
                            setCounterHours(0);
                            setCounterMins(0);
                            setCounterSecs(0);
                            clearInterval(timerId);
                            dispatch(appAction.onUpgradeModalClicked(!appReducers.isUpgradeModal));
                        } else {
                            setCounterHours(h => h - 1);
                            setCounterMins(59);
                            setCounterSecs(59);
                        }
                    } else {
                        setCounterSecs(59);
                        setCounterMins(m => m - 1);
                    }
                } else setCounterSecs(s => s - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [counterHours, counterMins, counterSecs, appReducers.isUpgradeModal]);

    return (
        <AppModal
            isAlert={true}
            isChild={true}
            isUpgrade={true}
            modalStyle={styles.modalStyles}
            isModalVisible={appReducers.isUpgradeModal}
            onRequestClose={() => dispatch(appAction.onUpgradeModalClicked(!appReducers.isUpgradeModal))}
            onTermsPress={(value) => { dispatch(appAction.onUpgradeModalClicked(!appReducers.isUpgradeModal)), props.navigation.navigate("termsPolicy", { Title: value, isUpgradeModal: true }) }}>
            <View style={{ alignItems: 'center' }}>
                <Image source={images.people} style={[globalStyles.img, styles.peopleImg]} />
                <Spacer space={wp('3.5%')} />
                <Image source={images.sent} style={[globalStyles.img, { width: wp('23%'), height: wp('23%') }]} />
                <Spacer space={wp('2%')} />
                <Text style={[globalStyles.text, { fontSize: wp('5%') }]}>{counterHours < 10 && 0}{counterHours}:{counterMins < 10 && 0}{counterMins}:{counterSecs < 10 && 0}{counterSecs}</Text>
                <Spacer space={wp('1%')} />
                <Text style={[globalStyles.text, { fontSize: wp('5.5%'), textAlign: 'center' }]}>{Strings.OUT_OF_LIKES}<Text style={{ color: colors.GREEN, fontSize: wp('5%') }}>{"\n\nOnly $5 per month"}</Text></Text>
                <Spacer space={wp('3%')} />
                <AppButton
                    colors={[colors.GRADIENT3, colors.GRADIENT4]}
                    txtStyle={{ color: colors.WHITE }}
                    title={'Get Vove Xpress'}
                    onPress={() => alert('Coming soon...')} />
                <Spacer space={wp('2%')} />
            </View>
        </AppModal>
    );
};
const styles = StyleSheet.create({
    modalStyles: {
        width: wp('93%'),
        paddingTop: hp('3%')
    },
    peopleImg: {
        width: wp('90%'),
        height: wp('40%'),
        opacity: 0.3,
        position: 'absolute'
    }
})