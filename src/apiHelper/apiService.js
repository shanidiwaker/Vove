//#region import
//#region common files
import { CHECKMOBI_APIKEY } from "../utils/constants";
//#endregion
//#region third party libs
import axios from "react-native-axios";
const qs = require('qs');
//#endregion
//#endregion

export const GET = (url, type, callBack, accessToken) => {
    var requestOptions;
    if (type !== undefined) {
        requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", accessToken);
        requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    }

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(function (response) {
            if (type === 'Tomtom') {
                callBack(JSON.parse(response));
            } else {
                let responseData = JSON.parse(response);
                callBack({ status: responseData.status, responseData });
            }
        })
        .catch(function (error) {
            console.log(error);
            callBack({ status: false, error });
        });
}

export const POST = (url, requestBody, callBack, accessToken, isCheckMobi) => {
    var requestOptions;
    if (isCheckMobi !== undefined) {
        requestOptions = {
            method: 'POST',
            body: requestBody,
            headers: {
                'Authorization': CHECKMOBI_APIKEY,
                'Content-Type': "application/json"
            }
        };
    }
    else {
        if (accessToken !== undefined) {
            requestOptions = {
                method: 'POST',
                body: requestBody,
                headers: {
                    'authorization': accessToken,
                    'Accept': "application/json",
                    "Content-Type": "application/json"
                }
            };
        } else {
            requestOptions = {
                method: 'POST',
                body: requestBody,
                headers: {
                    'Accept': "application/json"
                }
            };
        }
    }
    fetch(url, requestOptions)
        .then(response => response.text())
        .then(function (response) {
            try {
                let jsonResponse = JSON.parse(response);
                let responseBody;
                isCheckMobi !== undefined ?
                    responseBody = {
                        status: jsonResponse.error ? false : true,
                        response: jsonResponse
                    } :
                    responseBody = {
                        status: jsonResponse.status === undefined ? false : jsonResponse.status,
                        response: jsonResponse
                    };
                callBack(responseBody);
            } catch (error) {
                let responseBody = {
                    status: false,
                    response
                };
                callBack(responseBody);
            }
        })
        .catch(function (error) {
            let responseBody = {
                status: false,
                response: jsonResponse
            }
            callBack(responseBody);
        })
}

export const DELETE = (url, type, callBack, accessToken) => {
    var requestOptions;
    if (type !== undefined) {
        requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };
    } else {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", accessToken);
        requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
    }

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(function (response) {
            if (type === 'Tomtom') {
                callBack(JSON.parse(response));
            } else {
                let responseData = JSON.parse(response);
                callBack({ status: responseData.status, responseData });
            }
        })
        .catch(function (error) {
            console.log(error);
            callBack({ status: false, error });
        });
}

export const AXIOS_ALL = (function1, function2, callBack) => {
    axios.all([function1, function2])
        .then(axios.spread(function (acct, perms) {
            // Both requests are now complete
        }));
}