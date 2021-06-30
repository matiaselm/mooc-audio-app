import React, { useContext, useState } from 'react';
import { PermissionsAndroid, AppState } from 'react-native';
import { PorcupineManager } from '@picovoice/porcupine-react-native';

let porcupineManager = null

export default (handleVoiceInput) => {

    const requestRecordAudioPermission = async () => {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: 'Microphone Permission',
                message: 'Can I use your microphone (say yes)',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        ).then(granted => {
            return (granted === PermissionsAndroid.RESULTS.GRANTED)
        });
    }
    
    const createPorcupineManager = async () => {
        if (porcupineManager === null) {
            PorcupineManager.fromKeywords(
                ["blueberry"],
                detectionCallback).then(pm => {
                    console.log('Porcupine started')
                    porcupineManager = pm
                    porcupineManager.start();
                }).catch(e => {
                    console.error(e)
                });
        }
    }
    
    const detectionCallback = async (keywordIndex) => {
        if (keywordIndex === 0) {
            console.log('Blueberry detected!', keywordIndex)
            let didStop = await porcupineManager.stop();
            if(didStop) {
                console.log('Did stop')
                // This is where we call the callback function to handle next voice input
                // then start listening to wake word again
                handleVoiceInput().then(() => {
                    console.log('handled voice input')
                    porcupineManager.start();
                }).catch(e => {
                    console.error(e)
                }).finally(() => {
                    
                });
            }
        }
    }

    const deletePorcupineManager = () => {
        if(porcupineManager != null) {
            try{
                porcupineManager.destroy();
            } catch(e) {
                // console.log(e)
            }
        }
    }

    return {
        requestRecordAudioPermission,
        createPorcupineManager,
        deletePorcupineManager
    }
}
