import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input, ScrollView, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { API_URL } from '@env';
import CustomHeader from '../components/CustomHeader';
import AppContext from '../AppContext';
import TrackPlayer from 'react-native-track-player';
import useAxiosHooks from '../services/axiosHooks';
import COLORS from '../assets/colors';

const Notes = ({ navigation, userName }) => {
    const [input, setInput] = useState('');
    const { user, notes, audio, setAudio, position, setTrackPlayerPosition } = useContext(AppContext);
    const { postNote } = useAxiosHooks();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('views.notes')
        })
    }, [navigation])

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
        const itemAudio = item.audioID.title

        console.log('ITEM: ', JSON.stringify(item, '', '\t'))
        return <View
            style={{ minHeight: 30, borderBottomWidth: 1, borderColor: COLORS.GREY2, padding: 8, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 5 }}>
                <Text numberOfLines={1} style={{ color: COLORS.GREY2, marginBottom: 8, fontSize: 14 }}>
                    {itemAudio}</Text>
                    
                <Text style={{ fontSize: 18 }}>{item?.data}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>

                    <Icon
                        name='clock'
                        size={18}
                        color={COLORS.GREY2}
                        style={{ marginEnd: 8, alignSelf: 'center' }} />

                    <Text style={{ alignSelf: 'center', color: COLORS.BLACK, fontSize: 14 }}>
                        {timeStamp[0] + ":" + Math.floor(timeStamp[1])}min</Text>

                </View>
            </View>

            <Button icon light
                style={{ flex: 1, alignSelf: 'flex-end', justifyContent: 'center', backgroundColor: COLORS.WHITE, borderRadius: 16, marginStart: 8, elevation: 10 }}
                onPress={() => changeAudioToNote(itemAudio, item.timestamp)}>
                <Icon color={COLORS.PRIMARY} name='headphones-alt' size={26} style={{ margin: 8, alignSelf: 'center' }} />
            </Button>
        </View>
    };

    return <View>
        <View style={{ height: '100%', padding: 8, paddingBottom: 76 }}>
            <FlatList
                keyExtractor={item => item.id}
                data={notes ?? []}
                renderItem={noteItem}
            >
            </FlatList>

            <Form style={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row', backgroundColor: COLORS.WHITE, width: '105%', padding: 8 }}>
                <Item style={{ flex: 4 }}>
                    <Input
                        placeholder='Create note'
                        value={input}
                        onChangeText={text => setInput(text)}>
                    </Input>
                </Item>
                <Button icon style={{ flex: 1, borderRadius: 16, maxWidth: 60, alignSelf: 'center', borderWidth: 3, borderColor: COLORS.PRIMARY, backgroundColor: COLORS.SECONDARY, elevation: 10 }}
                    onPress={() => {
                        if (input.length > 0) {
                            postNote(0.0, input, "6076d956ee8dc441dc6291c1", user.id)
                            setInput('')
                        } else {
                            Toast.show({ text: `Maybe you'd want to write something before saving it?`, duration: 2000, position: 'bottom', buttonText: 'Okay' });
                        }
                    }}>
                    <Icon name='pen-fancy' light size={26} color={COLORS.PRIMARY} style={{ marginStart: 16 }} />
                </Button>
            </Form>
        </View>
    </View>
}

export default Notes;