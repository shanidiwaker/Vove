//#region import 
//#region RN
import React from 'react';
import { View, StatusBar } from 'react-native';
//#endregion
//#region common files
import AppNavigator from './src/navigator/appNavigator';
import { Network } from './src/components/Network';
import { AppLodar } from './src/components/AppLodar';
//#endregion
//#region third party libs
import { Provider } from 'react-redux';
import configureStore from './src/redux/store';
const store = configureStore();
//#endregion
//#endregion

const App: () => React$Node = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <Network />
        <AppLodar />
        <AppNavigator />
      </Provider>
    </View>
  );
};

export default App;