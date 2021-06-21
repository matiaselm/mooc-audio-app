import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, Content, Picker, Spinner, Button, View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AudioControls from '../components/AudioControls';
import AppContext from '../AppContext';
import useVoiceInputHooks from '../services/voiceInputHooks';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent, } from '@react-native-voice/voice';
import { useTranslation } from "react-i18next";
import COLORS from '../assets/colors';

const Home = ({ navigation }) => {
    const {
        audio,
        setAudio,
        queue,
        getPosition,
        language,
        refresh,
        setRefresh
    } = useContext(AppContext);

    const { t } = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('views.home'),
            headerRight: () => (
                <Button
                    icon
                    transparent
                    onPress={() => navigation.push("Settings")}>
                    <Icon name='cog' size={26} color={COLORS.PRIMARY} style={{ marginEnd: 16 }}></Icon>
                </Button>
            )
        })
    }, [navigation, language])

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

    useEffect(() => {
        const counter = setInterval(() => {
            getPosition()
        }, 100)

        return () => clearInterval(counter);
    })

    return <>
        <View style={{ backgroundColor: COLORS.GREY1, height: '100%' }}>

            <AudioControls style={{paddingBottom: 0, height: '88%'}}/>

            <View style={{ position: 'absolute', display: 'flex', bottom: 16, width: '100%', flexDirection: 'row', height: 60, paddingBottom: 16 }}>
                <Button block style={{ flex: 2, elevation: 10, borderWidth: 3, borderColor: COLORS.PRIMARY, backgroundColor: COLORS.SECONDARY, borderRadius: 16, margin: 8 }} onPress={() => navigation.push("SpokeStack")}>
                    <Icon name={'book-open'} size={26} color={COLORS.PRIMARY} />
                    <Text style={{ color: COLORS.PRIMARY }}>{t('notes')}</Text>
                </Button>
                <Button style={{ elevation: 10, backgroundColor: COLORS.SECONDARY, borderRadius: 16, margin: 8 }} onPressIn={_startRecognizing} onPressOut={_stopRecognizing}>
                    <Icon name={'microphone'} size={26} color={COLORS.PRIMARY} style={{ alignSelf: 'center', marginStart: 30 }} />
                    <Text style={{ color: COLORS.PRIMARY }}></Text>
                </Button>
            </View>

        </View>
    </>
}

const styles = StyleSheet.create({
    stats: {
        textAlign: 'center',
        color: '#B0171F',
        marginBottom: 1,
    }
})

export default Home;