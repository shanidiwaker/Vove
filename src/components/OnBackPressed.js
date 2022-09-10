//#region import 
//#region RN
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
//#endregion
//#endregion

export default OnBackPressed = (props) => {
    useEffect(() => {
        const unsubscribe = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }, [props])
    const handleBackButton = () => {
        props.onBackPressed !== undefined && props.onBackPressed();
        return true;
    }
    return handleBackButton;
}