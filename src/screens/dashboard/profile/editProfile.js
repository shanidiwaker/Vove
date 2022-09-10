//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, TextInput, Image, StyleSheet, Keyboard, ScrollView, KeyboardAvoidingView, findNodeHandle } from 'react-native';
//#endregion
//#region third party libs
var countries = require('country-data').countries;
import { isIphoneX } from 'react-native-iphone-x-helper';
import { AutoDragSortableView } from 'react-native-drag-sort';
import * as ImagePickers from "react-native-image-picker";
import ImagePicker from 'react-native-image-crop-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { UseKeyboard } from '../../../components/UseKeyboard';
import { BASE_URL } from '../../../apiHelper/APIs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../../../redux/actions/authActions';
//#endregion
//#region common files
import Util from '../../../utils/utils';
import globalStyles from '../../../res/globalStyles';
import OnBackPressed from '../../../components/OnBackPressed';
import { Toolbar } from '../../../components/Toolbar';
import { images } from '../../../res/images';
import { DEVICE, DEVICE_OS, hp, wp } from '../../../utils/constants';
import { colors } from '../../../res/colors';
import { Spacer } from '../../../res/spacer';
import { fonts } from '../../../res/fonts';
import { DetailsTextInput } from '../../../components/DetailsTextInput';
import { PhoneTextInput } from '../../../components/PhoneTextInput';
//#endregion
//#endregion
const childrenWidth = wp('27%');
const childrenHeight = wp('27%');


