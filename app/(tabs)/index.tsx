import React from "react";
import { StyleSheet, SafeAreaView, Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import ProfilePicture from "@/components/ProfilePicture";
import { SettingsIcon } from "@/components/Icons";
import WeekGoal from "@/components/WeekGoal";
import RunningLauncherButton from "@/components/RunningLauncherButton";
import RunHistory from "@/components/RunHistory";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Header>
                    <View style={styles.headerContent}>
                        <View style={styles.accountHeader}>
                            <ProfilePicture width={40} />
                            <View>
                                <Text style={styles.helloUser}>
                                    Hello, <Text style={styles.helloUsername}>Andrew</Text>
                                </Text>
                                <Text style={styles.helloRank}>Beginner</Text>
                            </View>
                        </View>
                        <SettingsIcon />
                    </View>
                </Header>
                <View style={styles.content}>
                    <WeekGoal />
                    <RunningLauncherButton />
                    <RunHistory />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F3F7FF",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },
    accountHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    helloUser: {
        fontFamily: "Inter-Regular",
        fontSize: 14,
        color: "#FFF",
    },
    helloUsername: {
        fontFamily: "Inter-Bold",
        fontSize: 14,
    },
    helloRank: {
        fontFamily: "Inter-Light",
        fontSize: 11,
        color: "#F3F7FF",
    },
    content: {
        marginTop: '60%',
    },
});
