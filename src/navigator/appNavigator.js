//#region import
//#region RN
import React, { Component, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
//#endregion
//#region common files
import { DEVICE_OS } from '../utils/constants';
import { AppLodar } from '../components/AppLodar';
import { getData } from '../utils/asyncStorageHelper';
import loginStart from "../screens/auth/loginStart";
import termsPolicy from '../screens/auth/termsPolicy';
import loginPhone from '../screens/auth/loginPhone';
import OTP from '../screens/auth/OTP';
import addDetails from '../screens/auth/addDetails';
import addPhotos from '../screens/auth/addPhotos';
import searchPreference from '../screens/auth/searchPreference';
import userLocation from '../screens/auth/userLocation';
import tabBar from '../screens/dashboard/tabBar';
import home from '../screens/dashboard/home/home';
import profile from '../screens/dashboard/profile/profile';
import editProfile from '../screens/dashboard/profile/editProfile';
import chat from '../screens/dashboard/chat/chat';
import settings from '../screens/dashboard/settings/settings';
import deleteAccount from '../screens/dashboard/settings/deleteAccount';
import updatePhoneNumber from '../screens/dashboard/settings/updatePhoneNumber';
import fullProfile from '../screens/dashboard/home/fullProfile';
//#endregion
//#region third party libs
import { Provider } from 'react-redux';
import configureStore from '../redux/store';
import SplashScreen from 'react-native-splash-screen';
import chatting from '../screens/dashboard/chat/chatting';
import chattingProfile from '../screens/dashboard/chat/chattingProfile';
//#endregion
//#region const
const Stack = createStackNavigator();
const store = configureStore();
//#endregion
//#endregion

const options = { headerShown: false, gestureEnabled: DEVICE_OS === 'ios' ? true : false };
const options2 = { headerShown: false, gestureEnabled: false };

export default function AppNavigator() {
  //#region local state   
  const [initialPageName, setInitialPageName] = useState('');
  //#endregion local state
  useEffect(() => {
    getData('userDetails', (success) => {
      console.log(success);
      setInitialPageName(success === null ? 'loginStart' : 'tabNavigator');
      // success !== null && SplashScreen.hide();
    }, (failure) => {
      setInitialPageName('loginStart');
    });
  }, []);

  const AuthStackNavigator = () => {
    return (
      <Stack.Navigator initialRouteName={'loginStart'}>
        <Stack.Screen name="loginStart" component={loginStart} options={options} />
        <Stack.Screen name="termsPolicy" component={termsPolicy} options={options} />
        <Stack.Screen name="loginPhone" component={loginPhone} options={options} />
        <Stack.Screen name="OTP" component={OTP} options={options} />
        <Stack.Screen name="addDetails" component={addDetails} options={options2} />
        <Stack.Screen name="addPhotos" component={addPhotos} options={options} />
        <Stack.Screen name="searchPreference" component={searchPreference} options={options2} />
        <Stack.Screen name="userLocation" component={userLocation} options={options2} />
      </Stack.Navigator>
    )
  }
  const TabNavigator = () => {
    return (
      <Stack.Navigator initialRouteName={'tabBar'} screenOptions={({ navigation, route }) => {
        if (route.name === "chatting") {
          return {
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            detachPreviousScreen: !navigation.isFocused()//For disable white flikering issue while transition.
          }
        } else if (DEVICE_OS === 'ios' && route.name === "fullProfile") {
          return {
            cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
            // detachPreviousScreen: !navigation.isFocused()//For disable white flikering issue while transition.
          }
        }
      }}>
        <Stack.Screen name="tabBar" component={tabBar} options={options2} />
        <Stack.Screen name="home" component={home} options={options2} />
        <Stack.Screen name="profile" component={profile} options={options2} />
        <Stack.Screen name="editProfile" component={editProfile} options={options2} />
        <Stack.Screen name="chat" component={chat} options={options2} />
        <Stack.Screen name="settings" component={settings} options={options} />
        <Stack.Screen name="deleteAccount" component={deleteAccount} options={options} />
        <Stack.Screen name="updatePhoneNumber" component={updatePhoneNumber} options={options} />
        <Stack.Screen name="fullProfile" component={fullProfile} options={options} />
        <Stack.Screen name="termsPolicy" component={termsPolicy} options={options} />
        <Stack.Screen name="userLocation" component={userLocation} options={options2} />
        <Stack.Screen name="chatting" component={chatting} options={options} />
        <Stack.Screen name="chattingProfile" component={chattingProfile} options={options} />
      </Stack.Navigator>
    )
  }
  return (
    initialPageName === '' ? null :
      // <Provider store={store}>
      // <AppLodar />
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialPageName}>
          <Stack.Screen name="loginStart" component={AuthStackNavigator} options={options2} />
          <Stack.Screen name="tabNavigator" component={TabNavigator} options={options2} />
        </Stack.Navigator>
      </NavigationContainer>
    // {/* </Provider> */ }
  )
}