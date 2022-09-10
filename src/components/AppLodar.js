//#region import 
//#region RN
import React from 'react';
import { ActivityIndicator, View, StyleSheet, Modal } from 'react-native';
//#endregion
//#region common files
import { colors } from '../res/colors';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
//#endregion
//#endregion

export const AppLodar = () => {
  //#region redux
  const dispatch = useDispatch()
  const authReducers = useSelector(state => state.authReducers)
  //#endregion redux
  return (
    <Modal
      animationType="fade"
      visible={authReducers.appLoading}
      transparent={true}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.ORANGE} />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: colors.WHITE,
    flex: 1,
    alignItems: "center",
  },
});
