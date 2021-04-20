import React, { useState, useEffect } from 'react';
import { Container, ToastAndroid, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import axios from 'axios';
import { API_URL } from '@env';
import TrackPlayer, { play } from 'react-native-track-player';

const useTrackPlayerHooks = () => {
    const [audio, setAudio] = useState(null);
    const [queue, setQueue] = useState([]);
    const [position, setPosition] = useState(0);
    const [playing, setPlaying] = useState(false);
    const jumpInterval = 30;

    useEffect(() => {
        for (let i in queue) {
            const track = {
                id: queue[i]._id,
                title: queue[i].title,
                url: queue[i].url,
                album: queue[i].album,
                artwork: queue[i].artwork,
                artist: queue[i].artist,
                duration: Math.round(queue[i].duration.$numberDecimal)
            }
            addAudio(track);
        }
        getQueue();
    }, [queue])

    useEffect(() => {
        console.log('Audio ', audio)
    },[audio])

    const getAudio = () => {
        try {
            const url = `${API_URL}/audio`;
            // console.log('API: ', url);
            axios.get(url).then(response => {
                // console.log('Audio response: ', JSON.stringify(response.data,'','\t'))
                setQueue(response.data)
            });
        } catch (e) {
            console.error(e.message)
        }
    }

    const addAudio = async (audio) => {
        await TrackPlayer.add(audio);
    }

    const getCurrentAudio = async () => {
        await TrackPlayer.getCurrentTrack().then((res) => {
            console.log('Current audio: ', res)
            return res.Title
        })
    }

    const getQueue = async () => {
        await TrackPlayer.getQueue().then((response) => {
            console.log('TrackPlayer queue: ', JSON.stringify(response, '', '\t'))
        });
    }

    const skip = (way) => {
        if (way === 'brackward') TrackPlayer.seekTo(playing.position - jumpInterval)
        if (way === 'forward') TrackPlayer.seekTo(playing.position + jumpInterval)
    }

    // TODO: UI for audio controls
    // A basic example function that is passed to customButton and called from there via callback 
    const togglePlayback = async () => {
        if (!playing) {
            setPlaying(true);
            await TrackPlayer.play()
        } else {
            setPlaying(false);
            await TrackPlayer.pause()
        }
    }

    const updateAudioInfo = async () => {
        await TrackPlayer.getPosition().then(position => {
            setPosition(position)
        }).catch(e => {
            console.error(e)
        });
    }

    const initView = async () => {
        const trackId = await TrackPlayer.getCurrentTrack();
        const trackObject = await TrackPlayer.getTrack(trackId);

        setAudio(trackObject);
    }

    return {
        getQueue,
        skip,
        togglePlayback,
        getAudio,
        addAudio,
        getCurrentAudio,
        updateAudioInfo,
        initView,
        audio,
        position,
        playing,
    }
}

export default useTrackPlayerHooks;