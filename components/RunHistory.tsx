import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RunDataType } from '@/contexts/RunContext';
import MiniMapResume from '@/components/MiniMapResume';
import { useRun } from '@/contexts/RunContext';

const RunHistory = () => {
    const [runs, setRuns] = useState<RunDataType[]>([]);
    const { shouldRefresh } = useRun();

    const loadRuns = async () => {
        const storedRuns = await AsyncStorage.getItem('runs');
        if (storedRuns) {
            setRuns(JSON.parse(storedRuns));
        }
    };

    useEffect(() => {
        loadRuns();
    }, []);

    useEffect(() => {
        loadRuns();
    }, [shouldRefresh]);

    const deleteRun = async (id: string) => {
        Alert.alert(
            'Supprimer la course',
            'Êtes-vous sûr de vouloir supprimer cette course ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedRuns = runs.filter((item) => item.date !== id);
                        setRuns(updatedRuns);
                        await AsyncStorage.setItem('runs', JSON.stringify(updatedRuns)); // Mise à jour dans AsyncStorage
                    },
                },
            ]
        );
    };

    return (
        <>
            <Text style={styles.historySectionTitle}>Recent activity</Text>
            <View style={styles.container}>
                {runs.length === 0 ? (
                    <Text style={styles.noRunsMessage}>
                        Aucune course enregistrée, il serait temps de se mettre au sport !
                    </Text>
                ) : (
                    runs
                        .slice()
                        .reverse()
                        .map((item) => (
                            <View style={styles.historyItem} key={item.date}>
                                <MiniMapResume routeCoordinates={item.routeCoordinates} />
                                <View style={styles.historyItemInfos}>
                                    <Text style={styles.historyDate}>
                                        {new Date(item.date).toLocaleString('fr-FR', {
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                        })}
                                    </Text>
                                    <Text style={styles.historyDistance}>
                                        {(item.distance / 1000).toFixed(2)} km
                                    </Text>
                                    <View style={styles.historyFooter}>
                                        <Text>{item.calories.toFixed(1)} kcal</Text>
                                        <Text>{item.steps} pas</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteRun(item.date)}
                                >
                                    <Text style={styles.deleteButtonText}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    historySectionTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#333',
        marginTop: 30,
    },
    container: {
        marginTop: 16,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'column',
        gap: 16,
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noRunsMessage: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    historyItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    historyItemInfos: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 8,
    },
    historyDate: {
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        color: '#333',
        opacity: 0.7,
    },
    historyDistance: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#333',
    },
    historyFooter: {
        flexDirection: 'row',
        gap: 8,
        fontFamily: 'Inter-Regular',
        fontSize: 11,
        color: '#333',
        opacity: 0.7,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#FFF',
        fontFamily: 'Inter-SemiBold',
        fontSize: 12,
    },
});

export default RunHistory;
