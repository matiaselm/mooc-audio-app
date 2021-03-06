import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, AppState } from 'react-native';
import { Root, View, Button, Text } from 'native-base';
import AppLoading from 'expo-app-loading';
import AppContext from './AppContext';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Home from './views/Home';
import Main from './views/Main';
import Notes from './views/Notes';
import Settings from './views/Settings';
import TrackPlayer from 'react-native-track-player';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fromRight } from 'react-navigation-transitions';
import Tts from 'react-native-tts';
import { useTranslation } from 'react-i18next';
import useAsyncStorageHooks from './services/asyncStorageHooks';
import useAxiosHooks from './services/axiosHooks';
import i18n from './services/i18n';
import Icon from 'react-native-vector-icons/FontAwesome5';

const App = () => {
  const [isReady, setIsReady] = useState({ font: false, audio: false, trackPlayer: false })
  const [refresh, setRefresh] = useState(false)
  const [audio, setAudio] = useState(null)
  const [queue, setQueue] = useState([])
  const [notes, setNotes] = useState([])
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [language, setLanguage] = useState('en_EN');
  const { t, i18n } = useTranslation();
  const languages = ['en_EN', 'fi_FI']

  const [user, setUser] = useState(null)

  const { postUser, modifyUser, getUser, getNotes, getAudio, postNote } = useAxiosHooks();
  const { storeData, getData, removeUser } = useAsyncStorageHooks();

  const Stack = createStackNavigator();

  useEffect(() => {
    initTrackPlayer();
    loadFont();
    loadUser();
    populateQueue();
    initTts();
  }, []);

  useEffect(() => {
    populateQueue();
  }, [refresh])

  useEffect(() => {
    // console.log('USER', JSON.stringify(user))
    try {
      if (user !== null) {
        storeData('user', user)
        updateNotes();
      } else {
        console.log(`User shouldn't be null`)
      }
    } catch (e) {
      console.log(`note update error`, e.message)
    }
  }, [user])

  useEffect(() => {
    console.log('lang: ', language)
    Tts.setDefaultLanguage(language)
    setUser(prev => ({
      ...prev,
      language: language
    }));
  }, [language])

  useEffect(() => {
    try {
      if (audio !== null) {
        setTrackPlayerAudio(audio.id)
        setIsReady(prev => ({
          ...prev,
          trackPlayer: true
        }))
      }
    } catch (e) {
      console.log(e)
    }
  }, [audio, refresh])

  const loadFont = async () => {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    }).then(() => {
      setIsReady(prev => ({
        ...prev,
        font: true
      }));
    });
  }

  const initTrackPlayer = async () => {
    TrackPlayer.setupPlayer()
    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP
      ]
    })
  }

  const updateNotes = async () => {
    await getNotes(user.id).then(notes => {
      // console.log('notes', JSON.stringify(notes, '', '\t'))
      setNotes(notes)
    })
  }

  const populateQueue = async () => {
    try {
      // console.log('AudioList')
      const audioList = await getAudio();
      setQueue(audioList)

      for (let i in audioList) {
        TrackPlayer.add(audioList[i])
      }

      setIsReady(prev => ({
        ...prev,
        audio: true
      }));
      setAudio(audioList[0])
    } catch (e) {
      console.error('initTrackPlayer error', e.message)
    }
  }

  const initTts = async () => {
    Tts.setDefaultLanguage(language);
    Tts.getInitStatus().then(() => {
      console.log('TTS initialized');
    });
  }

  const loadUser = async () => {
    try {
      console.log('Load user')
      const asyncStorageUser = await getData('user')

      if (asyncStorageUser !== null) {
        console.log('asyncStorageUser', asyncStorageUser)
        setUser(asyncStorageUser)
        console.log('Got user: ', JSON.stringify(asyncStorageUser, '', '\t'))
      } else {
        console.log('No user in storage. Creating a new one...')
        const _user = await postUser()

        if (_user) {
          console.log('Saving user', JSON.stringify(_user, '', '\t'))
          setUser(_user)
          setLanguage(_user.language)
          storeData('user', _user)
          console.log('Made user', _user.id)
        } else {
          console.log(`Didn't make user`)
        }
      }
    } catch (e) {
      console.error(e)
    }
  };

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
      await TrackPlayer.skip(id)
      console.log('Changed to track ', id)
    } catch (e) {
      console.log('setTrackPlayerAudio error: ', e.message)
    }
  }

  const appContextProvider = React.useMemo(() => {
    return {
      user: user,
      setUser: setUser,

      refresh: refresh,
      setRefresh: setRefresh,

      audio: audio,
      setAudio: setAudio,

      playing: playing,
      togglePlayback: togglePlayback,

      skip: skip,

      position: position,
      setPosition: setPosition,
      getPosition: getPosition,

      queue: queue,
      populateQueue: populateQueue,
      setQueue: setQueue,

      notes: notes,
      setNotes: setNotes,
      updateNotes: updateNotes,

      language: language,
      setLanguage: setLanguage,
      languages: languages
    };
  }, [user, audio, queue, notes, position, playing, language, refresh]);

  return !isReady.font ? <AppLoading /> :
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
