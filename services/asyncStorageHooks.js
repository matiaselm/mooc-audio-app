import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAsyncStorageHooks = () => {
    const storeData = async (key, _data) => {
        const jsonData = JSON.stringify(_data)
        try {
            await AsyncStorage.setItem(key, jsonData)
        } catch (e) {
            console.error(e)
        }
    }

    const getData = async (key) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return JSON.parse(jsonValue) ?? null;
        } catch (e) {
            console.error(e)
        }
    }

    const removeUser = async () => {
        try {
            await storeData('user', null)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        storeData,
        getData,
        removeUser
    }
}

export default useAsyncStorageHooks;