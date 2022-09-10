//#region import 
//#region RN
import { StyleSheet } from 'react-native';
//#endregion
//#region common files
import { colors } from './colors';
import { fonts } from './fonts';
import { hp, wp, DEVICE_OS, DEVICE } from '../utils/constants';
//#endregion
//#region third party libs
import { getBottomSpace, getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper'
//#endregion
//#endregion

const globalStyles = StyleSheet.create({
  paddingTop: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + hp('2.5%')
      },
      {
        paddingTop: DEVICE_OS === 'ios' ? getStatusBarHeight() + hp('2.5%') : hp('2.5%')
      }
    )
  },
  paddingTopTabBar: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + hp('1.5%')
      },
      {
        paddingTop: DEVICE_OS === 'ios' ? getStatusBarHeight() + hp('1.5%') : hp('1.5%')
      }
    )
  },
  absoluteTop: {
    ...ifIphoneX(
      {
        top: getStatusBarHeight() + 15
      },
      {
        top: getStatusBarHeight()
      }
    )
  },
  subContainer: {
    flex: 1,
    width: wp('85%'),
    alignSelf: 'center'
  },
  flex: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    backgroundColor: colors.WHITE,
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + 15
      },
      {
        paddingTop: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
      }
    )
  },
  oneFlex: {
    flex: 1
  },
  bottomSpace: {
    ...ifIphoneX(
      {
        marginBottom: getBottomSpace()
      },
      {
        marginBottom: 13
      }
    )
  },
  img: {
    resizeMode: 'contain',
    height: wp('8%'),
    width: wp('8%'),
  },
  text: {
    fontFamily: fonts.VR,
    fontSize: wp('3%'),
    color: colors.DARK
  },
  shadow: {
    backgroundColor: colors.WHITE,
    shadowColor: colors.DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6
  },
  listItem: {
    padding: hp('2%'),
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: colors.GREY3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundImg: {
    resizeMode: 'cover',
    height: wp('9%'),
    width: wp('9%'),
    borderRadius: 50,
    // backgroundColor: 'red'
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardActions: {
    width: wp('78%'),
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
  },
  rowDevider: {
    width: wp('95%'),
    height: wp('0.2%'),
    backgroundColor: colors.GREY6
  },
  transPlaceholderView: {
    position: 'absolute',
    height: DEVICE.DEVICE_HEIGHT,
    width: DEVICE.DEVICE_WIDTH,
    backgroundColor: colors.BLACK_TRANSPARENT_OPTION
  }
})

export default globalStyles;