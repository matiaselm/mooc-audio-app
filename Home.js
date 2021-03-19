import React, {useState, useEffect} from 'react';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './components/CustomButton';
import CustomFooter from './components/CustomFooter';
import CustomHeader from './components/CustomHeader';
import Main from './views/Main';
import Audio from './views/Audio';
import Axios from 'axios';
import axios from 'axios';

const Home = (props) => {
    const [view, setView] = useState('main');

    // Handles changing views
    const changeTab = (name) => {
        switch(name){
            case 'main':{
                setView(name)
                return
            }
            case 'audio':{
                setView(name)
                return
            }
            default:{
                setView('main')
                return
            }
        }
    }

    // Makes first letter uppercase. For prettier UI
    const capitalize = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    return  <> 
        <CustomHeader title={capitalize(view)}/>  
            <Container>
                <Content>
                    {view == 'main' && <Main/>}
                    {view == 'audio' && <Audio/>}
                </Content>
            </Container>
        <CustomFooter view={view} changeTab={changeTab}/> 
    </>  
}

export default Home;