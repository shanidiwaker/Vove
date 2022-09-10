//#region import
//#region RN
import React, { useState, useEffect } from "react";
//#endregion
//#region common files
import { AppModal } from "./AppModal";
import { Strings } from "../res/string";
import * as authAction from "../redux/actions/authActions";
import * as chatAction from "../redux/actions/chatActions";
//#endregion
//#region third party libs
import NetInfo from "@react-native-community/netinfo";
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
//#endregion
//#endregion
global.isNetworkDisable = false;

export const Network = () => {
  //#region local state
  const [isModalVisible, setIsModalVisible] = useState(false);
  //#endregion local state
  //#region redux
  const dispatch = useDispatch()
  const authReducers = useSelector(state => state.authReducers)
  //#endregion redux
  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected != true) {
        global.isNetworkDisable = true;
        setIsModalVisible(true);
        dispatch(chatAction.onGetOfflineChat());
      } else {
        global.isNetworkDisable = false;
        setIsModalVisible(false);
        dispatch(authAction.onGetUserDetails());
      }
    });
  }, []);
  return (
    <AppModal
      isAlert={true}
      isModalVisible={isModalVisible}
      alertTitle={Strings.NETWORK_ISSUE}
      yesButton={"Try Again"}
      onYesBtnPressed={() => setIsModalVisible(false)}
    />
  );
};