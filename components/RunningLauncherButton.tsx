import {StyleSheet, View} from "react-native";

const RunningLauncherButton = () => {
    return (
        <View style={styles.container}></View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#5D63D1',
        maxHeight: 64,
    }
})

export default RunningLauncherButton;