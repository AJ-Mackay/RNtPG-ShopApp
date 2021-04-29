import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useAsyncStorage } from '@react-native-community/async-storage';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const StartupScreen = props => {
    const dispatch = useDispatch();
    useEffect(async () => {
        const tryLogin = async () => {
            const userData = await useAsyncStorage.getItem('userData');
            if (!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);
            const { token, userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);

            if (expirationDate <= new Date() || !token || !userId) {
                props.navigation.navigate('Auth');
                return;
            }

            props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(userId, token));
        };
        tryLogin();
    }, [dispatch]);
    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default StartupScreen;