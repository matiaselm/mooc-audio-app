import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import audio from './services/audio';
import playerHandler from './services/playerHandler';
import TrackPlayer from 'react-native-track-player';
import { AppRegistry, AppState } from 'react-native';

/* TODO:
 - How to get soundCloud audio playing to work
 - Basic controls for soundCloud audio
 - Voice recognition API for React/JavaScript
 - Sound input to text
*/

const App = (props) => {
  const [isReady, setIsReady] = useState(false)
  
  TrackPlayer.registerPlaybackService(audio);
  TrackPlayer.registerEventHandler(playerHandler);
  TrackPlayer.setupPlayer().then(() => {
    console.log('player set up')
  })

  const loadFont = async () => {

    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    }).then(() => {
      setIsReady(true)
    });
  }

  useEffect(() => {
    loadFont();
  }, []);

  return (!isReady ?
    <AppLoading /> : <Home />
  );
}

export default App;
