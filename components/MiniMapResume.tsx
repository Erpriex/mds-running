import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { CoordinateType } from '@/app/(tabs)/map';

type MiniMapResumeProps = {
    routeCoordinates: CoordinateType[];
};

const MiniMapResume = ({ routeCoordinates }: MiniMapResumeProps) => {
    if (routeCoordinates.length === 0) {
        return null;
    }

    const calculateRegion = (coordinates: CoordinateType[]) => {
        const lats = coordinates.map(coord => coord.latitude);
        const lons = coordinates.map(coord => coord.longitude);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const latitude = (minLat + maxLat) / 2;
        const longitude = (minLon + maxLon) / 2;
        const latitudeDelta = maxLat - minLat + 0.01;
        const longitudeDelta = maxLon - minLon + 0.01;

        return { latitude, longitude, latitudeDelta, longitudeDelta };
    };

    const region = calculateRegion(routeCoordinates);

    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                initialRegion={region}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
            >
                <Polyline
                    coordinates={routeCoordinates}
                    strokeWidth={2}
                    strokeColor="#5D63D1"
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    mapContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MiniMapResume;
