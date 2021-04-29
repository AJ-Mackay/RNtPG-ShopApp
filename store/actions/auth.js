import { useAsyncStorage } from '@react-native-community/async-storage';

export const AUTHENTICATE = 'AUTHENTICATE';

export const authenticate = (userId, token) => {
    return { type: AUTHENTICATE, userId: userId, token: token };
};

// API Key removed from live database and new one regenerated (29/4/21)

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAGAhbRq3VkWA7X1SGh9fCN1lzV5kKJnDk', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
        }
    );

    if(!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_EXISTS') {
            message = 'This email address has already been registered!';
        }
        throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(authenticate(resData.idToken, resData.localId));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAGAhbRq3VkWA7X1SGh9fCN1lzV5kKJnDk', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
        }
    );

    if(!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_NOT_FOUND') {
            message = 'This email address could not be found!';
        } else if (errorId === 'INVALID_PASSWORD') {
            message = 'Incorrect password!';
        }
        throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(authenticate(resData.idToken, resData.localId));
    const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    useAsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }));
};