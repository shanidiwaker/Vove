import {
    ON_CHATLIST_ITEM_CLICKED,
    ON_LISTEN_CHAT_SCREEN,
    ON_GET_CONVERSION,
    IS_RETRY,
    IS_RETRY_FROM
} from "../actionTypes/chatActionTypes";

const initialData = {
    newConnection: [
        { id: 0 },
        { id: 1, profilePic: 'users/j1CrC6PYsl.png' },
        { id: 2, profilePic: 'users/YWUtDAJygJ.png' },
        { id: 3, profilePic: 'users/kKk4FGhM4Z.png' },
        { id: 4, profilePic: 'users/0md487hFPF.png' },
        { id: 5, profilePic: 'users/bk6QgsBjPa.png' },
        { id: 6, profilePic: 'users/0md487hFPF.png' },
        { id: 7, profilePic: 'users/bXB5umgOcP.png' },
        { id: 8, profilePic: 'users/bk6QgsBjPa.png' },
    ],
    chatList: [
        { id: 0, name: 'Gina', countryCode: 'AU', profilePic: 'users/j1CrC6PYsl.png', lastMessage: 'Hi I see you are going to Melbourn', isRead: false },
        { id: 0, name: 'Alex', countryCode: 'AU', profilePic: 'users/YWUtDAJygJ.png', lastMessage: 'Bondi has board rentals near by me', isRead: true },
        { id: 0, name: 'Mckenzie', countryCode: 'AU', profilePic: 'users/kKk4FGhM4Z.png', lastMessage: 'Hi I see you are going to Melbourn', isRead: true },
        { id: 0, name: 'Charlie', countryCode: 'AU', profilePic: 'users/0md487hFPF.png', lastMessage: 'When do you go to the gallery', isRead: false },
        { id: 0, name: 'Virat', countryCode: 'IN', profilePic: 'users/bk6QgsBjPa.png', lastMessage: 'Hi, Virat. How are you?', isRead: true },
        { id: 0, name: 'Rohit', countryCode: 'IN', profilePic: 'users/bXB5umgOcP.png', lastMessage: 'Hi I see you are going to Melbourn', isRead: true },
        { id: 0, name: 'Dhoni', countryCode: 'IN', profilePic: 'users/j1CrC6PYsl.png', lastMessage: 'Hi I see you are going to Melbourn', isRead: true },
    ],
    selectedChatItem: {},
    messages: {
        data: [
            { id: 0, message: 'I’m trying to get into surfing I saw in your photos that you surf in Melbourne.\n\nDo you know where I can rent a surfboard?', isRecive: true, Date: 'Fri, 9 Feb', time: '9:25 AM', isNotSent: false },
            { id: 1, message: 'I heard --- has rentals', isRecive: true, Date: 'Fri, 9 Feb', time: '9:25 AM', isNotSent: false },
            { id: 1, message: 'I heard Bondi has rentals', isRecive: false, Date: '', time: '9:25 AM', isNotSent: false },
            { id: 2, message: 'That’s great, It will be fun. I can’t wait!', isRecive: true, isNotSent: false },
            { id: 3, message: 'Looks good', isRecive: false, isNotSent: false },
            { id: 3, message: 'Yep', isRecive: true, isNotSent: false },
            { id: 3, message: 'Thank You!', isRecive: false, isNotSent: false },
            { id: 3, message: 'Thank You!', isRecive: false, isNotSent: true },

        ]
    },
    chatScreenData: {},
    conversion: {},
    isRetry: false,
    isRetryFrom: ''
};

const chatReducers = (state = initialData, action) => {
    switch (action.type) {
        case ON_CHATLIST_ITEM_CLICKED:
            return {
                ...state,
                selectedChatItem: action.item
            }
        case ON_LISTEN_CHAT_SCREEN:
            return {
                ...state,
                chatScreenData: action.payload
            }
        case ON_GET_CONVERSION:
            return {
                ...state,
                conversion: action.payload
            }
        case IS_RETRY:
            return {
                ...state,
                isRetry: action.flag,
                isRetryFrom: action.from
            }
        case IS_RETRY_FROM:
            return {
                ...state,
                isRetryFrom: action.from
            }
        default:
            return state;
    }
};
export default chatReducers;