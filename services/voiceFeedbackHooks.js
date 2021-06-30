import { useContext } from 'react';
import Tts from 'react-native-tts';
import TrackPlayer, { skip } from 'react-native-track-player';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react/cjs/react.production.min';
import AppContext from '../AppContext';

export default (_stopRecognizing) => {

    const { t } = useTranslation();

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
        skip
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

            const inputList = [
                t('commands.help'),
                t('commands.stop0'),
                t('commands.resume'),
                t('commands.list0'),
                t('commands.info0'),
                t('commands.changeToNumber'),
                t('commands.forward'),
                t('commands.backward'),
                t('commands.jumpToNext'),
                t('commands.jumpToPrevious')
            ]

            if (input.includes(t('commands.help')) || input.includes(t('commands.dontKnow'))) {
                _stopRecognizing();
                if (playing === true) { togglePlayback(false) }
                await Tts.speak(t('feedback.help')).then(() => {
                    for (let i = 0; i < inputList.length; i++) {
                        Tts.speak(inputList[i])
                        continue;
                    }
                })
                return
            }
            if (input.includes(t('commands.hi')) || input.includes(t('commands.hello'))) {
                _stopRecognizing();
                Tts.speak(t('feedback.greetings', { name: user.name }))
                return
            }
            if (input.includes(t('commands.stop0')) || input.includes(t('commands.stop1')) || input.includes(t('commands.stop2')) || input.includes(t('commands.stop3'))) {
                _stopRecognizing();
                // Tts.speak('Tauko')
                togglePlayback(false)
                return
            }
            if (input.includes(t('commands.play')) || input.includes(t('commands.resume'))) {
                _stopRecognizing();
                Tts.speak(t('feedback.continue')).then(() => {
                    togglePlayback(true)
                })
                return
            }
            if (input.includes(t('commands.info0')) || input.includes(t('commands.info1')) || input.includes(t('commands.info2'))) {
                _stopRecognizing();
                if (playing === true) { togglePlayback(false) }
                Tts.speak(t('feedback.info', { title: audio && audio.title }))
                Tts.speak(t('feedback.info'/*{ title: audio && audio.title }*/))
                return
            }
            if (input.includes(t('commands.list0')) || input.includes(t('commands.list1'))) {
                _stopRecognizing();
                // TODO listen to a number and change the ep to that
                if (playing === true) { togglePlayback(false) }
                Tts.speak(t('feedback.infoEpisodes', { length: queue && queue.length }))
                Tts.speak(t('feedback.infoEpisodes', { length: queue && queue.length }))
                return
            }
            if (input.includes(t('commands.change')) && /\d/.test(input)) {
                _stopRecognizing();
                // TODO change to specific episode
                if (playing === true) { togglePlayback(false) }
                Tts.speak(t('feedback.changingTo', { number: parseNumber(input) }))
                return
            }
            if (input.includes(t('commands.skip') && t('commands.forward')) || input.includes(t('commands.jump') && t('commands.forward'))) {
                _stopRecognizing();
                Tts.speak(t('feedback.changingToNext'))
                await TrackPlayer.skipToNext();
                const currentID = await TrackPlayer.getCurrentTrack();
                const currentAudio = await TrackPlayer.getTrack(currentID)
                setAudio(currentAudio)
                return
            }
            if (input.includes(t('commands.skip') && t('commands.backward') || input.includes(t('commands.jump') && t('commands.backward')))) {
                _stopRecognizing();
                Tts.speak(t('feedback.changingToPrevious'))
                await TrackPlayer.skipToPrevious();
                const currentID = await TrackPlayer.getCurrentTrack();
                const currentAudio = await TrackPlayer.getTrack(currentID)
                setAudio(currentAudio)
                return
            }
            else {
                Tts.speak(t('feedback.confused'))
            }
        }
    }
    return { handleInput }
}
