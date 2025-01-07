import {ReactNode} from "react";
import {StyleSheet, View} from "react-native";

type Props = {
    children?: ReactNode;
};

const Header = ({children}: Props) => {
    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#5D63D1',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        height: 250,
    },
    headerContent: {
        marginTop: '15%',
        marginHorizontal: 24,
    },
});

export default Header;
