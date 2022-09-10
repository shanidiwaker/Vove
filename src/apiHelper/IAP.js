//#region import
//#region RN
import { Platform, Alert } from "react-native";
//#endregion
//#region common files
import { POST } from "./ApiService";
import Util from "../utils/utils";
//#endregion
//#region third party libs
import RNIap from 'react-native-iap';
import Toast from 'react-native-simple-toast';
//#endregion
//#endregion

const itemSkus = Platform.select({
    ios: ['ios_id'],
    android: ['android_id']
});

export const productPurchase = async (userDetails, navigation, callBack) => {
    try {
        if (Platform.OS == "ios") {
            RNIap.getProducts(itemSkus).then(async (products) => {
                let Product_ID = products[0].productId;
                RNIap.requestSubscription(Product_ID).then(async (purchase) => {
                    makeProUser(userDetails, 1, navigation, "productPurchase", callBack);
                }).catch((error) => {
                    console.log(error);
                })
            });
        }
        if (Platform.OS == "android") {
            RNIap.getSubscriptions(itemSkus).then((products => {
                try {
                    let Product_ID = products[0].productId;
                    RNIap.requestSubscription(Product_ID).then(purchase => {
                        makeProUser(userDetails, 1, navigation, "productPurchase", callBack);
                        // makeProUser(Product_ID, purchase.transactionId, products[index].price)
                    }).catch((error) => {
                        console.log("------error-----", error)
                    })
                } catch (error) {
                    alert('Invalid ProductId');
                }

            }))
        }
    } catch (err) {
        console.log(err);
    }
}

const makeProUser = async (userDetails, status, navigation, type, callBack) => {
    let requestBody = {
        "user_id": userDetails.id,
        "value": status
    }
    await POST(make_pro_user, requestBody, function (response) {
        if (response.status === "0") {
            userDetails.pro_status = status === 1 ? true : false;
            Util.asyncStoreData("objLogin", JSON.stringify(userDetails));
            callBack(userDetails);
            // type === "productPurchase" && navigation.replace('PerformanceScreen');
        }
        else {
            Toast.show(response.responseData.message);
        }
    })
}

export const isSubscriptionActiveAndRestore = async (userDetails, callBack) => {
    if (Platform.OS === 'ios') {
        const latestReceipt = await RNIap.getReceiptIOS();
        if (latestReceipt !== undefined || latestReceipt !== '') {
            const decodedReceipt = await RNIap.validateReceiptIos({
                'receipt-data': latestReceipt,
                password: IAP_password
            }, false);
            try {
                const { latest_receipt_info: latestReceiptInfo } = decodedReceipt;
                const isSubValid = !!latestReceiptInfo.find(receipt => {
                    const expirationInMilliseconds = Number(receipt.expires_date_ms);
                    const nowInMilliseconds = Date.now();
                    return expirationInMilliseconds > nowInMilliseconds;
                });
                if (isSubValid) {
                    Alert.alert('Restore Successful', 'You successfully restored purchase ');
                    makeProUser(userDetails, 1, null, "RestorePurchase", callBack);
                }
                else {
                    Alert.alert('Alert', "You have to required subscription again");
                }
            } catch (error) {
                console.log("Error : ", error);
            }
        } else {
            Alert.alert('Alert', "You have'nt subscribed any product yet.");
        }
    }

    if (Platform.OS === 'android') {
        const availablePurchases = await RNIap.getAvailablePurchases();
        const sortedAvailablePurchases = availablePurchases.sort(
            (a, b) => b.transactionDate - a.transactionDate
        );
        console.log("sortedAvailablePurchases : ", sortedAvailablePurchases);
        if (sortedAvailablePurchases.length > 0) {
            // if consumable again
            RNIap.consumePurchaseAndroid(sortedAvailablePurchases[0].purchaseToken).then(val => {
                if (val) {
                    Alert.alert('Restore Successful', 'You successfully restored purchase');
                }
            })
            // if not consumable again
            RNIap.acknowledgePurchaseAndroid(sortedAvailablePurchases[0].purchaseToken).then(val => {
                if (val) {
                    Alert.alert('Restore Successful', 'You successfully restored purchases');
                }
            })
        }
    } else {
        Alert.alert('Alert', "You have'nt subscribed any product yet.");
    }
}