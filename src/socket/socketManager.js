import io from 'socket.io-client';
import Logger from './logger';
import { getData } from '../utils/asyncStorageHelper';
import { SOCKET_BASE_URL } from '../apiHelper/APIs';

const EVENT_CHAT_SCREEN = 'ChatScreenListEvent';
const EVENT_READ_MESSAGE = 'readMessage';
const EVENT_SEND_MESSAGE = 'sendMessage';
const EVENT_NEW_MESSAGE_EVENT = 'newMessageEvent';

global.userDetails = {};

class SocketManager {
    constructor() {
        if (SocketManager.instance) {
            return SocketManager.instance;
        }
        SocketManager.instance = this;
        getData('userDetails', ((userDetails) => {
            console.log("userDetails : ", userDetails);
            global.userDetails = userDetails;
            this.socket = io.connect(SOCKET_BASE_URL, {
                extraHeaders: { Authorization: userDetails.access_token },
                transports: ['polling', 'websocket'],
                jsonp: false,
            })
        }));
    }

    // Listen Event
    listenChatScreen = (callback = () => null) => {
        this.socket.on(EVENT_CHAT_SCREEN + '_' + global.userDetails.id, (data) => {
            Logger.instance.log(`${EVENT_CHAT_SCREEN + '_' + global.userDetails.id} :`, data);
            return callback(data);
        });
    }

    listenNewMessage = (receiverId, callback = () => null) => {
        this.socket.on(EVENT_NEW_MESSAGE_EVENT + '_' + global.userDetails.id + "_" + receiverId, (data) => {
            Logger.instance.log(`${EVENT_NEW_MESSAGE_EVENT + '_' + global.userDetails.id + "_" + receiverId} :`, data);
            return callback(data);
        });
    }

    // Remove Event
    listenNewMessageOFF = (receiverId) => {
        this.socket.off(EVENT_NEW_MESSAGE_EVENT + '_' + global.userDetails.id + "_" + receiverId);
    }

    //Emit Event
    emitReadMessage = ({ sender, receiver }) => {
        this.socket.emit(EVENT_READ_MESSAGE, { sender, receiver });
        Logger.instance.log(`${EVENT_READ_MESSAGE} :`, { sender, receiver });
    }
    emitSendMessage({ sender, receiver, message_type, message, timezone }) {
        this.socket.emit(EVENT_SEND_MESSAGE, { sender, receiver, message_type, message, timezone });
        Logger.instance.log(`${EVENT_SEND_MESSAGE} :`, { sender, receiver, message_type, message, timezone });
    }
}
export default SocketManager