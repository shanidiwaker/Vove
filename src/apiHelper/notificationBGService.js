//#region imports
//#region common files
import { APP_NAME } from "../utils/constants";
//#endregion
//#region third party libs
import firebase from "react-native-firebase";
import type { NotificationOpen } from "react-native-firebase";
//#endregion
//#endregion

export default async (message: NotificationOpen) => {
    const localNotification = new firebase.notifications.Notification({
        //  show_in_foreground: false,
    })
        .setTitle(message.data.title)
        .setBody(message.data.body)
        .setData(message.data)
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
    firebase.notifications().displayNotification(localNotification).catch(err => console.error("NotificationERROR=====", err));

    return Promise.resolve(message);
};