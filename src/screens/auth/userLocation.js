//#region import
//#region RN
import React, { useState, useEffect, useRef } from "react";
import { Text, View, Keyboard, TouchableOpacity, Image, ScrollView } from "react-native";
//#endregion
//#region common files
import globalStyles from "../../res/globalStyles";
import { Toolbar } from "../../components/Toolbar";
import { AppButton } from "../../components/AppButton";
import { DEVICE, hp, wp, DEVICE_OS } from "../../utils/constants";
import { colors } from "../../res/colors";
import { Strings } from "../../res/string";
import { images } from "../../res/images";
import { fonts } from "../../res/fonts";
import { UseKeyboard } from "../../components/UseKeyboard";
import OnBackPressed from "../../components/OnBackPressed";
//#region redux
import { useSelector, useDispatch } from "react-redux";
import * as action from "../../redux/actions/authActions";
import * as homeAction from "../../redux/actions/homeActions";
//#endregion
//#region third party libs
import { isIphoneX } from "react-native-iphone-x-helper";
import { Spacer } from "../../res/spacer";
//#endregion
//#endregion

export default userLocation = (props) => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector((state) => state.authReducers);
  const homeReducers = useSelector((state) => state.homeReducers);
  //#endregion redux
  //#region local state
  const [locationInput, setLocationInput] = useState('');
  const [keyboardHeight] = UseKeyboard();
  //#endregion local state
  //#region ref    
  let inputRef = useRef();
  //#endregion ref

  useEffect(() => {
    Keyboard.dismiss();
  }, [props.navigation]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      dispatch(homeAction.onAddStays(false, props.navigation, 0));
      dispatch(action.onClearSelectedLocation());
      dispatch(action.onAutoLocationList());
    });
    return unsubscribe;
  }, [props.navigation])

  useEffect(() => {
    if (homeReducers.selectedStays !== '') {
      dispatch(action.onAutoLocationList(homeReducers.selectedStays.data.location_name));
      setLocationInput(homeReducers.selectedStays.data.location_name);
    }
  }, [homeReducers])

  let selectedLocationAddress = authReducers.selectedLocation && authReducers.selectedLocation.response.addresses[0].address;
  const renderAutoCompleteLocationList = () => {
    return (
      <ScrollView style={{ width: DEVICE.DEVICE_WIDTH, marginBottom: DEVICE_OS === 'ios' ? keyboardHeight : 0, marginTop: hp('0.8%') }} keyboardShouldPersistTaps={'always'}>
        {authReducers.autoLocationList.map((data, index) => {
          return (
            <TouchableOpacity style={globalStyles.listItem} key={index} onPress={() => {
              homeReducers.selectedStays !== '' && dispatch(homeAction.onSelectStays(''));
              !homeReducers.isAddStays ? dispatch(action.onNextToHome(authReducers.userDetails, data, undefined, props)) : dispatch(homeAction.onAddedStays(authReducers.userDetails, data, undefined, props, homeReducers));
            }}>
              <Image source={images.locationPin} style={[globalStyles.img, { height: hp('3%'), width: hp('3%'), marginLeft: wp('2%') }]} />
              <View style={{ marginLeft: wp('8%'), marginRight: wp('5%') }}>
                <Text style={[globalStyles.text, { fontFamily: fonts.VM, fontSize: wp('5%') }]}>
                  {(data.entityType === 'Country' || data.entityType === 'CountrySubdivision') ? (data.address.country) :
                    (data.entityType === 'MunicipalitySubdivision') ? (data.address.municipalitySubdivision) :
                      (data.type === 'Street') ? (data.address.streetName) :
                        (data.address.municipality === '' ? data.address.countrySubdivision : data.address.municipality)}</Text>
                <Text style={[globalStyles.text, { fontSize: wp('5%'), color: colors.GREY2 }]}>
                  {data.entityType === 'Country' ? (data.address.freeformAddress) :
                    (data.address.countrySubdivision && data.address.countrySubdivision + ", " + data.address.country)}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
  }
  return (
    <View style={globalStyles.flex}>
      <OnBackPressed onBackPressed={() => authReducers.selectedLocation === '' ? (homeReducers.isAddStays && (props.navigation.goBack(), dispatch(homeAction.onSelectStays('')))) : dispatch(action.onClearSelectedLocation())} />
      <Toolbar
        refs={(ref) => { inputRef = ref }}
        isShadowLine={true}
        // isBackDisable={!authReducers.selectedLocation && !homeReducers.isAddStays}
        isBackDisable={!authReducers.selectedLocation && homeReducers.selectedStays === '' && !homeReducers.isAddStays}
        isInput={true}
        title={''}
        onBackPressed={() => authReducers.selectedLocation === '' ? (props.navigation.goBack(), dispatch(homeAction.onSelectStays(''))) : dispatch(action.onClearSelectedLocation())}
        isRightIcon={locationInput !== ''}
        placeTxt={Strings.SEARCH_LOCATION}
        value={selectedLocationAddress !== '' ? (selectedLocationAddress.municipalitySubdivision ? selectedLocationAddress.municipalitySubdivision : selectedLocationAddress.countrySubdivision) : locationInput}
        onChangeText={(input) => {
          setLocationInput(input);
          dispatch(action.onAutoLocationList(input));
        }}
        onRightIconPressed={() => {
          setLocationInput('');
          dispatch(action.onAutoLocationList());
          Keyboard.dismiss();
        }}
        editable={selectedLocationAddress === ''} />
      <View style={[globalStyles.subContainer, { alignItems: "center" }]}>
        {authReducers.autoLocationList.length === 0 &&
          <>
            <Spacer space={hp('5%')} />
            {!authReducers.selectedLocation ?
              <>
                <Text style={[globalStyles.text, { fontSize: wp('6.5%') }]}>Where is your Stay?</Text>
                <Spacer space={hp('1.5%')} />
                <Text style={[globalStyles.text, { fontSize: wp('6.5%'), textAlign: 'center', color: colors.GREY2 }]}>Add a city, suburb{'\n'}or landmark.</Text>
              </> :
              <Text style={[globalStyles.text, { fontSize: wp('6.5%'), textAlign: 'center' }]}>{selectedLocationAddress !== undefined && (selectedLocationAddress.municipalitySubdivision ? selectedLocationAddress.municipalitySubdivision : selectedLocationAddress.countrySubdivision) + '\n' + (selectedLocationAddress.municipality ? selectedLocationAddress.municipality : selectedLocationAddress.freeformAddress) + '\n' + selectedLocationAddress.country}</Text>}
          </>}
        {/* //#region auto location list */}
        {authReducers.autoLocationList.length !== 0 && renderAutoCompleteLocationList()}
        {/* //#endregion auto location list */}
      </View>
      {authReducers.autoLocationList.length === 0 &&
        <View style={[globalStyles.subContainer, { alignItems: "center", flex: DEVICE_OS === 'android' ? 0.179 : isIphoneX() ? 0.18 : 0.2 }]}>
          <AppButton
            title={!authReducers.selectedLocation ? "Or Use My Location" : "Confirm Location"}
            onPress={() => {
              console.log("homeReducers.isAddStays : ", homeReducers.isAddStays);
              !authReducers.selectedLocation ? dispatch(action.onGetLocation(authReducers.userDetails)) :
                !homeReducers.isAddStays ? dispatch(action.onNextToHome(authReducers.userDetails, authReducers.selectedLocation, selectedLocationAddress, props)) :
                  dispatch(homeAction.onAddedStays(authReducers.userDetails, authReducers.selectedLocation, selectedLocationAddress, props, homeReducers))
            }}
            style={{ borderWidth: !authReducers.selectedLocation ? 1 : 0, borderRadius: hp("5%") }}
            txtStyle={{ color: !authReducers.selectedLocation ? colors.DARK : colors.WHITE }}
            colors={!authReducers.selectedLocation ? [colors.WHITE, colors.WHITE] : [colors.GRADIENT1, colors.GRADIENT2]} />
        </View>}
    </View>
  );
};