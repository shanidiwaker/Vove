//#region import 
//#region RN
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image, StyleSheet, Keyboard } from 'react-native';
//#endregion
//#region third party libs
import { AutoDragSortableView } from 'react-native-drag-sort';
import * as ImagePickers from "react-native-image-picker";
import ImagePicker from 'react-native-image-crop-picker';
import { getImage } from 'react-native-country-picker-modal';
var countries = require('country-data').countries;
import { isIphoneX } from 'react-native-iphone-x-helper';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region common files
import Util from '../../utils/utils';
import globalStyles from '../../res/globalStyles';
import { hp, wp, DEVICE, DEVICE_OS } from "../../utils/constants";
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';
import { Spacer } from '../../res/spacer';
import { Toolbar } from '../../components/Toolbar';
import { AppButton } from '../../components/AppButton';
import { PhoneTextInput } from '../../components/PhoneTextInput';
//#endregion
//#endregion
const childrenWidth = wp('27%');
const childrenHeight = wp('27%');

export default addPhotos = (props) => {
    //#region redux
    const dispatch = useDispatch()
    const authReducers = useSelector(state => state.authReducers);
    //#endregion redux
    //#region local state
    const [photosArray, setPhotosArray] = useState([
        { icon: images.addPhoto, pickedImage: '', base64: '', id: 0 },
        { icon: images.addPhoto, pickedImage: '', base64: '', id: 1 },
        { icon: images.addPhoto, pickedImage: '', base64: '', id: 2 },
        { icon: images.addPhoto, pickedImage: '', base64: '', id: 3 },
        { icon: images.addPhoto, pickedImage: '', base64: '', id: 4 },
        { icon: images.addPhoto, pickedImage: '', base64: '', id: 5 }
    ]);
    const [update, setUpdate] = useState('a');
    const [fromIndex, setFromIndex] = useState('');
    const [toIndex, setToIndex] = useState('');
    const [cropperParams, setCropperParams] = useState({});
    const [croppedImage, setCroppedImage] = useState('{}');
    const [cca2, setcca2] = useState(authReducers.countryCode);
    const [countryName, setCountryName] = useState(countries[authReducers.countryCode].name);
    //#endregion local state

    const onImagePickerClicked = (index) => {
        // ImagePickers.launchImageLibrary(
        //     { mediaType: 'photo', includeBase64: true },
        //     async (response) => {
        //         console.log("response : ", response);
        //         if (response.didCancel || response.error) {
        //             console.log("Cancel");
        //         } else {
        //             ImagePicker.openCropper({
        //                 path: response.uri,
        //                 width: 300,
        //                 height: 400,
        //                 includeBase64: true,
        //                 hideBottomControls: true,
        //                 cropperToolbarColor: colors.WHITE,
        //                 cropperToolbarTitle: 'Crop Photo'
        //             }).then(image => {
        //                 console.log("image : ", image);
        //                 Keyboard.dismiss();
        //                 var BreakException = {};
        //                 try {
        //                     photosArray.forEach(element => {
        //                         if (element.pickedImage === '') {
        //                             element.pickedImage = { uri: image.path };
        //                             element.base64 = image.data;
        //                             throw BreakException;
        //                         }
        //                     });
        //                 } catch (e) {
        //                     if (e !== BreakException) throw e;
        //                 }
        //                 setPhotosArray(photosArray);
        //                 setUpdate(image.path);
        //             });
        //         }
        //     },
        // )
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
            hideBottomControls: true,
            cropperToolbarColor: colors.WHITE,
            cropperToolbarTitle: 'Crop Photo'
        }).then(image => {
            Keyboard.dismiss();
            var BreakException = {};
            try {
                photosArray.forEach(element => {
                    if (element.pickedImage === '') {
                        element.pickedImage = { uri: image.path };
                        element.base64 = image.data;
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e !== BreakException) throw e;
            }
            setPhotosArray(photosArray);
            setUpdate(image.path);
        });
    }


    renderScrollNullItem = () => {
        return (
            photosArray.map((item, index) => {
                return (
                    <View style={[styles.addMainContainer, globalStyles.shadow, { marginRight: 10, marginLeft: 10, marginTop: 10, marginBottom: 10 }, item.pickedImage !== '' && { backgroundColor: colors.TRANS }]}>
                        <TouchableOpacity onPress={() => onImagePickerClicked(index)}>
                            <Image style={globalStyles.img} source={item.icon} />
                        </TouchableOpacity>
                    </View>
                )
            })
        )
    }

    return (
        <View style={globalStyles.flex}>
            <Toolbar
                title={"Add Photos"}
                onBackPressed={() => props.navigation.goBack()}
            />
            <View style={[globalStyles.subContainer, { alignItems: 'center', width: DEVICE.DEVICE_WIDTH }]}>
                <View style={{ height: childrenHeight * 2.32 }}>
                    <AutoDragSortableView
                        // sortable={photosArray[0].pickedImage === '' ? false : true}
                        dataSource={photosArray}
                        parentWidth={DEVICE.DEVICE_WIDTH}
                        childrenWidth={childrenWidth}
                        marginChildrenBottom={hp('1%')}
                        marginChildrenRight={wp('2%')}
                        marginChildrenLeft={wp('2.5%')}
                        marginChildrenTop={hp('1%')}
                        childrenHeight={childrenHeight}
                        onDataChange={(data) => {
                            // setPhotosArray(data);

                            // console.log(data[fromIndex]);
                            // console.log({ fromIndex });
                            // console.log({ toIndex });
                            // console.log(data);
                            // if (data[fromIndex].pickedImage === '') {
                            //     // photosArray[toIndex].pickedImage = photosArray[fromIndex].pickedImage;
                            //     // photosArray[fromIndex].pickedImage = photosArray[fromIndex].pickedImage;
                            //     let refPhotosArray = [];
                            //     refPhotosArray.push(...photosArray);
                            //     setPhotosArray(refPhotosArray);
                            //     setUpdate(Math.floor(Math.random() * 100) + 1);
                            //     photosArray.sort(alphabetically(true))
                            //     console.log("Sorting : ", photosArray.sort(alphabetically(true)));

                            // } else {
                            //     setPhotosArray(data);
                            //     setUpdate(Math.floor(Math.random() * 100) + 1);
                            // }


                            data.sort(Util.imagesSorting());
                            setPhotosArray(data);
                            setUpdate(Math.floor(Math.random() * 100) + 1);
                        }}
                        keyExtractor={(item, index) => item.id}
                        // onDragEnd={(fromIndex, toIndex) => {
                        //     // setPhotosArray(photosArray);
                        //     // setUpdate(Math.floor(Math.random() * 100) + 1);

                        //     // console.log("fromIndex : ", fromIndex);
                        //     // console.log("toIndex : ", toIndex);
                        //     // console.log("fromIndex array : ", photosArray[fromIndex].pickedImage);
                        //     // console.log("toIndex array : ", photosArray[toIndex].pickedImage);
                        //     // setFromIndex(fromIndex);
                        //     // setToIndex(toIndex);
                        //     // // if (photosArray[toIndex].pickedImage === '') {
                        //     //     photosArray[fromIndex].pickedImage = photosArray[fromIndex].pickedImage;
                        //     //     photosArray[toIndex].pickedImage = '';
                        //     //     let refPhotosArray = [];
                        //     //     refPhotosArray.push(...photosArray);
                        //     //     setPhotosArray(refPhotosArray);
                        //     //     setUpdate(Math.floor(Math.random() * 100) + 1);
                        //     //     // setPhotosArray(photosArray);
                        //     //     // setUpdate(Math.floor(Math.random() * 100) + 1);
                        //     //     // console.log("photosArray : ", photosArray);
                        //     // }

                        // }}
                        renderItem={(item, index) => {
                            return (
                                // item.pickedImage ?
                                <View style={styles.addMainContainer}>
                                    {item.pickedImage === '' ?
                                        <TouchableOpacity onPress={() => onImagePickerClicked(index)}>
                                            <Image style={globalStyles.img} source={item.icon} />
                                        </TouchableOpacity> :
                                        <>
                                            <FastImage style={[globalStyles.img, { width: childrenWidth, height: childrenHeight, resizeMode: 'cover', borderRadius: hp('1.5%'), }]} source={item.pickedImage} />
                                            <TouchableOpacity style={styles.deleteIcon} onPress={() => {
                                                photosArray[index].pickedImage = '';
                                                photosArray[index].base64 = '';
                                                photosArray.splice(index, 1);
                                                photosArray.push({ icon: images.addPhoto, pickedImage: '', base64: '', id: 0 });
                                                let refPhotosArray = [];
                                                refPhotosArray.push(...photosArray);
                                                setPhotosArray(refPhotosArray);
                                                setUpdate(Math.floor(Math.random() * 100) + 1);
                                            }}>
                                                <Image style={[globalStyles.img, { height: hp('5%'), width: hp('5%'), }]} source={images.deletePhoto} />
                                            </TouchableOpacity>
                                        </>
                                    }
                                    {index === 0 && <Image style={[globalStyles.img, { height: hp('2.5%'), width: hp('2.5%'), position: 'absolute', bottom: hp('1%'), right: hp('1%') }]} source={images.profileIcon} />}
                                </View>)
                        }}
                    />
                </View>
                <Text style={[globalStyles.text, { color: colors.GREY3, fontSize: wp('4.5%'), marginLeft: wp('5%'), alignSelf: 'flex-start', }]}>Drag photos to reorder</Text>
                <Spacer space={hp('5%')} />
                <Text style={styles.flyText}>Fly your flag</Text>
                <PhoneTextInput
                    withFlag={true}
                    cca2={cca2}
                    selectCountry={async (value) => {
                        console.log("selected value : ", value);
                        setcca2(value.cca2);
                        setCountryName(value.name);
                        let flag = await getImage(value.cca2);
                        console.log("flag : ", flag);
                    }}
                />
                {/* <ScrollView horizontal> */}
                {/* <View style={{ flexDirection: 'row', backgroundColor: 'red', flexWrap: 'wrap', width: DEVICE.DEVICE_WIDTH }}> */}
                {/* <View style={[{ flexDirection: 'row', flexWrap: 'wrap', width: DEVICE.DEVICE_WIDTH, justifyContent: 'center', position: 'absolute', marginTop: hp('5.5%') }, globalStyles.absoluteTop]}>
                {renderScrollNullItem()}
            </View> */}
                {/* </ScrollView> */}
            </View>
            <View style={[globalStyles.subContainer, { flex: DEVICE_OS === 'android' ? 0.179 : isIphoneX() ? 0.18 : 0.2 }]}>
                <AppButton
                    disabled={(photosArray[0].pickedImage === '' && photosArray[1].pickedImage === '' && photosArray[2].pickedImage === '' && photosArray[3].pickedImage === '' && photosArray[4].pickedImage === '' && photosArray[5].pickedImage === '') || cca2 == ''}
                    title={'Next'}
                    onPress={() => dispatch(action.onNextToPreference(authReducers.authRequest, { cca2, countryName, photosArray }, props, authReducers.userDetails))} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    addMainContainer: {
        width: childrenWidth,
        height: childrenHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREY4,
        borderRadius: hp('1.5%')
    },
    deleteIcon: {
        position: 'absolute',
        top: -hp('1.5%'),
        right: -hp('1.5')
    },
    flyText: {
        fontFamily: fonts.VM,
        fontSize: wp('6.8%'),
        color: colors.RED
    }
})