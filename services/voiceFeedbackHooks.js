import React, { useContext } from 'react';
import AppContext from '../AppContext';
import Tts from 'react-native-tts';
import TrackPlayer, { skip } from 'react-native-track-player';

const useVoiceFeedbackHooks = () => {
    const {
        audio,
        setAudio,
        user,
        queue,
        setQueue,
        position,
        setPosition,
        getPosition,
        togglePlayback,
    } = useContext(AppContext);

    const handleInput = async (_input) => {
        if (_input) {
            const input = _input.toLowerCase();

            const parseNumber = (str) => {
                if (/\d/.test(str)) {
                    for (let i = 0; i < str.length; i++) {
                        if (parseInt(str.split('')[i])) {
                            return parseInt(str.split('')[i])
                        }
                    }
                }
            }

            if (input.includes('moi') || input.includes('hei')) {
                Tts.speak(`Hei ${user.name ?? ''}! Mitä haluaisit kuunnella?`)
                return
            }
            if (input.includes('pysäytä') || input.includes('paussi') || input.includes('tauko') || input.includes('stop')) {
                // Tts.speak('Tauko')
                togglePlayback(false)
                return
            }
            if (input.includes('jatka') || input.includes('toista')) {
                await Tts.speak('Jatketaan').then(() => {
                    togglePlayback(true)
                })
                return
            }
            if (input.includes('mikä') || input.includes('kerro') || input.includes('apua')) {
                Tts.speak(audio ? `Kuuntelet tällä hetkellä: ${audio.title}. Genre on ${audio.genre}` : `Et kuuntele mitään. Valitse jakso`)
                return
            }
            if (input.includes('lista') || input.includes('jaksot')) {
                Tts.speak(queue ? `Valittavia jaksoja on ${queue.length}. Sano jakson numero, niin vaihdan siihen` : 'En löydä kuunneltavaa')
                return
            }
            if (input.includes('vaihda') && /\d/.test(input)) {
                Tts.speak(`Vaihdan jaksoon ${parseNumber(input)}`)
                return
            }
            if(input.includes('eteen')) {
                console.log('Going forward')
                skip('forward')
                return
            }
            if(input.includes('taakse')){
                console.log('Going backwards')
                skip('backward')
                return
            }
            if (input.includes('skip' && 'seuraava')) {
                Tts.speak('Vaihdan seuraavaan jaksoon')
                return
            }
            if (input.includes('skip' && 'taakse')) {
                Tts.speak('Vaihdan edelliseen jaksoon')
                return
            }
            if (input.includes('skip')) {
                Tts.speak('Vaihdanko seuraavaan jaksoon?')
                return
            }
            else {
                Tts.speak('En ymmärtänyt. Voitko toistaa?')
            }
        }
    }

    return { handleInput }
}

export default useVoiceFeedbackHooks;
