//#region imports
//#region RN
import { Platform } from 'react-native';
//#endregion
//#region common files
import Util from "../Utils";
import { APP_NAME } from '../utils/constants';
//#endregion
//#region third party libs
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
//#endregion
//#endregion
global.fcmToken = '';

class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNoitificationListeners(onRegister, onNotification, onOpenNotification)
    }
    checkPermission = async () => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.getToken();
                } else {
                    this.requestPermission();
                }
            }).catch(error => {
                console.log("Error", error)
            });
    }

    getToken = async () => {
        firebase.messaging().getToken()
            .then(fcmToken => {
                if (fcmToken) {
                    global.fcmToken = fcmToken;
                }
            }).catch(error => {
                console.log("getToken rejected ", error)
            })
    }

    requestPermission = async () => {
        firebase.messaging().requestPermission()
            .then(() => {
                this.getToken();
            }).catch(error => {
                console.log("Requested persmission rejected ", error)
            })
    }

    deletedToken = () => {
        firebase.messaging().deleteToken()
            .catch(error => {
                console.log("Delected token error ", error)
            })
    }

    createNotificationListeners = async (navigation) => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const localNotification = new firebase.notifications.Notification()
                .setNotificationId(notification._notificationId)
                .setTitle(notification._title)
                .setBody(notification._body)
                .setData(notification._data)
                .android.setSmallIcon("@mipmap/ic_launcher")
                .android.setChannelId(APP_NAME);

            const action = new firebase.notifications.Android.Action(
                "snooze",
                "ic_launcher",
                " "
            );
            action.setShowUserInterface(false);
            localNotification.android.addAction(action);

            const channel = new firebase.notifications.Android.Channel(
                APP_NAME,
                APP_NAME,
                firebase.notifications.Android.Importance.Max
            );
            firebase.notifications().android.createChannel(channel);
            firebase.notifications().displayNotification(localNotification).catch(err => console.error("NotificationERROR=====", err));
        });

        firebase.notifications().onNotificationDisplayed(notification => {
            if (Platform.OS == "ios") {
                firebase.notifications().getBadge()
                    .then(count => {
                        count++
                        firebase.notifications().setBadge(0)
                    })
                    .then(() => {
                    })
                    .catch(error => {
                    })
            }
        });
        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async (notificationOpen) => {
            const { title, body, type } = notificationOpen.notification._data;
            let notificationType = Platform.OS === 'android' ? type : notificationOpen.notification._data['gcm.notification.type'];
            try {
                if (notificationType !== undefined) {
                    if (notificationType === "3" || notificationType === "4" || notificationType === "6") {
                        navigation.navigate('WorkoutSet');
                    } else if (notificationType === "5") {
                        navigation.navigate('PerformanceScreen');
                    } else if (notificationType === "7") {
                        navigation.navigate('PerformanceScreenFree');
                    }
                }
            } catch (error) {
                console.log("Error : ", error);
            }
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body, type } = notificationOpen.notification._data;
            let notificationType = Platform.OS === 'android' ? type : notificationOpen.notification._data['gcm.notification.type'];
            try {
                const notificationId = await AsyncStorage.getItem('notificationId');
                if (notificationId !== notificationOpen.notification.notificationId) {
                    if (notificationType !== undefined) {
                        if (notificationType === "3" || notificationType === "4" || notificationType === "6") {
                            navigation.navigate('WorkoutSet');
                        } else if (notificationType === "5") {
                            navigation.navigate('PerformanceScreen');
                        } else if (notificationType === "7") {
                            navigation.navigate('PerformanceScreenFree');
                        }
                    }
                }
                Util.asyncStoreData("notificationId", notificationOpen.notification.notificationId)
            } catch (error) {
                console.log("Error : ", error);
            }
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            const localNotification = new firebase.notifications.Notification({
                show_in_foreground: false,
            })
                .setTitle(message._data.title)
                .setBody(message._data.body)
                .setData(message._data)
                .android.setSmallIcon("@mipmap/ic_launcher")
                .android.setColor("#ffffff")
                .android.setPriority(firebase.notifications.Android.Priority.High)
                .android.setChannelId(APP_NAME)
                .android.setAutoCancel(true)
                .android.setBadgeIconType(firebase.notifications.Android.BadgeIconType.Large)
                .setSound("default");

            const action = new firebase.notifications.Android.Action(
                "snooze",
                "ic_launcher",
                " "
            );
            action.setShowUserInterface(false);
            localNotification.android.addAction(action);

            const channel = new firebase.notifications.Android.Channel(
                APP_NAME,
                APP_NAME,
                firebase.notifications.Android.Importance.Max
            );
            firebase.notifications().android.createChannel(channel);
            firebase.notifications().displayNotification(localNotification).catch(err => console.error("NotificationERROR=====", err));
        });
    }

    buildChannel = (obj) => {
        return new firebase.notifications.Android.Channel(
            obj.channelId, obj.channelName,
            firebase.notifications.Android.Importance.High)
            .setDescription(obj.channelDes)
    }

    buildNotification = (obj) => {
        const localNotification = new firebase.notifications.Notification({
            //  show_in_foreground: false,
        })
            .setNotificationId(obj.dataId)
            .setTitle(obj.title)
            .setBody(obj.body)
            .setData(obj.data)
            .android.setSmallIcon("@mipmap/ic_launcher")
            .android.setLargeIcon("@mipmap/ic_launcher")
            .android.setColor("#ffffff")
            .android.setPriority(firebase.notifications.Android.Priority.High)
            .android.setChannelId(APP_NAME)
            .android.setAutoCancel(true)
            .android.setBadgeIconType(firebase.notifications.Android.BadgeIconType.Large)
            .setSound("default");

        const action = new firebase.notifications.Android.Action(
            "snooze",
            "ic_launcher",
            " "
        );
        action.setShowUserInterface(false);
        localNotification.android.addAction(action);

        const channel = new firebase.notifications.Android.Channel(
            APP_NAME,
            APP_NAME,
            firebase.notifications.Android.Importance.Max
        );
        firebase.notifications().android.createChannel(channel);
        firebase.notifications().displayNotification(localNotification).catch(err => console.error("Notification Error", err));
    }

    scheduleNotification = (scheduleTime, setNumber) => {
        let notification = new firebase.notifications.Notification();
        notification
            .setSound("default")
            .setNotificationId("SUMMARY_ID")
            .setTitle("Test schedule notifications 🔥")
            .setData({
                title: "value1",
                body: "value2"
            });
        if (Platform.OS === "android") {
            notification.android
                .setChannelId(APP_NAME)
                .android.setPriority(firebase.notifications.Android.Priority.Max);
        }
        firebase
            .notifications()
            .scheduleNotification(notification, {
                fireDate: scheduleTime
            })
            .catch(err => console.log(err));
    }

    displayNotification = (notification) => {
        firebase.notifications().displayNotification(notification)
            .catch(error => { console.log("Display Notification error", error) })
    }

    removeDelieveredNotification = (notification) => {
        firebase.notifications()
            .removeDeliveredNotification(notification.notificationId)
    }
}
export const fcmService = new FCMService()