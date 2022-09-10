//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import { hp } from "../../utils/constants";
import { Spacer } from '../../res/spacer';
import { Toolbar } from '../../components/Toolbar';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
import * as appAction from '../../redux/actions/appActions';
import * as homeAction from '../../redux/actions/homeActions';
//#endregion
//#endregion

export default termsPolicy = (props) => {
  //#region redux
  const dispatch = useDispatch()
  const authReducers = useSelector(state => state.authReducers);
  const homeReducers = useSelector(state => state.homeReducers);
  const appReducers = useSelector(state => state.appReducers);
  //#endregion redux
  //#region local state   
  const [tabIndex, setTabIndex] = useState(1);
  //#endregion local state    
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      try {
        props.route.params.isUpgradeModal && dispatch(appAction.onStaysUpgradeModalClicked(true))
      } catch (error) {
        console.log({ error });
      }
    });
    return unsubscribe;
  }, [props.navigation]);
  return (
    <View style={globalStyles.flex}>
      <Toolbar
        isShadowLine={true}
        title={props.route.params.Title}
        // title={'Privacy Policy'}
        onBackPressed={() => props.navigation.goBack()}
      />
      <Spacer space={hp('1%')} />
      <View style={globalStyles.subContainer}>
        <Text>Coming Soon</Text>
      </View>
    </View>
  );
};