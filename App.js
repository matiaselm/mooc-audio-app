import React, { useState, useEffect, useContext } from 'react';
import { Button, Text, Icon, View, Root } from 'native-base';
import AppLoading from 'expo-app-loading';
import AppContext from './AppContext';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Home from './views/Home';
import Main from './views/Main';
import Notes from './views/Notes';
import Settings from './views/Settings';
import playerHandler from './services/playerHandler';
import TrackPlayer from 'react-native-track-player';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fromRight } from 'react-navigation-transitions';
import Tts from 'react-native-tts';
import i18n from './services/i18n';
import { useTranslation } from 'react-i18next';
import useAsyncStorageHooks from './services/asyncStorageHooks';

/* TODO:
 - Localstorage user with backend
 - How to get soundCloud audio playing to work
 - Basic controls for soundCloud audio
 - Voice recognition API for React/JavaScript
 - Sound input to text
*/

const App = (props) => {
  const [isReady, setIsReady] = useState(false)
  const [audio, setAudio] = useState(null)
  const [queue, setQueue] = useState([])
  const [notes, setNotes] = useState([])
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [user, setUser] = useState(null)
  const [language, setLanguage] = useState('en_EN');
  const { t, i18n } = useTranslation();
  const { storeData, getData } = useAsyncStorageHooks();
  const languages = ['en_EN', 'fi_FI']

  const Stack = createStackNavigator();

  useEffect(() => {
    loadFont();
    loadUser();
    initTrackPlayer();
    initTts();
  }, []);

  useEffect(() => {
    getNotes();
  }, [user])

  useEffect(() => {
    console.log('lang: ', language)
    setUser((prev => ({
      ...prev,
      language: language
    })))
    Tts.setDefaultLanguage(language)
  }, [language])

  useEffect(() => {
    try {
      if (audio !== null) {
        setTrackPlayerAudio(audio.id)
      }
    } catch (e) {
      console.log(e)
    }
  }, [audio])

  const loadFont = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    }).then(() => {
      setIsReady(true)
    });
  }

  const initTrackPlayer = async () => {
    TrackPlayer.registerEventHandler(playerHandler);
    await TrackPlayer.setupPlayer().then(() => {
      console.log('player set up')
      try {
        const url = `${API_URL}/audio`;
        // console.log('API: ', url);
        axios.get(url).then(response => {
          // console.log('Queue: ', JSON.stringify(response.data.length))
          for (let i in response.data) {
            const responseAudio = {
              ...response.data[i],
              id: response.data[i]._id,
            }
            // console.log('Audio: ', JSON.stringify(responseAudio, '', '\t'));
            TrackPlayer.add(responseAudio)
          }
          TrackPlayer.getQueue().then(_queue => setQueue(_queue));
        });
      } catch (e) {
        console.error('initTrackPlayer error', e.message)
      }
    })
  };

  const initTts = async () => {
    Tts.setDefaultLanguage(language);
    Tts.getInitStatus().then(() => {
      console.log('TTS initialized');
    });
  }

  const createUser = async () => {
    await axios.post(`${API_URL}/user`, {
      name: '',
      language: 'en_EN'
    }).then((response) => {
      let user = response.data
      setUser(user)
      setLanguage(user.language)
      storeData('user', user)
      console.log('Made user', user._id)
    })
  }

  const loadUser = async () => {
    try {
      console.log('Load user')
      await getData('user').then((user) => {
        if (user._id !== null) {
          setUser(user)
          console.log('Got user: ', JSON.stringify(user, '', '\t'))
        } else {
          console.log('No user in storage. Creating a new one...')
          createUser();
        }
      })
    } catch (e) {
      console.error(e)
    }
  };

  const getNotes = async () => {
    if (user && user._id !== null) {
      try {
        console.log('Getting notes for user: ', user._id);
        await axios.get(`${API_URL}/user/note`, {
          params: { userID: user._id }
        }).then((response, err) => {
          if (err) {
            console.error(err)
          } else {
            // console.log('Got notes: ', JSON.stringify(response.data))
            setNotes(response.data)
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  const getPosition = async () => {
    await TrackPlayer.getPosition().then(position => {
      setPosition(position);
    }).catch(e => {
      console.error(e)
    });
  }

  const togglePlayback = async (status) => {
    if (status) {
      console.log('Play')
      setPlaying(true);
      await TrackPlayer.play()
    } else {
      console.log('Pause')
      setPlaying(false);
      await TrackPlayer.pause()
    }
  }

  const skip = async (way) => {
    const jumpInterval = 30
    if (way === 'backward') {
      await TrackPlayer.seekTo(position - jumpInterval)
    }
    if (way === 'forward') {
      await TrackPlayer.seekTo(position + jumpInterval)
    }
  }

  const setTrackPlayerAudio = async (id) => {
    try {
      TrackPlayer.skip(id)
      console.log('Changed to track ', id)
    } catch (e) {
      console.log('setTrackPlayerAudio error: ', e.message)
    }
  }

  const appContextProvider = React.useMemo(() => {
    return {
      user: user,
      setUser: setUser,

      audio: audio,
      setAudio: setAudio,

      playing: playing,
      togglePlayback: togglePlayback,

      skip: skip,

      position: position,
      setPosition: setPosition,
      getPosition: getPosition,

      queue: queue,
      setQueue: setQueue,

      notes: notes,
      setNotes: setNotes,
      getNotes: getNotes,

      language: language,
      setLanguage: setLanguage,
      languages: languages
    };
  }, [user, audio, queue, notes, position, playing, language]);

  return !isReady ? <AppLoading /> :
    <Root>
      <AppContext.Provider value={appContextProvider}>
        <NavigationContainer
          headerMode={'float'}>
          <Stack.Navigator
            screenOptions={{
              headerMode: 'screen',
              transitionConfig: fromRight()
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Notes" component={Notes} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContext.Provider>
    </Root>
}

export default App;
