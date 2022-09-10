//#region import
import React from "react";
import { View } from "react-native";
//#endregion

export const Spacer = ({ space, row }) => {
    return (
        <View style={{
            marginVertical: space && space,
            marginHorizontal: row && row
        }} />
    )
};