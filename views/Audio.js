import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import service from '../services/audio';
import AudioControls from '../components/AudioControls';

const Audio = () => {
    const [playing, setPlaying] = useState({
        name: 'Podcast name',
        status: true,
        progress: 0,
        length: '37:45',
    });
    
    useEffect(()=>{
        /* TrackPlayer.setupPlayer().then(()=>{
            TrackPlayer.registerPlaybackService(service);
        }) */
    },[])

    // TODO: UI for audio controls
    // A basic example function that is passed to customButton and called from there via callback 
    const playAudio = () => {
        console.log('Button pressed');      
    }

    const handlePress = () => {
        setPlaying(prevState => ({
            ...prevState,
            status: !prevState.status
        }));
    }

    return <View>
        <AudioControls style={{marginTop:100}} playing={playing} handlePress={handlePress}/>
    </View>
}

const styles = StyleSheet.create({
    name:{
        fontSize: 28,
        alignSelf:'center',
    },
    progress:{
        color: 'black',
        alignSelf:'center'
    },
    buttonGroup:{
        flex: 1, 
        flexDirection: 'row', 
        alignSelf: 'center',
        marginTop: 100,
    },
    audioButton:{
        width: 70, 
        height: 70, 
        margin: 8, 
        borderRadius: 70,
        justifyContent: 'center'
    }
})

export default Audio;