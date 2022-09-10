//#region import 
//#region RN
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import { hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
import { Spacer } from '../res/spacer';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../redux/actions/appActions';
//#endregion

//#endregion

export const OptionMenu = (props) => {
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    const appReducers = useSelector(state => state.appReducers);
    //#endregion redux
    return (
        <Modal
            animationType='fade'
            visible={appReducers.appOptionMenu}
            transparent={true}>
            {/* <TouchableOpacity style={[styles.container, globalStyles.paddingTop]} activeOpacity={1} onPress={() => dispatch(action.onOptionModalClicked(!appReducers.appOptionMenu, 'option'))}> */}
            <TouchableOpacity style={[styles.container, globalStyles.paddingTop]} activeOpacity={1} onPress={props.onRequestClose}>
                <View style={[globalStyles.shadow, styles.subContainer, props.isWithoutTransparent && styles.shadow2]}>
                    {props.options.map((data, index) => {
                        return (
                            <TouchableOpacity style={[styles.itemContainer, props.isWithoutTransparent && { width: wp('45%') }]} onPress={() => {
                                dispatch(action.onOptionsClicked(data, index));
                                setTimeout(() => {
                                    data.isReport === undefined && props.onVisibleTransparentView !== undefined && props.onVisibleTransparentView();
                                    data.isReport !== undefined && !data.isReport && props.onOptionItemClicked();
                                }, 200);
                            }}>
                                <Text style={[globalStyles.text, styles.titleTxt]}>{data.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </TouchableOpacity>
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.TRANS,
        flex: 1,
        alignItems: 'flex-end'
    },
    subContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: wp('1%'),
        top: -wp('3%'),
        right: wp('3%'),
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        elevation: 8,
        paddingTop: wp('2%'),
        paddingBottom: wp('2%'),
    },
    shadow2: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        elevation: 15,
        shadowRadius: 8,
    },
    titleTxt: {
        fontFamily: fonts.VM,
        fontSize: wp('4.5%'),
        textAlign: 'left',
        // paddingTop: wp('4%'),
        // backgroundColor: 'red',
        padding: wp('3%'),
        paddingLeft: wp('5%')
    },
    itemContainer: {
        paddingTop: 0,
        // padding: wp('4%'),
        width: wp('40%'),
        alignItems: 'flex-start',
    }
})