import { useContext, useState } from 'react';

import AppContext from '../AppContext';
import { PorcupineManager } from '@picovoice/porcupine-react-native';

import useVoiceFeedbackHooks from './voiceFeedbackHooks';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

let porcupineManager = null;
let listening = false;
const useVoiceInputHooks = () => {
    const [voiceState, setVoiceState] = useState({
        recognized: '',
        pitch: '',
        error: '',
        end: '',
        started: '',
        results: [],
        partialResults: [],
        listening: false,
    })

    const { setError, language } = useContext(AppContext);

    const [porcupineState, setPorcupineState] = useState(false)

    const { handleInput } = useVoiceFeedbackHooks();

    const handleVoiceInput = () => {
        return new Promise((resolve, reject) => {
            if (voiceState.listening == false && listening == false) {
                listening = true
                Tts.speak('Hi').then(() => {
                    try {
                        console.log('Start recognizing')
                        _startRecognizing();
                        setTimeout(() => {
                            _stopRecognizing();
                            console.log('Stop recognizing')
                            recognizing = 0
                            resolve(true)
                            listening = false
                        }, 3000);
                    } catch (e) {
                        reject(e)
                    }
                })
            } else {
                reject({ error: `recognizing callback shouldn't be called more than once` })
            }
        })
    }
    
    const createPorcupineManager = async () => {
        try {
            if (porcupineManager === null) {
                porcupineManager = await PorcupineManager.fromKeywords(
                    ["blueberry"],
                    detectionCallback)
                console.log('Porcupine started')
                porcupineManager.start()
                setPorcupineState(true)
            }
        } catch (e) {
            console.error(e)
            setError(e)
        }
    }

    const detectionCallback = (keywordIndex) => {
        if (keywordIndex === 0) {
            console.log('Blueberry detected!', keywordIndex)
            porcupineManager.stop().then(didStop => {
                if (didStop) {
                    console.log('Did stop')
                    // This is where we call the callback function to handle next voice input
                    // then start listening to wake word again
                    handleVoiceInput().then(() => {
                        console.log('handled voice input')
                        porcupineManager.start()
                    }).catch(e => {
                        console.error(e)
                        setError(e)
                    }).finally(() => {

                    });
                }
            });
        }
    }

    const deletePorcupineManager = async () => {
        if(porcupineManager != null && typeof porcupineManager != 'undefined') {
            try {
                let didStop = await porcupineManager.stop();
                setPorcupineState(false)
                if(didStop && porcupineManager != null && typeof porcupineManager != 'undefined') {
                    porcupineManager.destroy();
                    console.log('porcupine deleted')
                }
            } catch (e) {
                console.error(e)
                setError(e)
            }
        } else {
            console.log('type of porcupinemanager', typeof porcupineManager)
        }
    }

    const stopPorcupineManager = () => {
        if (porcupineManager != null && typeof porcupineManager != 'undefined') {
            porcupineManager.stop().then(didStop => {
                setPorcupineState(false)
            }).catch(e => {
                console.error(e)
                setError(e)
            });
        }
    }

    const _stopRecognizing = async () => {
        try {
            await Voice.stop();
            setVoiceState(prev => ({
                ...prev,
                listening: false
            }))
        } catch (e) {
            console.error(e);
            setError(e)
        }
    };

    const onSpeechStart = (e) => {
        console.log('onSpeechStart: ', e);
        setVoiceState(prev => ({
            ...prev,
            started: '√',
            listening: true
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
            listening: false
        }));
    };

    const onSpeechError = (e) => {
        console.log('onSpeechError: ', e);
        setError('onSpeechError: ' + e.error.message)
        setVoiceState(prev => ({
            ...prev,
            error: JSON.stringify(e.error),
        }));
    };

    const onSpeechResults = (e) => {
        console.log('onSpeechResults: ', e);
        if (e.value && e.value[0].length > 0) {
            handleInput(e.value[0]).then(res => {
                if(res == true) {
                    _stopRecognizing()
                }
            }).catch(e => {
                //console.log(e)
            })
        }
        setVoiceState(prev => ({
            ...prev,
            results: e.value,
        }));
    };

    const onSpeechPartialResults = (e) => {
        console.log('onSpeechPartialResults: ', e);
        if (e.value?.length > 0) {
            handleInput(e.value[0]).then(res => {
                if(res == true) {
                    _stopRecognizing()
                }
            }).catch(e => {
                //console.log(e)
            })
        }
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
        if(porcupineManager) {
            porcupineManager.stop()
        }
        setVoiceState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            listening: true
        });

        try {
            await Voice.start(language);
        } catch (e) {
            console.error(e);
        }
    };

    const _cancelRecognizing = async () => {
        try {
            await Voice.cancel();
            setVoiceState(prev => ({
                ...prev,
                listening: false
            }));
        } catch (e) {
            console.error(e);
            setError(e)
        }
    };

    const _destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
            setError(e)
        }
        setVoiceState({
            recognized: '',
            pitch: '',
            error: '',
            started: '',
            results: [],
            partialResults: [],
            end: '',
            listening: false
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

        createPorcupineManager,
        deletePorcupineManager,
        stopPorcupineManager,

        porcupineState,
        setPorcupineState,

        voiceState
    }
}

export default useVoiceInputHooks;
