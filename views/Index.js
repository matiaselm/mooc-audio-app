import React, { useEffect } from 'react';

import useVoiceInputHooks from '../services/voiceInputHooks';
import usePorcupineManager from '../services/porcupineManager';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

import Home from './Home';
import Main from './Main';
import Notes from './Notes';
import Settings from './Settings';

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
        _cancelRecognizing,
        _destroyRecognizer,

        voiceState
    } = useVoiceInputHooks();

    const handleVoiceInput = () => {
        return new Promise((resolve, reject) => {
            Tts.speak('Hi').then(() => {
                try {
                    console.log('Start recognizing')
                    _startRecognizing();
                    setTimeout(() => {
                        _stopRecognizing();
                        console.log('Stop recognizing')
                        resolve('Stopped recognizing')
                    }, 3000);
                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    const {
        requestRecordAudioPermission,
        createPorcupineManager,
        deletePorcupineManager
    } = usePorcupineManager(handleVoiceInput);

    useEffect(() => {
        requestRecordAudioPermission();
        createPorcupineManager();

        return (() => {
            console.log('Destroy index :(')
            deletePorcupineManager();
            Voice.destroy().then(Voice.removeAllListeners);
        })
    }, []);

    return <Stack.Navigator
        screenOptions={{
            headerMode: 'screen',
            transitionConfig: fromRight()
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
}