export default editProfile = (props) => {
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
    const [deletePhotos, setDeletePhotos] = useState([]);
    const [isInitial, setIsInitial] = useState(false);
    const [update, setUpdate] = useState('a');
    const [cca2, setcca2] = useState(authReducers.userDetails?.fly_country_code);
    const [countryName, setCountryName] = useState(countries[authReducers.userDetails?.fly_country_code].name);
    const [bio, setBio] = useState(authReducers.userDetails?.bio_content);
    const [height, setHight] = useState(0);
    const [multilineHeight, setMultilineHeight] = useState(hp('10%'));
    const [currentScrollY, setCurrentScrollY] = useState(0);
    const [usedLines, setUsedLines] = useState(0);
    const [nativeEvent, setNativeEvent] = useState(null);
    const [scrollToY, setScrollToY] = useState('');
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);
    const [keyboardHeight] = UseKeyboard();
    //#endregion local state
    //#region ref    
    let scrollRef = useRef();
    let viewRef = useRef();
    //#endregion ref

    useEffect(() => {
        // DEVICE_OS === 'ios' && viewRef.measureInWindow((x, y, width, height) => {
        //     setScrollToY(y);
        // });
        isInitial === false &&
            authReducers.userDetails?.user_photos !== null &&
            authReducers.userDetails?.user_photos.forEach((element, index) => {
                if (element !== '') {
                    photosArray[index].pickedImage = { uri: BASE_URL + '/' + element.user_photo };
                    photosArray[index].imageLink = element.user_photo;
                    setUpdate(element.user_photo);
                    setIsInitial(true);
                }
            });
    }, [[photosArray]]);

    const onImagePickerClicked = (index, type) => {
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
            if (type === undefined) {
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
            } else {
                photosArray[index].pickedImage = { uri: image.path };
                photosArray[index].base64 = image.data;
            }
            setPhotosArray(photosArray);
            setUpdate(image.path);
        });
    }
    const scrollToItem = (itemToScroll) => {
        if (itemToScroll && scrollRef) {
            itemToScroll.measureLayout(
                findNodeHandle(scrollRef), (x, y) => {
                    try {
                        scrollRef.scrollTo({ x: 0, y: y + multilineHeight, animated: true });
                    } catch (error) {
                        console.log({ error });
                    }

                });
        }
    }
    return (
        <ScrollView
            ref={(ref) => { scrollRef = ref }}
            bounces={false}
            style={globalStyles.flex}
            // style={[globalStyles.flex, DEVICE_OS === 'ios' && keyboardHeight !== 0 && { marginBottom: keyboardHeight - 60 }]}
            keyboardShouldPersistTaps={'handled'}
            scrollEnabled={isScrollEnabled}
            onScroll={({ nativeEvent }) => {
                setCurrentScrollY(nativeEvent.contentOffset.y);
                // if (Util.isCloseToBottom(nativeEvent)) {
                //     console.log("is End");
                // } else {
                //     console.log('not end');
                // }
            }}
            scrollEventThrottle={400}>
            <OnBackPressed />
            <Toolbar
                isShadowLine={true}
                isBackDisable={true}
                title={'Edit Profile'}
                isRightIcon={images.done}
                onRightIconPressed={() => dispatch(action.onUpdateProfile(props, authReducers.userDetails, { deletePhotos, cca2, countryName, bio, photosArray }))} />

            <View style={[globalStyles.subContainer, { alignItems: 'center', width: DEVICE.DEVICE_WIDTH }]}>
                <View style={{ backgroundColor: colors.GREY5 }}>
                    <Spacer space={hp('1%')} />
                    <View style={{ height: childrenHeight * 2.32 }}>
                        <AutoDragSortableView
                            dataSource={photosArray}
                            parentWidth={DEVICE.DEVICE_WIDTH}
                            childrenWidth={childrenWidth}
                            marginChildrenBottom={hp('1%')}
                            marginChildrenRight={wp('2%')}
                            marginChildrenLeft={wp('2.5%')}
                            marginChildrenTop={hp('1%')}
                            childrenHeight={childrenHeight}
                            onDragStart={() => setIsScrollEnabled(false)}
                            onDragEnd={() => setIsScrollEnabled(true)}
                            onDataChange={(data) => {
                                data.sort(Util.imagesSorting());
                                setPhotosArray(data);
                                setUpdate(Math.floor(Math.random() * 100) + 1);
                            }}
                            keyExtractor={(item, index) => item.id}
                            renderItem={(item, index) => {
                                return (
                                    <View style={styles.addMainContainer}>
                                        {item.pickedImage === '' ?
                                            <TouchableOpacity onPress={() => onImagePickerClicked(index)}>
                                                <Image style={globalStyles.img} source={item.icon} />
                                            </TouchableOpacity> :
                                            <>
                                                <FastImage style={[globalStyles.img, { width: childrenWidth, height: childrenHeight, resizeMode: 'cover', borderRadius: hp('1.5%'), }]} source={item.pickedImage} />
                                                <TouchableOpacity style={styles.deleteIcon} onPress={() => {
                                                    let countEmptyImage = [];
                                                    photosArray.forEach(element => element.pickedImage !== '' && countEmptyImage.push(element));
                                                    console.log({ countEmptyImage });
                                                    if (countEmptyImage.length === 1) {
                                                        onImagePickerClicked(index, 'delete');
                                                    } else {
                                                        photosArray[index].imageLink !== undefined && deletePhotos.push(photosArray[index].imageLink);
                                                        photosArray[index].pickedImage = '';
                                                        photosArray[index].base64 = '';
                                                        authReducers.userDetails?.user_photos.splice(index, 1);
                                                        photosArray.splice(index, 1);
                                                        photosArray.push({ icon: images.addPhoto, pickedImage: '', base64: '', id: 0 });
                                                        let refPhotosArray = [];
                                                        refPhotosArray.push(...photosArray);
                                                        setPhotosArray(refPhotosArray);
                                                        setUpdate(Math.floor(Math.random() * 100) + 1);
                                                    }
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
                    <Spacer space={hp('1%')} />
                </View>
                <View style={styles.storyContainer}>
                    <Text style={[globalStyles.text, styles.storyTxt]}>My Story</Text>
                    <PhoneTextInput
                        withFlag={true}
                        isProfile={true}
                        cca2={cca2}
                        selectCountry={async (value) => {
                            setcca2(value.cca2);
                            setCountryName(value.name);
                        }}
                    />
                </View>
                {/* <Spacer space={DEVICE_OS === 'android' ? usedLines >= 3 ? wp('3%') : wp('1.5%') : wp('0.4%')} /> */}
                <Spacer space={DEVICE_OS === 'android' ? wp('1.5%') : wp('0.4%')} />
                <DetailsTextInput
                    refs={(ref) => { viewRef = ref }}
                    maxLength={550}
                    onFocus={() => DEVICE_OS === 'ios' && scrollRef.scrollToEnd({ animated: true })}
                    // onFocus={() => scrollToItem(viewRef)}
                    // onLayout={(e) => {
                    //     if (DEVICE_OS === 'android') {
                    //         if (height < e.nativeEvent.layout.height) {
                    //             setUsedLines(usedLines + 1);
                    //         }
                    //         if (height > e.nativeEvent.layout.height) {
                    //             setUsedLines(usedLines - 1);
                    //         }
                    //         if (height != e.nativeEvent.layout.height) {
                    //             setHight(e.nativeEvent.layout.height);
                    //         }
                    //     }
                    // }}
                    type={'multiLine'}
                    placeTxt={'About me'}
                    value={bio}
                    onChangeText={(input) => {
                        if (input.length <= 550) {
                            setBio(input);
                        } else {
                            setTimeout(() => {
                                setBio(bio)
                            }, 1);
                        }
                    }}
                    // multilineStyle={{ height: multilineHeight }}
                    // multilineStyle={{ height: DEVICE.DEVICE_HEIGHT - keyboardHeight }}
                    onContentSizeChange={(e) => {
                        // console.log("e.nativeEvent.contentSize.height  : ", e.nativeEvent.contentSize.height);
                        // setMultilineHeight(e.nativeEvent.contentSize.height < 60 ? 60 : e.nativeEvent.contentSize.height);
                        // scrollToItem(viewRef);
                        DEVICE_OS === 'ios' && currentScrollY !== 0 && scrollRef.scrollTo({ x: 0, y: currentScrollY + wp('7.6%'), animated: false });
                        // setTimeout(() => {

                        // viewRef.measureLayout(
                        //     findNodeHandle(scrollRef), (x, y) => {
                        //         scrollRef.scrollTo({ x: 0, y: y + e.nativeEvent.contentSize.height, animated: true });
                        //     });
                        // }, 200);
                        // this.updateSize(
                        //     Platform.OS === 'ios'
                        //         ? e.nativeEvent.contentSize.height
                        //         : e.nativeEvent.contentSize.height - 20
                        // )
                    }}
                />
                <Spacer space={wp('8%')} />
                {/* {DEVICE_OS === 'ios' &&
                        <View style={{ height: 5 }}
                            // onLayout={({ nativeEvent }) => setNativeEvent(nativeEvent.layout)}
                            // onLayout={({ nativeEvent }) => console.log("nativeEvent  view: ", nativeEvent)}
                            ref={(ref) => { viewRef = ref }} />} */}

            </View>
            {DEVICE_OS === 'ios' && <KeyboardSpacer />}
            {/* {DEVICE_OS === 'ios' && <View style={[keyboardHeight !== 0 && { height: wp('18%') }]} />} */}
        </ScrollView>
    );
};

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
    },
    storyContainer: {
        backgroundColor: colors.DARK_HEADER,
        width: DEVICE.DEVICE_WIDTH,
        padding: wp('5%'),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    storyTxt: {
        fontFamily: fonts.VM,
        fontSize: wp('5.6%'),
        color: colors.WHITE,
        position: 'absolute',
        left: wp('5%'),
        bottom: hp('1.6%')
    }
})