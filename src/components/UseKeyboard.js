//#region import 
//#region RN
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';
//#endregion
//#endregion

export const UseKeyboard = (): [number] => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    function onKeyboardDidShow(e: KeyboardEvent): void {
        setKeyboardHeight(e.endCoordinates.height);
    }
    function onKeyboardDidHide(): void {
        setKeyboardHeight(0);
    }
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return (): void => {
            Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
        };
    }, []);
    return [keyboardHeight];
};