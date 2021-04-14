import React, { useState, useEffect } from 'react';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './components/CustomButton';
import CustomFooter from './components/CustomFooter';
import CustomHeader from './components/CustomHeader';
import Main from './views/Main';
import Audio from './views/Audio';
import axios from 'axios';
import { API_URL } from '@env';

const Home = (props) => {
    const [view, setView] = useState('main');

    const [audioArray, setAudioArray] = useState([]);
    const [audio, setAudio] = useState({});

    const getAudio = async () => {
        try {
            const url = `${API_URL}/audio`;
            console.log('API: ', url);
            await axios.get(`${API_URL}/audio`).then(response => {
                console.log('Audio response: ', response.data)
                setAudioArray(response.data)
            });
        } catch (e) {
            console.error(e.message)
        }
    }

    useEffect(() => {
        getAudio()
    }, [view])

    // Handles changing views
    const changeTab = (name) => {
        switch (name) {
            case 'main': {
                setView(name)
                return
            }
            case 'audio': {
                setView(name)
                return
            }
            default: {
                setView('main')
                return
            }
        }
    }

    // Makes first letter uppercase. For prettier UI
    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    return <>
        <CustomHeader title={capitalize(view)} />
        <Container>
            <Content>
                {view == 'main' && <Main />}
                {view == 'audio' && <Audio />}
            </Content>
        </Container>
        <CustomFooter view={view} changeTab={changeTab} />
    </>
}

export default Home;