import React from "react";
import {Image, StyleSheet} from 'react-native';

type Props = {
    width?: number;
};

const ProfilePicture = ({width = 200}: Props) => {
    return (
        <Image
            style={[styles.image, {width, height: width}]}
            source={require('@/assets/images/profile_picture.jpg')}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        borderRadius: 20,
    },
});

export default ProfilePicture;
