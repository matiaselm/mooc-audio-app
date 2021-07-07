import React, { useEffect } from 'react';
import { View } from 'react-native';

import useVoiceInputHooks from '../services/voiceInputHooks';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

import Home from './Home';
import Main from './Main';
import Notes from './Notes';
import Settings from './Settings';

import COLORS from '../assets/colors';

import { createStackNavigator } from '@react-navigation/stack';
import { fromRight } from 'react-navigation-transitions';

export default ({ navigation }) => {
    const Stack = createStackNavigator();

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

        requestRecordAudioPermission,
        createPorcupineManager,
        deletePorcupineManager,

        voiceState
    } = useVoiceInputHooks();

    useEffect(() => {
        requestRecordAudioPermission();
        createPorcupineManager();

        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

        return (() => {
            console.log('Destroy index :(')
            deletePorcupineManager();
            Voice.destroy().then(Voice.removeAllListeners);
        })
    }, []);

    return <Stack.Navigator
        headerMode={'screen'}
        screenOptions={{
            headerStyle: {
                backgroundColor: voiceState?.listening ? COLORS.SECONDARY : '#fff',
            },
            transitionConfig: fromRight()
        }}>
        <Stack.Screen name="Home" component={Home} initialParams={{ _startRecognizing: _startRecognizing, _stopRecognizing: _stopRecognizing }} />
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
}