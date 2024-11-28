import React from "react";
import {StyleSheet, SafeAreaView, Text, View} from 'react-native';
import Header from "@/components/Header";
import ProfilePicture from "@/components/ProfilePicture";
import {SettingsIcon} from "@/components/Icons";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Header>
                <View style={styles.headerContent}>
                    <View style={styles.accountHeader}>
                        <ProfilePicture width={40}/>
                        <View>
                            <Text style={styles.helloUser}>Hello, <Text
                                style={styles.helloUsername}>Andrew</Text></Text>
                            <Text style={styles.helloRank}>Beginner</Text>
                        </View>
                    </View>
                    <SettingsIcon />
                </View>
            </Header>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F7FF',
    },
    headerContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    accountHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    helloUser: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#FFF',
    },
    helloUsername: {
        fontFamily: 'Inter-Bold',
        fontSize: 14,
    },
    helloRank: {
        fontFamily: 'Inter-Light',
        fontSize: 11,
        color: '#F3F7FF',
    }
});
