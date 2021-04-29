import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input, ScrollView, Toast, Picker } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { API_URL } from '@env';
import AppContext from '../AppContext';
import { useTranslation } from 'react-i18next';

export default ({ navigation, userName }) => {
    const { user, notes, getNotes, audio, setAudio, queue, position, setTrackPlayerPosition, language, setLanguage } = useContext(AppContext);
    
    const languages = [
        'fi_FI',
        'en_EN'
    ]

    const prettify = (str) => {
        if (str === 'fi_FI') {
            return 'Suomi'
        }
        if (str === 'en_EN') {
            return 'English'
        }
    }

    return <View style={{ padding: 8 }}>
        <Text style={{ alignSelf: 'center' }}>Settings</Text>
        <Picker
            style={{ width: '100%', height: 50 }}
            selectedValue={prettify(language)}
            onValueChange={(value, index) => {
                setLanguage(value)
                
            }
            }>
            {languages.map((lang, key) => {
                return <Picker.Item key={key} label={prettify(lang)} value={lang} />
            })}
        </Picker>
    </View>
}