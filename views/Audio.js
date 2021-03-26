import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, ToastAndroid } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import AudioControls from '../components/AudioControls';
import TrackPlayer from 'react-native-track-player';

const Audio = () => {
    const [playing, setPlaying] = useState({
        name: 'Podcast name',
        status: true,
        progress: 0,
        length: '37:45',
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
        await TrackPlayer.add([track1]).then(() => {
            setPlaying(prevState =>({
               ...prevState,
               name: track1.title,
               status: true,
               progress: 0,
               length: track1.duration 
            }))
        })

        const trackObject = await TrackPlayer.getTrack(trackId);
        console.log(`Title: ${trackObject.title}`);

        const position = await TrackPlayer.getPosition();
        const duration = await TrackPlayer.getDuration();
        console.log(`${duration - position} seconds left.`);
    };

    useEffect(() => {
        setupTrackPlayer();
    }, [])


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

    const handlePress = () => {
        setPlaying(prevState => ({
            ...prevState,
            status: !prevState.status
        }));
    }

    return <View>
        <AudioControls style={{ marginTop: 100 }} playing={playing} togglePlayback={togglePlayback} handlePress={handlePress} />
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