import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {GpsStatusIcon} from "@/components/Icons";

const GpsIndicator = () => {
    return (
        <View style={styles.container}>
            <Text>GPS</Text>
            <GpsStatusIcon />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "white",
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
    }
})

export default GpsIndicator;