import { useContext } from 'react';
import Tts from 'react-native-tts';
import TrackPlayer, { skip } from 'react-native-track-player';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react/cjs/react.production.min';
import AppContext from '../AppContext';

const parseNumber = (str) => {
    if (/\d/.test(str)) {
        for (let i = 0; i < str.length; i++) {
            if (parseInt(str.split('')[i])) {
                return parseInt(str.split('')[i])
            }
        }
    }
}

export default () => {

    const { t } = useTranslation();

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

    const handleInput = (_input) => new Promise( async(resolve, reject) => {
            if (_input) {
                const input = _input.toLowerCase();
    
                if (input.includes(t('commands.help')) || input.includes(t('commands.dontKnow'))) {
                    resolve(true)
                    if (playing === true) { togglePlayback(false) }
                    Tts.speak(t('feedback.help')).then(() => {
                        for (let i = 0; i < inputList.length; i++) {
                            Tts.speak(inputList[i])
                            continue;
                        }
                    })
                    return
                }
                if (input.includes(t('commands.hi')) || input.includes(t('commands.hello'))) {
                    Promise.resolve(true)
                    Tts.speak(t('feedback.greetings', { name: user.name }))
                    return
                }
                if (input.includes(t('commands.stop0')) || input.includes(t('commands.stop1')) || input.includes(t('commands.stop2')) || input.includes(t('commands.stop3'))) {
                    Promise.resolve(true)
                    // Tts.speak('Tauko')
                    togglePlayback(false)
                    return
                }
                if (input.includes(t('commands.play')) || input.includes(t('commands.resume'))) {
                    resolve(true)
                    Tts.speak(t('feedback.continue')).then(() => {
                        togglePlayback(true)
                    })
                    return
                }
                if (input.includes(t('commands.info0')) || input.includes(t('commands.info1')) || input.includes(t('commands.info2'))) {
                    resolve(true)
                    if (playing === true) { togglePlayback(false) }
                    Tts.speak(t('feedback.info', { title: audio && audio.title }))
                    Tts.speak(t('feedback.info'/*{ title: audio && audio.title }*/))
                    return
                }
                if (input.includes(t('commands.list0')) || input.includes(t('commands.list1'))) {
                    resolve(true)
                    // TODO listen to a number and change the ep to that
                    if (playing === true) { togglePlayback(false) }
                    Tts.speak(t('feedback.infoEpisodes', { length: queue && queue.length }))
                    Tts.speak(t('feedback.infoEpisodes', { length: queue && queue.length }))
                    return
                }
                if (input.includes(t('commands.change')) && /\d/.test(input)) {
                    resolve(true)
                    // TODO change to specific episode
                    if (playing === true) { togglePlayback(false) }
                    Tts.speak(t('feedback.changingTo', { number: parseNumber(input) }))
                    return
                }
                if (input.includes(t('commands.skip') && t('commands.forward')) || input.includes(t('commands.jump') && t('commands.forward'))) {
                    resolve(true)
                    Tts.speak(t('feedback.changingToNext'))
                    await TrackPlayer.skipToNext();
                    const currentID = await TrackPlayer.getCurrentTrack();
                    const currentAudio = await TrackPlayer.getTrack(currentID)
                    setAudio(currentAudio)
                    return
                }
                if (input.includes(t('commands.skip') && t('commands.backward') || input.includes(t('commands.jump') && t('commands.backward')))) {
                    Tts.speak(t('feedback.changingToPrevious'))
                    await TrackPlayer.skipToPrevious();
                    const currentID = await TrackPlayer.getCurrentTrack();
                    const currentAudio = await TrackPlayer.getTrack(currentID)
                    setAudio(currentAudio)
                    return
                }
                else {
                    resolve(true)
                    reject({ error: `Didn't understand input` })
                    Tts.speak(t('feedback.confused'))
                    return
                }
            } else {
                reject({ error: 'No input detectect' })
            }
        })
    return { handleInput }
}
