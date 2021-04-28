import React, { useContext, useState } from 'react';
import AppContext from '../AppContext';
import Tts from 'react-native-tts';
import useVoiceFeedbackHooks from './voiceFeedbackHooks';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent, } from '@react-native-voice/voice';

const useVoiceInputHooks = () => {
    const [voiceState, setVoiceState] = useState({
        recognized: '',
        pitch: '',
        error: '',
        end: '',
        started: '',
        results: [],
        partialResults: [],
    })

    const { handleInput } = useVoiceFeedbackHooks();

    const onSpeechStart = (e) => {
        //console.log('onSpeechStart: ', e);
        setVoiceState(prev => ({
            ...prev,
            started: '√',
        }));
    };

    const onSpeechRecognized = (e) => {
        console.log('onSpeechRecognized: ', e);
        setVoiceState(prev => ({
            ...prev,
            recognized: '√',
        }));
    };

    const onSpeechEnd = (e) => {
        // console.log('onSpeechEnd: ', e);
        setVoiceState(prev => ({
            ...prev,
            end: '√',
        }));
    };

    const onSpeechError = (e) => {
        console.log('onSpeechError: ', e);
        setVoiceState(prev => ({
            ...prev,
            error: JSON.stringify(e.error),
        }));
    };

    const onSpeechResults = (e) => {
        console.log('onSpeechResults: ', e);
        handleInput(e.value[0])
        setVoiceState(prev => ({
            ...prev,
            results: e.value,
        }));
    };

    const onSpeechPartialResults = (e) => {
        console.log('onSpeechPartialResults: ', e);
        setVoiceState(prev => ({
            ...prev,
            partialResults: e.value,
        }));
    };

    const onSpeechVolumeChanged = (e) => {
        // console.log('onSpeechVolumeChanged: ', e);
        setVoiceState(prev => ({
            ...prev,
            pitch: e.value,
        }));
    };

    const _startRecognizing = async () => {
        setVoiceState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
        });

        try {
            await Voice.start('fi-FI');
        } catch (e) {
            console.error(e);
        }
    };

    const _stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    const _cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    };

    const _destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
        setVoiceState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
        });
    };

    return {
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
    }
}

export default useVoiceInputHooks;
