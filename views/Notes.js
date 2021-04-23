import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input, ScrollView } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { API_URL } from '@env';
import CustomHeader from '../components/CustomHeader';
import AppContext from '../AppContext';
import TrackPlayer from 'react-native-track-player';

const Notes = ({ navigation, userName }) => {
    const [input, setInput] = useState(null);
    const { user, notes, getNotes, audio, setAudio, position, setTrackPlayerPosition } = useContext(AppContext);

    const postNote = async (data) => {
        await axios.post(`${API_URL}/user/note`, {
            timestamp: position,
            data: data,
            audioID: audio.id,
            userID: user._id
        }).then((response, err) => {
            if (err) {
                console.error(err)
            } else {
                console.log(JSON.stringify(response.data))
                getNotes();
            }
        })
    }

    const decimalAdjust = (type, value, exp) => {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    const floor10 = (value, exp) => decimalAdjust('floor', value, exp);

    const pad = (n, width, z = 0) => {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    const changeAudioToNote = (audio, position) => {
        try {
            setAudio(audio)
            setTrackPlayerPosition(position)
            navigation.goBack();
        } catch (e) {
            console.error(e)
        }
    }

    const minutesAndSeconds = (position) => ([
        pad(Math.floor(position / 60), 2),
        pad(position % 60, 2)
    ]);

    const noteItem = ({ item }) => {
        const timeStamp = minutesAndSeconds(item.timestamp)
        const itemAudio = {
            ...item.audioID,
            id: item.audioID._id
        }
        console.log('ITEM: ', JSON.stringify(item, '', '\t'))
        return <View style={{ minHeight: 30, borderBottomWidth: 1, borderColor: '#dadada', padding: 8, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 5 }}>
                <Text numberOfLines={1} style={{ color: '#adadad', marginBottom: 8, fontSize: 14 }}>{itemAudio.title}</Text>
                <Text style={{ fontSize: 18 }}>{item.data}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
                    <Icon name='clock' size={18} color={'#adadad'} style={{ marginEnd: 8, alignSelf: 'center' }} /><Text style={{ alignSelf: 'center', color: '#0f0f0f', fontSize: 14 }}>{timeStamp[0] + ":" + Math.floor(timeStamp[1])}min</Text>
                </View>
            </View>
            <Button icon transparent style={{ flex: 1, alignSelf: 'flex-start' }} onPress={() => changeAudioToNote(itemAudio, item.timestamp)}>
                <Icon color={'#000'} name='headphones' size={24} style={{ marginStart: 8, alignSelf: 'center' }} />
            </Button>
        </View>
    };

    return <View>
        <CustomHeader title={'Notes'} onPressNavigation={() => navigation.goBack()} userName={userName} />

        <View style={{ height: '100%', padding: 8, paddingBottom: 200 }}>
            <FlatList
                keyExtractor={item => item._id}
                data={notes ?? []}
                renderItem={noteItem}
            >
            </FlatList>

            <Form style={{ position: 'absolute', bottom: 130, display: 'flex', flexDirection: 'row', backgroundColor: '#fff', width: '100%' }}>
                <Item style={{ flex: 4 }}>
                    <Input
                        placeholder='Create note'
                        value={input}
                        onChangeText={text => setInput(text)}>
                    </Input>
                </Item>
                <Button icon transparent style={{ flex: 1, borderRadius: 8, maxWidth: 60 }}
                    onPress={() => {
                        postNote(input)
                        setInput('')
                    }}>
                    <Icon name='pen' size={20} color={'#000'} style={{ marginStart: 16 }} />
                </Button>
            </Form>

        </View>
    </View>
}

export default Notes;