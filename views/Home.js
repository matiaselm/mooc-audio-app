import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, Content, Picker, Spinner, Button, View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AudioControls from '../components/AudioControls';
import AppContext from '../AppContext';
import useVoiceInputHooks from '../services/voiceInputHooks';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent, } from '@react-native-voice/voice';
import { useTranslation } from "react-i18next";

const Home = ({ navigation }) => {
    const {
        audio,
        setAudio,
        queue,
        getPosition,
    } = useContext(AppContext);

    const { t } = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    icon
                    transparent
                    onPress={() => navigation.push('Settings')}>
                    <Icon name='cog' size={26} color={'#006064'} style={{marginEnd: 16}}></Icon>
                </Button>
            )
        })
    }, [navigation])

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
        <Container style={{ backgroundColor: 'rgba(240,240,240,1)' }}>
            <Content>
                {/*<PlayerInfo />*/}
                {audio ? <AudioControls />
                    : <Picker
                        selectedValue={audio ?? 'Valitse jakso'}
                        onValueChange={(itemValue, itemIndex) =>
                            setAudio(itemValue)
                        }>
                        {queue && queue.map((audio, key) => {
                            return <Picker.Item key={key} label={audio.title} value={audio} />
                        })}
                    </Picker>
                }
            </Content>
            <View style={{ position: 'absolute', display: 'flex', bottom: 16, width: '100%', flexDirection: 'row', height: 60, paddingBottom: 16 }}>
                <Button block style={{ flex: 2, elevation: 10, borderWidth: 3, borderColor: '#006064', backgroundColor: '#d4fafc', borderRadius: 16, margin: 8 }} onPress={() => navigation.push('Notes')}>
                    <Icon name={'book-open'} size={26} color={'#006064'} />
                    <Text style={{ color: '#006064' }}>{t('notes')}</Text>
                </Button>
                <Button style={{ elevation: 10, backgroundColor: '#fff', borderRadius: 16, margin: 8 }} onPressIn={_startRecognizing} onPressOut={_stopRecognizing}>
                    <Icon name={'microphone'} size={26} color={'#006064'} style={{ alignSelf: 'center', marginStart: 30 }} />
                    <Text style={{ color: '#006064' }}></Text>
                </Button>
            </View>


        </Container>
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