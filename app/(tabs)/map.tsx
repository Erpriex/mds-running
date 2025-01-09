import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useRun } from '@/contexts/RunContext';
import { useRouter } from 'expo-router';
import { ArrowLeftReturnIcon, RunPauseIcon } from '@/components/Icons';
import GpsIndicator from '@/components/GpsIndicator';

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
    const { timeElapsed, steps, distance, calories, stopRun, resetRun } = useRun();

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
                <View style={styles.infoContainerHeader}>
                    <View>
                        <Text style={styles.runningTimeTitle}>Running time</Text>
                        <Text style={styles.runningTimeValue}>{formatTime(timeElapsed)}</Text>
                    </View>
                    <TouchableOpacity onPress={handleStop}>
                        <RunPauseIcon />
                    </TouchableOpacity>
                </View>
                <View style={styles.infoContentContainer}>
                    <View style={styles.infoCellContainer}>
                        <Image
                            style={styles.infoCellImg}
                            source={require('@/assets/images/runner.png')}
                        />
                        <View>
                            <Text style={styles.infoCellValue}>{(distance / 1000).toFixed(2)}</Text>
                            <Text style={styles.infoCellUnit}>km</Text>
                        </View>
                    </View>
                    <View style={styles.infoCellContainer}>
                        <Image
                            style={styles.infoCellImg}
                            source={require('@/assets/images/fire.png')}
                        />
                        <View>
                            <Text style={styles.infoCellValue}>{calories.toFixed(1)}</Text>
                            <Text style={styles.infoCellUnit}>kcal</Text>
                        </View>
                    </View>
                    <View style={styles.infoCellContainer}>
                        <Image
                            style={styles.infoCellImg}
                            source={require('@/assets/images/lightning.png')}
                        />
                        <View>
                            <Text style={styles.infoCellValue}>{steps}</Text>
                            <Text style={styles.infoCellUnit}>pas</Text>
                        </View>
                    </View>
                </View>
            </View>
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
        position: 'absolute',
        top: 60, // Ajuste légèrement sous la barre de statut
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 10,
    },
    screenTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'white',
    },
    infoContainer: {
        position: 'absolute',
        bottom: 100,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        elevation: 5,
    },
    infoContainerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    runningTimeTitle: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#333',
    },
    runningTimeValue: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 28,
        color: '#333',
    },
    infoContentContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#F3F7FF',
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 13,
    },
    infoCellContainer: {
        flexDirection: 'row',
        gap: 12,
        height: 60,
        alignItems: 'center',
    },
    infoCellImg: {
        width: 30,
        height: 30,
    },
    infoCellValue: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 17,
        color: '#333',
    },
    infoCellUnit: {
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        color: '#333',
    },
});

export default MapScreen;
