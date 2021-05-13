import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { EdgeInsetsPropType, FlatList, ProgressViewIOSComponent, TouchableOpacity } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input, ScrollView, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { API_URL } from '@env';
import CustomHeader from '../components/CustomHeader';
import AppContext from '../AppContext';
import TrackPlayer from 'react-native-track-player';
import useAxiosHooks from '../services/axiosHooks';
import COLORS from '../assets/colors';
import { useTranslation } from 'react-i18next';

const Notes = ({ navigation, userName }) => {
    const [input, setInput] = useState('');
    const [edit, setEdit] = useState({ state: false, noteID: null });
    const { user, notes, audio, setAudio, position, setTrackPlayerPosition, updateNotes, language } = useContext(AppContext);
    const { postNote, modifyNote, deleteNote } = useAxiosHooks();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('views.notes')
        })
    }, [navigation, language])

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

    const changeAudioToNote = async (audio, position) => {
        try {
            setAudio(audio)
            await TrackPlayer.getCurrentTrack().then(() => {
                TrackPlayer.seekTo(position)
              })
            navigation.goBack();
        } catch (e) {
            console.error(e)
        }
    }

    const minutesAndSeconds = (position) => ([
        pad(Math.floor(position / 60), 2),
        pad(position % 60, 2)
    ]);

    const handleEdit = (editable) => {
        if(editable.id == edit.noteID) {
            setEdit({
                state: false,
                noteID: null
            })
        } else {
            setEdit({
                state: true,
                noteID: editable.id
            })
        }
    }

    const noteItem = ({ item }) => {
        const timeStamp = minutesAndSeconds(item.timestamp)
        const itemAudio = item.audioID

        // console.log('ITEM: ', JSON.stringify(item, '', '\t'))
        return <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={{ minHeight: 30, borderBottomWidth: 1, borderColor: COLORS.GREY2, padding: 8, display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 5 }}>
                <Text numberOfLines={1} style={{ color: COLORS.GREY2, marginBottom: 8, fontSize: 14 }}>
                    {itemAudio.title}</Text>

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
                <Icon color={COLORS.PRIMARY} name='headphones-alt' size={22} style={{ alignSelf: 'center' }} />
            </Button>
        </TouchableOpacity>
    };

    return <View>
        <View style={{ height: '100%', paddingBottom: 80, padding: 8 }}>
            <FlatList
                keyExtractor={item => item.id}
                data={notes ?? []}
                renderItem={noteItem}
            >
            </FlatList>

            { edit.state && <View style={{ height: 36, bottom: 0, width: '110%', backgroundColor: COLORS.PRIMARY, right: -8, left: -8 }}>
                <Text style={{ color: 'white', margin: 4 }}>Muokkaat {edit.noteID}</Text>
            </View> }

            <Form style={{ position: 'absolute', bottom: 0, display: 'flex', flexDirection: 'row', backgroundColor: COLORS.WHITE, width: '105%', padding: 8 }}>
                <Item style={{ flex: 4 }}>
                    <Input
                        placeholder={t('createNote')}
                        value={input}
                        onChangeText={text => setInput(text)}>
                    </Input>
                </Item>
                <Button icon style={{ flex: 1, borderRadius: 16, maxWidth: 60, alignSelf: 'center', borderWidth: 3, borderColor: COLORS.PRIMARY, backgroundColor: COLORS.SECONDARY, elevation: 10 }}
                    onPress={() => {
                        if (edit.state && input.length > 0) {
                            modifyNote(edit.noteID, input)
                            setInput('')
                            updateNotes();
                            setEdit({state: false, noteID: null})
                            return
                        }
                        if (input.length > 0) {
                            postNote(position, input, audio.id, user.id)
                            setInput('')
                            updateNotes();
                            return
                        } else {
                            Toast.show({ text: t('pleaseWrite'), duration: 2000, position: 'bottom', buttonText: t('ok') });
                            return
                        }
                    }}>
                    <Icon name='pen-fancy' light size={26} color={COLORS.PRIMARY} style={{ marginStart: 16 }} />
                </Button>
            </Form>
        </View>
    </View>
}

export default Notes;