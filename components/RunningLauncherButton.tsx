import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import {useRun} from "@/contexts/RunContext";
import {useRouter} from "expo-router";

const RunningLauncherButton = () => {
    const router = useRouter();
    const { timeElapsed, startRun, isRunning } = useRun();

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const handlePress = () => {
        if(!isRunning) {
            startRun();
        }
        router.push('/map')
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <Text style={styles.text}>
                {isRunning ? `Course en cours : ${formatTime(timeElapsed)}` : 'Démarrer une course'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        borderRadius: 30,
        backgroundColor: '#5D63D1',
        maxHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter-Bold',
    },
});

export default RunningLauncherButton;
