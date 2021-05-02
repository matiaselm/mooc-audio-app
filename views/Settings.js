import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Text, Button, View, Picker, Form, Item, Input, Label } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { API_URL } from '@env';
import AppContext from '../AppContext';
import { useTranslation } from 'react-i18next';
import COLORS from '../assets/colors';
import useAsyncStorageHooks from '../services/asyncStorageHooks';

export default ({ navigation, userName }) => {
    const { user, setUser, notes, audio, setAudio, queue, position, setTrackPlayerPosition, language, setLanguage, languages } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const { removeUser } = useAsyncStorageHooks();

    const [input, setInput] = useState(user.name);

    const prettify = (str) => {
        switch (str) {
            case 'fi_FI': return 'Suomi'
            case 'en_EN': return 'English'
            default: return null
        }
    }

    const save = () => {
        setUser(prev => ({
            ...prev,
            name: input
        }))
    }

    const changeLang = (lang) => {
        if (lang === 'fi_FI') {
            i18n.changeLanguage('en_EN')
            setLanguage('en_EN')
        }
        if (lang === 'en_EN') {
            i18n.changeLanguage('fi_FI')
            setLanguage('fi_FI')
        }
        else {
            i18n.changeLanguage('en_EN')
            setLanguage('en_EN')
        }
    }

    return <View style={{ padding: 8 }}>

        <View style={{ display: 'flex', flexDirection: 'row', height: 60, justifyContent: 'flex-start', borderBottomColor: '#dadada', borderBottomWidth: 1 }}>
            <Text style={{ flex: 2, alignSelf: 'center' }}>{t('language')}: {prettify(language)}</Text>
            <Button transparent icon onPress={() => changeLang(language)}>
                <Icon name='globe' color={COLORS.PRIMARY} size={34}/>
                <Text>
                    {t('language')}
                </Text>
            </Button>
        </View>

        <View style={{ paddingVertical: 4, display: 'flex', flexDirection: 'row', height: 60, justifyContent: 'flex-start', borderBottomColor: '#dadada', borderBottomWidth: 1 }}>
            <Text style={{ flex: 1, alignSelf: 'center' }}>{t('username')}</Text>
            <Input style={{ flex: 2, backgroundColor: '#FFF', alignSelf: 'center', height: '90%', borderRadius: 8 }} value={input} onChangeText={(text) => setInput(text)} />
        </View>


        <Button transparent icon onPress={save} style={{ alignSelf: 'flex-end' }} >
            <Icon name='cloud' size={34} color={COLORS.PRIMARY} style={{ alignSelf: 'center' }} />
            <Text>
                {t('save')}
            </Text>
        </Button>
    </View>
}