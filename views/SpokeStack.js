import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input } from 'native-base';
import axios from 'axios';
import { ST_CLIENT_ID, ST_SECRET } from "@env";
import CustomHeader from '../components/CustomHeader';
import SpeechToText from 'react-native-google-speech-to-text';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent, } from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/FontAwesome5';
import useVoiceInputHooks from '../services/voiceInputHooks';

import Spokestack from 'react-native-spokestack';

export default ({ navigation }) => {
    // for spokestack
    const [listening, setListening] = useState(false)

    const onActivate = () => setListening(true)
    const onDeactivate = () => setListening(false)
    const onRecognize = ({ transcript }) => console.log(transcript)

    useEffect(() => {
        Spokestack.addEventListener('activate', onActivate)
        Spokestack.addEventListener('deactivate', onDeactivate)
        Spokestack.addEventListener('recognize', onRecognize)
        Spokestack.initialize(
            process.env.SPOKESTACK_CLIENT_ID,
            process.env.SPOKESTACK_CLIENT_SECRET
        )
            // This example starts the Spokestack pipeline immediately,
            // but it could be delayed until after onboarding or other
            // conditions have been met.
            .then(() => {
                Spokestack.start()
                console.log('SpokeStack started')
            })

        return () => {
            Spokestack.removeAllListeners()
        }
    }, [])

    return <>
        <Container>
            <Text style={styles.stat}>{listening ? 'Listening...' : 'Idle'}</Text>

            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Button style={[styles.action, {}]} onPress={() => Spokestack.activate()}>
                    <Icon name={'microphone'} size={26} color={'#fff'} style={{ margin: 8, alignSelf: 'center' }} />
                    <Text>Start Recognizing</Text>
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
        margin: 4,
        color: '#333333',
    },
    stat: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
    },
});