//#region import 
//#region RN
import { Component } from "react";
import { Platform, Animated } from "react-native";
//#endregion
//#region third party libs
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
//#endregion
//#endregion

export default class Util extends Component {
    static onHapticFeedback = () => {
        const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: true
        };
        Platform.OS === 'ios' ? ReactNativeHapticFeedback.trigger("impactHeavy", options) : ReactNativeHapticFeedback.trigger("impactLight", options);
    }
    static onAgeCalculation = (selectedDate) => {
        var today = new Date();
        var birthDate = new Date(selectedDate);
        var ageNow = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            ageNow--;
        }
        return ageNow;
    }
    static imagesSorting() {
        return function (a, b) {
            // equal items sort equally
            if (a === b) {
                return 0;
            }
            // nulls sort after anything else
            else if (a.pickedImage === '') {
                return 1;
            }
            else if (b.pickedImage === '') {
                return -1;
            }
        };
    }
    static isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    static slideLeftAnim = (moveAnimation, xValue, axis, callBack) => {
        Animated.timing(moveAnimation, {
            toValue: { x: axis !== 'y' ? xValue : 0, y: axis === 'y' ? xValue : 0 },
            duration: 300
        }).start(() => callBack !== undefined && callBack())
    }
    static toValueAnimation = (valueAnimation, toValue, type, callBack) => {
        Animated.timing(valueAnimation, {
            toValue: toValue,
            duration: type === 'fade' ? 300 : type === 'fade1' ? 1000 : type === 'shrink' ? 400 : type === 'cardAction' ? 50 : 150
        }).start(() => callBack !== undefined && callBack());
    }
}