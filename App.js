import React, { useState, useEffect, useContext } from 'react';
import { Button, Text, Icon, View } from 'native-base';
import AppLoading from 'expo-app-loading';
import AppContext from './AppContext';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import Home from './views/Home';
import Main from './views/Main';
import Notes from './views/Notes';
import playerHandler from './services/playerHandler';
import TrackPlayer from 'react-native-track-player';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
  const [audio, setAudio] = useState(null)
  const [queue, setQueue] = useState([])
  const [notes, setNotes] = useState([])
  const [position, setPosition] = useState(0);

  const Stack = createStackNavigator();

  const storeData = async (key, _data) => {
    const jsonData = JSON.stringify(_data)
    try {
      await AsyncStorage.setItem(key, jsonData)
    } catch (e) {
      console.error(e)
    }
  }

  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return JSON.parse(jsonValue) ?? null;
    } catch (e) {
      console.error(e)
    }
  }

  const initTrackPlayer = async () => {
    TrackPlayer.registerPlaybackService(audio);
    TrackPlayer.registerEventHandler(playerHandler);
    await TrackPlayer.setupPlayer().then(() => {
      console.log('player set up')
      try {
        const url = `${API_URL}/audio`;
        // console.log('API: ', url);
        axios.get(url).then(response => {
          console.log('Queue: ', response.data.length)
          for (let i in response.data) {
            const responseAudio = {
              ...response.data[i],
              id: response.data[i]._id
            }
            TrackPlayer.add(responseAudio)
          }
          TrackPlayer.getQueue().then(queue => setQueue(queue));
        });
      } catch (e) {
        console.error(e.message)
      }
    })
  };

  const createUser = async () => {
    await axios.post(`${API_URL}/user`, {
      name: ''
    }).then((response) => {
      let user = response.data
      setUser(user)
      storeData('user', user)
      console.log('Made user', user._id)
    })
  }

  const loadUser = async () => {
    try {
      console.log('Load user')
      await getData('user').then((user) => {
        if (user) {
          setUser(user)
          console.log('Got user: ', JSON.stringify(user,'','\t'))
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

  useEffect(() => {
    loadUser();
    initTrackPlayer();
  }, []);

  useEffect(() => {
    getNotes();
  }, [user])

  const appContextProvider = React.useMemo(() => {
    return {
      user: user,
      setUser: setUser,
      audio: audio,
      setAudio: setAudio,
      position: position,
      setPosition: setPosition,
      queue: queue,
      setQueue: setQueue,
      notes: notes,
      setNotes: setNotes,
      getNotes: getNotes,
    };
  }, [user, audio, queue, notes, position]);

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

  return !isReady ? <AppLoading /> :
    <AppContext.Provider value={appContextProvider}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Notes" component={Notes} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
}

export default App;
