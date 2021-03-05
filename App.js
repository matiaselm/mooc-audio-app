import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import Home from './views/Home';

/* TODO:
 - How to get soundCloud audio playing to work
 - Basic controls for soundCloud audio
 - Voice recognition API for React/JavaScript
 - Sound input to text
*/

const App = (props) => {
  const [state, setState] = useState({
    isReady:false
  })

  useEffect(() => {
    Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    setState({ isReady: true });
  },[]);

  return (!state.isReady ? 
  <AppLoading/> : 
    <Container>
      <Home></Home>
    </Container>
  );
}

export default App;
