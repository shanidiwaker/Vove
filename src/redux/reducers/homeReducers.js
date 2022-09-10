import {
    UPDATE_USER_STAYS,
    ADD_STAYS,
    SELECTED_STAYS,
    CURRENT_MEMBER,
    CONNECT_USER_RESPONSE,
    IS_MEMBER_CHANGED,
    CURRENT_MEMBER_IMAGE,
    IS_DELETE_MODAL_VISIBLE
} from "../actionTypes/homeActionTypes";

const initialData = {
    userStays: [],
    isAddStays: false,
    selectedStays: '',
    currentMemberDetails: {
        memberCurrentIndex: 0
    },
    connectUserResponse: '',
    isMemberChanged: false,
    currentMemberImage: 0,
    isDeleteModalVisible: false
};

const homeReducers = (state = initialData, action) => {
    switch (action.type) {
        case UPDATE_USER_STAYS:
            return {
                ...state,
                userStays: action.userStays
            }
        case ADD_STAYS:
            return {
                ...state,
                isAddStays: action.isAddStays
            }
        case SELECTED_STAYS:
            return {
                ...state,
                selectedStays: action.selectedStays
            }
        case CURRENT_MEMBER:
            return {
                ...state,
                currentMemberDetails: action.currentMemberDetails
            }
        case CONNECT_USER_RESPONSE:
            return {
                ...state,
                connectUserResponse: action.connectUserResponse
            }
        case IS_MEMBER_CHANGED:
            return {
                ...state,
                isMemberChanged: action.isMemberChanged
            }
        case CURRENT_MEMBER_IMAGE:
            return {
                ...state,
                currentMemberImage: action.currentMemberImage
            }
        case IS_DELETE_MODAL_VISIBLE:
            return {
                ...state,
                isDeleteModalVisible: action.flag
            }
        default:
            return state;
    }
};
export default homeReducers;