import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {ArrowRight} from "@/components/Icons";

const WeekGoal = () => {
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>View goal</Text>
                    <Text style={styles.goal}>50 km</Text>
                </View>
                <ArrowRight/>
            </View>
            <View style={styles.goalTrackerContainer}>
                <View style={styles.goalTrackerLegends}>
                    <Text style={styles.goalLegend}>35 km done</Text>
                    <Text style={[styles.goalLegend, { fontFamily: 'Inter-Light' }]}>15 km left</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        marginTop: -100,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    titleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        overflow: 'hidden',
    },
    title: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#000',
    },
    goal: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
        color: '#5D63D1',
        marginLeft: 8,
    },
    goalTrackerContainer: {
        marginTop: 24,
        width: '100%',
    },
    goalTrackerLegends: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    goalLegend: {
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        color: '#000',
        flexShrink: 1,
        overflow: 'hidden',
    },
    progressBar: {
        marginTop: 4,
        height: 8,
        width: '100%',
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '70%',
        backgroundColor: '#5D63D1',
        borderRadius: 4,
    },
});

export default WeekGoal;