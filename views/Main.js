import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input } from 'native-base';
import axios from 'axios';
import { WIT_BEARER } from "@env";
import CustomHeader from '../components/CustomHeader';
import SpeechToText from 'react-native-google-speech-to-text';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent, } from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Main = ({ navigation }) => {

    const [voiceState, setVoiceState] = useState({
        recognized: '',
        pitch: '',
        error: '',
        end: '',
        started: '',
        results: [],
        partialResults: [],
    })

    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechError = onSpeechError;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        }
    }, [])

    const onSpeechStart = (e) => {
        console.log('onSpeechStart: ', e);
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
        console.log('onSpeechEnd: ', e);
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
        console.log('onSpeechVolumeChanged: ', e);
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

    return <>
        <Container>

            <Text style={styles.instructions}>
                Press the button and start speaking.
        </Text>
            <Text style={styles.stat}>{`Started: ${voiceState.started}`}</Text>
            <Text style={styles.stat}>{`Recognized: ${voiceState.recognized
                }`}</Text>
            <Text style={styles.stat}>{`Pitch: ${voiceState.pitch}`}</Text>
            <Text style={styles.stat}>{`Error: ${voiceState.error}`}</Text>
            <Text style={styles.stat}>Results</Text>
            {voiceState.results.map((result, index) => {
                return (
                    <Text key={`result-${index}`} style={styles.stat}>
                        {result}
                    </Text>
                );
            })}
            <Text style={styles.stat}>Partial Results</Text>
            {voiceState.partialResults.map((result, index) => {
                return (
                    <Text key={`partial-result-${index}`} style={styles.stat}>
                        {result}
                    </Text>
                );
            })}
            <Text style={styles.stat}>{`End: ${voiceState.end}`}</Text>

            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Button style={[styles.action, {}]} onPress={_startRecognizing}>
                    <Icon name={'microphone'} size={26} color={'#fff'} style={{ margin: 8, alignSelf: 'center' }} />
                    <Text>Start Recognizing</Text>
                </Button>

                <Button warning style={styles.action} onPress={_cancelRecognizing}>
                    <Text>Cancel</Text>
                </Button>

                <Button style={styles.action} onPress={_stopRecognizing}>
                    <Icon name={'stop'} size={26} color={'#fff'} style={{ margin: 8, alignSelf: 'center' }} />
                    <Text>Stop Recognizing</Text>
                </Button>

                <Button danger style={styles.action} onPress={_destroyRecognizer}>
                    <Text>Destroy</Text>
                </Button>
            </View>
        </Container>
    </>
}

const styles = StyleSheet.create({
    button: {
        width: 50,
        height: 50,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    action: {
        textAlign: 'center',
        margin: 8,
        alignSelf: 'center',
        color: '#ddd',
        marginVertical: 5,
        fontWeight: 'bold',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
    },
});

export default Main;