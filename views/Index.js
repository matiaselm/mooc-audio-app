import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';

import useVoiceInputHooks from '../services/voiceInputHooks';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

import AppContext from '../AppContext';
import IndexContext from '../IndexContext';

import Home from './Home';
import Notes from './Notes';
import Settings from './Settings';

import COLORS from '../assets/colors';
  
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fromRight } from 'react-navigation-transitions';

export default ({ navigation }) => {
    const Stack = createStackNavigator();

    const { setError } = useContext(AppContext);

    const {
        onSpeechStart,
        onSpeechRecognized,
        onSpeechEnd,
        onSpeechError,
        onSpeechResults,
        onSpeechPartialResults,
        onSpeechVolumeChanged,

        _startRecognizing,
        _stopRecognizing,

        createPorcupineManager,
        stopPorcupineManager,
        deletePorcupineManager,

        porcupineState, 
        setPorcupineState,

        voiceState
    } = useVoiceInputHooks();

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

        return (() => {
            console.log('Destroy index :(')
            try {
                deletePorcupineManager();
            } catch (e) {
                console.error(e)
                setError(e)
            }
            Voice.destroy().then(Voice.removeAllListeners);
        })
    }, []);

    const indexContextProdiver = React.useMemo(() => {
        return {
            _startRecognizing: _startRecognizing,
            _stopRecognizing: _stopRecognizing,

            createPorcupineManager: createPorcupineManager,
            stopPorcupineManager: stopPorcupineManager,
            deletePorcupineManager: deletePorcupineManager,

            porcupineState: porcupineState,
            setPorcupineState: setPorcupineState
        };
      },[porcupineState]);

    return <IndexContext.Provider value={indexContextProdiver}>
        <NavigationContainer>
            <Stack.Navigator
                headerMode={'screen'}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: voiceState?.listening ? COLORS.SECONDARY : '#fff',
                    },
                    transitionConfig: fromRight(),
                }}>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Notes" component={Notes} />
                <Stack.Screen name="Settings" component={Settings} />
            </Stack.Navigator>
        </NavigationContainer>
    </IndexContext.Provider> 
}