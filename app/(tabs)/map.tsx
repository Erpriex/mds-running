import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useRun } from '@/contexts/RunContext';
import { useRouter } from 'expo-router';
import {ArrowLeftReturnIcon} from "@/components/Icons";
import GpsIndicator from "@/components/GpsIndicator";

type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const MapScreen = () => {
    const [location, setLocation] = useState<LocationType | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();
    const { timeElapsed, steps, distance, calories, stopRun, saveRun, resetRun } = useRun();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const handleStop = () => {
        stopRun();
        /*saveRun({
            timeElapsed,
            steps,
            distance,
            calories,
            date: new Date().toISOString(), // Date de fin de la course
        }).then(r => {});*/
        resetRun();
        router.push('/');
    };

    const handleReturnToHome = () => {
        router.push('/');
    };

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.container}>
                <Text>Chargement de la localisation...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                region={location}
                showsUserLocation
                showsMyLocationButton
            />
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={handleReturnToHome}>
                    <ArrowLeftReturnIcon />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Current jogging</Text>
                <GpsIndicator />
            </View>
            <View style={styles.infoContainer}>
                <Text>Temps : {formatTime(timeElapsed)}</Text>
                <Text>Pas : {steps}</Text>
                <Text>Distance : {(distance / 1000).toFixed(2)} km</Text>
                <Text>Calories : {calories.toFixed(1)} kcal</Text>
            </View>
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
                <Text style={styles.stopButtonText}>Arrêter la course</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 64,
        paddingHorizontal: 24,
    },
    screenTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#333',
    },
    infoContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
    },
    stopButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -100 }],
        width: 200,
        height: 50,
        backgroundColor: '#FF3B30',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MapScreen;
