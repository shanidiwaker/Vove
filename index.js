import { AppRegistry, TextInput, Text } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import notificationBGService from './src/apiHelper/notificationBGService';

AppRegistry.registerHeadlessTask("RNFirebaseBackgroundMessage", () => notificationBGService);
AppRegistry.registerComponent(appName, () => App);
console.disableYellowBox = true;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;