import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRun } from '@/contexts/RunContext';
import { useRouter } from 'expo-router';
import {ArrowLeftReturnIcon, RunPauseIcon, RunPointStartMapIcon} from '@/components/Icons';
import GpsIndicator from '@/components/GpsIndicator';

type LocationType = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

export type CoordinateType = {
    latitude: number;
    longitude: number;
};

const MapScreen = () => {
    const [location, setLocation] = useState<LocationType | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<CoordinateType[]>([]);
    const router = useRouter();
    const { timeElapsed, steps, distance, calories, stopRun, resetRun, saveRun, triggerRefresh } = useRun();

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            const initialPosition = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            setLocation(initialPosition);
            setRouteCoordinates([{ latitude: initialPosition.latitude, longitude: initialPosition.longitude }]);

            locationSubscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, distanceInterval: 5 },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;

                    setLocation((prev) => ({
                        ...prev!,
                        latitude,
                        longitude,
                    }));

                    setRouteCoordinates((prev) => [
                        ...prev,
                        { latitude, longitude },
                    ]);
                }
            );
        })();

        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    const simulateMovement = () => {
        if (!location) return;

        const newLatitude = location.latitude + 0.0001;
        const newLongitude = location.longitude + 0.0001;

        const newLocation = {
            ...location,
            latitude: newLatitude,
            longitude: newLongitude,
        };

        setLocation(newLocation);
        setRouteCoordinates((prev) => [
            ...prev,
            { latitude: newLatitude, longitude: newLongitude },
        ]);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    const handleStop = async () => {
        stopRun();

        const runData = {
            timeElapsed,
            steps,
            distance,
            calories,
            date: new Date().toISOString(),
            routeCoordinates,
        };

        await saveRun(runData);

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });

        setRouteCoordinates([]);
        resetRun();
        triggerRefresh();
        router.push('/');
    };

    const handleReturnToHome = () => {
        router.push('/');
    };

    if (!location) {
        return (
            <View style={styles.container}>
                <Text>Chargement de la localisation...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {location && (
                <MapView
                    style={styles.map}
                    region={location}
                    showsUserLocation
                    showsMyLocationButton
                >
                    {routeCoordinates.length > 0 && (
                        <Marker coordinate={routeCoordinates[0]}>
                            <RunPointStartMapIcon />
                        </Marker>
                    )}
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="#5D63D1"
                    />
                </MapView>
            )}
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
                <TouchableOpacity style={styles.simulateButton} onPress={simulateMovement}>
                    <Text style={styles.simulateButtonText}>Simuler un déplacement</Text>
                </TouchableOpacity>
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
        top: 60,
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
        bottom: 80,
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
    simulateButton: {
        marginTop: 20,
        backgroundColor: '#5D63D1',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    simulateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
    },
});

export default MapScreen;
