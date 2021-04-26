import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Text, Content, Picker, Spinner, Button, View } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomHeader from '../components/CustomHeader';
import AudioControls from '../components/AudioControls';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import ProgressBar from '../components/ProgressBar';
import AppContext from '../AppContext';
import useVoiceInputHooks from '../services/voiceInputHooks';
import Voice, { SpeechRecognizedEvent, SpeechResultsEvent, SpeechErrorEvent, } from '@react-native-voice/voice';

const Home = ({ navigation }) => {
    const {
        audio,
        setAudio,
        user,
        queue,
        setQueue,
        position,
        setPosition,
        getPosition,
        playing,
        skip,
        togglePlayback,
    } = useContext(AppContext);

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
        }, 500)

        return () => clearInterval(counter);
    })

    return <>
        <Container style={{ backgroundColor: 'rgba(240,240,240,1)' }}>
            <Content>
                <Text style={styles.stats}>Result: {voiceState.results && voiceState.results[0]}</Text>
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
                    <Text style={{ color: '#006064' }}>Muistiinpanot</Text>
                </Button>
                <Button style={{ elevation: 10, backgroundColor: '#fff', borderRadius: 16, margin: 8 }} onPress={_startRecognizing}>
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