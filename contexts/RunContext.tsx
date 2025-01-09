import React, {createContext, useState, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Pedometer} from 'expo-sensors';

type RunContextType = {
    timeElapsed: number;
    steps: number;
    distance: number;
    calories: number;
    isRunning: boolean; // Indique si une course est en cours
    startRun: () => void;
    stopRun: () => void;
    resetRun: () => void; // Réinitialise les valeurs de la course
    saveRun: (runData: RunDataType) => Promise<void>;
};

type RunDataType = {
    timeElapsed: number;
    steps: number;
    distance: number;
    calories: number;
    date: string;
};

const RunContext = createContext<RunContextType | null>(null);

export const RunProvider = ({children}: { children: React.ReactNode }) => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [calories, setCalories] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [pedometerSubscription, setPedometerSubscription] = useState<any>(null);

    const startRun = () => {
        if (isRunning || intervalId) return;

        setIsRunning(true);

        // Démarre le chronomètre
        const id = setInterval(() => {
            setTimeElapsed((prev) => prev + 1);
        }, 1000);
        setIntervalId(id);

        // Démarre le suivi des pas
        const subscription = Pedometer.watchStepCount((result) => {
            if (result.steps) {
                setSteps(result.steps);
                const newDistance = result.steps * 0.762; // Approx. 76.2 cm par pas
                setDistance(newDistance);

                const newCalories = newDistance * 0.05; // ~0.05 kcal par mètre parcouru
                setCalories(newCalories);
            }
        });

        setPedometerSubscription(subscription);
    };

    const stopRun = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        if (pedometerSubscription) {
            pedometerSubscription.remove();
            setPedometerSubscription(null);
        }

        setIsRunning(false);
    };

    const resetRun = () => {
        setTimeElapsed(0);
        setSteps(0);
        setDistance(0);
        setCalories(0);
        setIsRunning(false);
    };

    const saveRun = async (runData: RunDataType) => {
        try {
            const storedRuns = await AsyncStorage.getItem('runs');
            const runs = storedRuns ? JSON.parse(storedRuns) : [];
            runs.push(runData);
            await AsyncStorage.setItem('runs', JSON.stringify(runs));
        } catch (error) {
            console.error('Failed to save run:', error);
        }
    };

    return (
        <RunContext.Provider
            value={{
                timeElapsed,
                steps,
                distance,
                calories,
                isRunning,
                startRun,
                stopRun,
                resetRun,
                saveRun,
            }}
        >
            {children}
        </RunContext.Provider>
    );
};

export const useRun = () => {
    const context = useContext(RunContext);
    if (!context) {
        throw new Error('useRun must be used within a RunProvider');
    }
    return context;
};
