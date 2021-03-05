import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { CustomButton } from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';


const Audio = () => {
    const [playing, setPlaying] = useState({
        name: 'Podcast name',
        status: true,
        progress: 0,
        length: '37:45',
    });

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