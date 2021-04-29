import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Text, Button, View, Picker, Form, Item, Input, Label } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { API_URL } from '@env';
import AppContext from '../AppContext';
import { useTranslation } from 'react-i18next';

export default ({ navigation, userName }) => {
    const { user, notes, getNotes, audio, setAudio, queue, position, setTrackPlayerPosition, language, setLanguage, languages } = useContext(AppContext);
    const { t, i18n } = useTranslation();

    const [input, setInput] = useState();

    const prettify = (str) => {
        switch (str) {
            case 'fi_FI': return 'Suomi'
            case 'en_EN': return 'English'
            default: return null
        }
    }

    return <View style={{ padding: 8 }}>

        <View style={{ display: 'flex', flexDirection: 'row', height: 60, justifyContent: 'flex-start', borderBottomColor: '#dadada', borderBottomWidth: 1 }}>
            <Text style={{ flex: 2, alignSelf: 'center' }}>{t('language')}</Text>
            <Picker
                style={{ flex: 1 }}
                selectedValue={prettify(language)}
                onValueChange={(value, index) => {
                    i18n.changeLanguage(value)
                    setLanguage(value)
                }}>
                {languages.map((lang, key) => {
                    return <Picker.Item key={key} label={prettify(lang)} value={lang} />
                })}
            </Picker>
        </View>

        <View style={{ paddingVertical: 4, display: 'flex', flexDirection: 'row', height: 60, justifyContent: 'flex-start', borderBottomColor: '#dadada', borderBottomWidth: 1 }}>
            <Text style={{ flex: 1, alignSelf: 'center' }}>{t('username')}</Text>
            <Input style={{ flex: 2, backgroundColor: '#FFF', alignSelf: 'center', height: '90%', borderRadius: 8 }} value={input} onChangeText={(text) => setInput(text)} />
        </View>
    </View>
}