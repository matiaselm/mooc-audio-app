import React, { useState, useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import audio from './services/audio';
import playerHandler from './services/playerHandler';
import TrackPlayer from 'react-native-track-player';
import { API_URL } from '@env';
import { ls } from 'react-native-local-storage';
import axios from 'axios';

/* TODO:
 - Localstorage user with backend
 - How to get soundCloud audio playing to work
 - Basic controls for soundCloud audio
 - Voice recognition API for React/JavaScript
 - Sound input to text
*/

const App = (props) => {
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState(null)

  const initTrackPlayer = async () => {
    TrackPlayer.registerPlaybackService(audio);
    TrackPlayer.registerEventHandler(playerHandler);
    TrackPlayer.setupPlayer().then(() => {
      console.log('player set up')
      try {
        const url = `${API_URL}/audio`;
        // console.log('API: ', url);
        axios.get(url).then(response => {
          console.log('Queue: ', response.data.length)
          for (let i in response.data) {
            const responseAudio = {
              ... response.data[i],
              id: response.data[i]._id
            }
            TrackPlayer.add(responseAudio)
          }
        });
      } catch (e) {
        console.error(e.message)
      }
    })
  }

  useEffect(() => {
    initTrackPlayer();
  }, [])

  const loadUser = async () => {
    ls.get('user').then((user) => {
      if (user) {
        setUser(user)
      } else {
        /* await axios.post('user', ) ... TODO
        .then((response) => {
          setUser(response.data)
          ls.set('user',response.data)
        })
        */
      }
    })
  }

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
