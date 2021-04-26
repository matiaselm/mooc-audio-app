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
        playing,
        setQueue,
        position,
        setPosition,
        getPosition,
        togglePlayback,
        jump,
    } = useContext(AppContext);

    /*TODO listen to nested inputs I.E:
        create note => listen to the note body
        skip to next episode => confirm
    }*/
    
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

            const inputList = [
                'apua',
                'pysäytä',
                'jatka',
                'lista',
                'vaihda numeroon',
                'eteen',
                'taakse',
                'hyppää eteen',
                'hyppää taakse',
            ]

            if (input.includes('apua')) {
                if (playing === true) { togglePlayback(false) }
                await Tts.speak('Toimivat komennot').then(() => {
                    for (let i = 0; i < inputList.length; i++) {
                        Tts.speak(inputList[i])
                        continue;
                    }
                })
                return
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
            if (input.includes('mikä') || input.includes('kerro')) {
                if (playing === true) { togglePlayback(false) }
                Tts.speak(audio ? `Kuuntelet tällä hetkellä: ${audio.title}. Genre on ${audio.genre}` : `Et kuuntele mitään. Valitse jakso`)
                return
            }
            if (input.includes('lista') || input.includes('jaksot')) {
                // TODO listen to a number and change the ep to that
                if (playing === true) { togglePlayback(false) }
                Tts.speak(queue ? `Valittavia jaksoja on ${queue.length}. Sano jakson numero, niin vaihdan siihen` : 'En löydä kuunneltavaa')
                return
            }
            if (input.includes('vaihda') && /\d/.test(input)) {
                // TODO change to specific episode
                if (playing === true) { togglePlayback(false) }
                Tts.speak(`Vaihdan jaksoon ${parseNumber(input)}`)
                return
            }
            if (input.includes('skip' && 'seuraava') || input.includes('hyppää' && 'seuraava')) {
                Tts.speak('Vaihdan seuraavaan jaksoon')
                await TrackPlayer.skipToNext();
                const currentID = await TrackPlayer.getCurrentTrack();
                const currentAudio = await TrackPlayer.getTrack(currentID)
                setAudio(currentAudio)
                return
            }
            if (input.includes('skip' && 'taakse' || input.includes('hyppää' && 'taakse'))) {
                Tts.speak('Vaihdan edelliseen jaksoon')
                await TrackPlayer.skipToPrevious();
                const currentID = await TrackPlayer.getCurrentTrack();
                const currentAudio = await TrackPlayer.getTrack(currentID)
                setAudio(currentAudio)
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
