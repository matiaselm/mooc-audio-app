import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import service from '../services/audio';


const Audio = () => {
    const [playing, setPlaying] = useState({
        name: 'Podcast name',
        status: true,
        progress: 0,
        length: '37:45',
    });

    // How the track object should look
    /*
    let track = {
        id: 'unique track id', // Must be a string, required
        
        url: 'http://example.com/avaritia.mp3', // Load media from the network
        url: require('./avaritia.ogg'), // Load media from the app bundle
        url: 'file:///storage/sdcard0/Music/avaritia.wav', // Load media from the file system 
    
        title: 'Avaritia',
        artist: 'deadmau5',
        album: 'while(1<2)',
        genre: 'Progressive House, Electro House',
        date: '2014-05-20T07:00:00+00:00', // RFC 3339
        
        artwork: 'http://example.com/avaritia.png', // Load artwork from the network
        artwork: require('./avaritia.jpg'), // Load artwork from the app bundle
        artwork: 'file:///storage/sdcard0/Downloads/artwork.png' // Load artwork from the file system
    };
    */
    

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

    return  <View style={{marginTop: 100 }}>
            <Text style={styles.name}>{playing.name}</Text>
            <Text style={styles.progress}>{playing.progress}/{playing.length}</Text>
                <View style={styles.buttonGroup}>
                    <Button icon style={styles.audioButton}>
                        <Icon name='play-back-sharp' />
                    </Button>
                    {playing.status == true && 
                        <Button icon style={styles.audioButton} onPress={handlePress}>
                            <Icon name='pause-sharp' /> 
                        </Button>
                    }{playing.status == false &&
                        <Button icon style={styles.audioButton} onPress={handlePress}>
                            <Icon name='play-sharp'/>
                        </Button>
                    }
                
                    <Button icon style={styles.audioButton}>
                        <Icon name='play-forward-sharp' />    
                    </Button>
                </View>
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