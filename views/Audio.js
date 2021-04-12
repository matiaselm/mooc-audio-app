import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, ToastAndroid } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import AudioControls from '../components/AudioControls';
import TrackPlayer, { play } from 'react-native-track-player';
import { TrackPlayerEvents } from 'react-native-track-player';


const Audio = () => {
    const [playing, setPlaying] = useState({
        name: 'Podcast name',
        status: true,
        progress: 0,
        duration: 3745,
        position: 0,
        image: null
    });

    const track1 = {
        id: 'podcast', // Must be a string, required
        url: 'https://content.blubrry.com/muutos/Minna_Kosonen_muutos_podcast.mp3', // Load media from the network
        title: 'Jakso 7: Viljelykasvien monimuotoisuus tukee luonnon monimuotoisuutta',
        artist: 'Juha Kauppinen',
        album: 'Podcast: Puhetta monimuotoisuudesta',
        genre: 'Podcast',
        date: '23.11.2019', // RFC 3339
        artwork: 'https://www.muutoslehti.fi/wp-content/uploads/powerpress/muutos_podcast_logo.jpg', // Load artwork from the network
        duration: 2247 // Duration in seconds
    };

    const setupTrackPlayer = async () => {
        TrackPlayer.updateOptions({
            jumpInterval: 10,       // 10 second skip interval
        })
        await TrackPlayer.add([track1]).then(() => {
            setPlaying(prevState => ({
                ...prevState,
                name: track1.title,
                status: false,
                progress: 0,
                duration: track1.duration,
                position: track1.position,
                image: track1.artwork
            }))
        })

        const trackObject = await TrackPlayer.getTrack('podcast');
        console.log(`Title: ${trackObject.title}`);
    };

    const updateTrackInfo = async () => {
        await TrackPlayer.getPosition().then(position => {
            setPlaying(prevState => ({
                ...prevState,
                position: position
            }))
        }).catch(e => {
            console.error(e)
        });
    }

    useEffect(() => {
        setupTrackPlayer();
    }, [])

    useEffect(() => {
        updateTrackInfo();
    })

    // TODO: UI for audio controls
    // A basic example function that is passed to customButton and called from there via callback 
    const togglePlayback = () => {
        if (playing.status == false) {
            setPlaying(prevState => ({
                ...prevState,
                status: true
            }));
            TrackPlayer.play()
            ToastAndroid.show('Resumed playback', ToastAndroid.SHORT)
        } else {
            setPlaying(prevState => ({
                ...prevState,
                status: false
            }));
            TrackPlayer.pause()
            ToastAndroid.show('Paused audio', ToastAndroid.SHORT)
        }
    }

    const skip = (way) => {
        switch (way) {
            case 'backward': {
                TrackPlayer.seekTo(playing.position - 100)
                return
            }
            case 'forward': {
                TrackPlayer.seekTo(playing.position + 100)
                return
            }
            default: return
        }

    }

    const handlePress = () => {
        setPlaying(prevState => ({
            ...prevState,
            status: !prevState.status
        }));
    }

    return <View>
        <AudioControls
            title={playing.name}
            duration={playing.duration}
            position={playing.position}
            image={playing.image}
            status={playing.status}
            skip={skip}
            togglePlayback={togglePlayback}
            handlePress={handlePress} />
    </View>
}

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        alignSelf: 'center',
    },
    progress: {
        color: 'black',
        alignSelf: 'center'
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 100,
    },
    audioButton: {
        width: 70,
        height: 70,
        margin: 8,
        borderRadius: 70,
        justifyContent: 'center'
    }
})

export default Audio;