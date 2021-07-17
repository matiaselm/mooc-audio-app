import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { PermissionsAndroid, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, View, Input, Toast } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AppContext from '../AppContext';
import Voice from '@react-native-voice/voice';
import TrackPlayer from 'react-native-track-player';
import { useTranslation } from 'react-i18next';
import COLORS from '../assets/colors';
import useAxiosHooks from '../services/axiosHooks';
import IndexContext from '../IndexContext';

export default ({ navigation }) => {
    const { user, setUser, language, setLanguage, errors, populateQueue } = useContext(AppContext);
    const { t, i18n } = useTranslation();
    const { modifyUser } = useAxiosHooks();
    const [voiceState, setVoiceState] = useState({ isAvailable: false, services: false })
    const [perm, setPerm] = useState(false)
    const [info, setInfo] = useState(false)

    const {
        createPorcupineManager,
        stopPorcupineManager,

        porcupineState,
    } = useContext(IndexContext);

    const [input, setInput] = useState(user.name);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: t('views.settings')
        })
    }, [navigation, language])

    useEffect(() => {
        Voice.isAvailable().then(res => {
            setVoiceState(prev => ({ ...prev, isAvailable: res }))
        })
        Voice.getSpeechRecognitionServices().then(res => {
            setVoiceState(prev => ({ ...prev, services: res }))
        })
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(res => {
            setPerm(res)
        })
    }, []);

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
        modifyUser(user)
        Toast.show({ text: 'Muutokset tallennettu', duration: 2000, position: 'bottom', buttonText: t('ok') });
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

    const requestVoicePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Audio permissions",
                    message:
                        "We need to access your microphone " +
                        "so you could use the app as it's meant to.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Can use microphone");
                setPerm(true)
            } else {
                console.log("Permission denied");
                setPerm(false)
            }
        } catch (err) {
            console.warn(err);
        }
    };

    return <View>
        <ScrollView keyboardShouldPersistTaps='always' style={{ display: 'flex', flexDirection: 'column', padding: 8, paddingVertical: 0  }}>
            <Text>{t('porcupineInfoText')}</Text>

            <View style={{ display: 'flex', flexDirection: 'row', height: 60, justifyContent: 'flex-start', borderBottomColor: '#dadada', borderBottomWidth: 1 }}>
                <Text style={{ flex: 2, alignSelf: 'center' }}>{t('language')}: {prettify(language)}</Text>
                <Button style={{ backgroundColor: COLORS.PRIMARY, margin: 4 }} onPress={() => changeLang(language)}>
                    <Icon name='globe' color={COLORS.WHITE} size={24} style={{ marginStart: 8 }} />
                    <Text>
                        {t('language')}
                    </Text>
                </Button>
            </View>

            <View style={{ paddingVertical: 4, display: 'flex', flexDirection: 'row', height: 60, justifyContent: 'flex-start', borderBottomColor: '#dadada', borderBottomWidth: 1, marginBottom: 16 }}>
                <Text style={{ flex: 1, alignSelf: 'center' }}>{t('username')}</Text>
                <Input style={{ flex: 2, backgroundColor: '#FFF', alignSelf: 'center', height: '90%', borderRadius: 8 }} value={input} onChangeText={(text) => setInput(text)} />
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text>{t('deleteTrack')}</Text>
                    <Text style={{ fontSize: 14 }}>{t('deleteTrackInfo')}</Text>
                </View>

                <TouchableOpacity icon style={styles.lightButton} onPress={() => TrackPlayer.destroy()}>
                    <Icon size={26} name='trash' style={{ color: '#006064' }} />
                </TouchableOpacity>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomColor: '#dadada', borderBottomWidth: 1, }}>
                <View style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text>{t('refresh')}</Text>
                    <Text style={{ fontSize: 14 }}>{t('refreshInfo')}</Text>
                </View>

                <TouchableOpacity icon style={styles.lightButton} onPress={populateQueue}>
                    <Icon size={26} name='sync' style={{ color: '#006064' }} />
                </TouchableOpacity>
            </View>

            <View style={{ display: 'flex', flexDirection: 'column' }}>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{t('createPorcupineManager')}</Text>
                    <Button icon transparent onPress={createPorcupineManager} style={{ margin: 4, alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: 50 }} >
                        <Icon name='play' style={{ color: COLORS.PRIMARY, alignContent: 'flex-end' }} size={30} />
                    </Button>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{t('deletePorcupineManager')}</Text>
                    <Button icon transparent onPress={stopPorcupineManager} style={{ margin: 4, alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10, width: 50 }} >
                        <Icon name='stop' style={{ color: COLORS.PRIMARY, alignItems: 'flex-end' }} size={30} />
                    </Button>
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{t('requestVoicePermission')}</Text>
                    <Button icon transparent onPress={requestVoicePermission} style={{ margin: 4, alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 10, width: 50 }} >
                        <Icon name='microphone' style={{ color: COLORS.PRIMARY, alignItems: 'flex-end' }} size={30} />
                    </Button>
                </View>

            </View>

            <View style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button onPress={save} style={{ backgroundColor: COLORS.PRIMARY, margin: 8, alignSelf: 'center', widht: '50%' }} >
                    <Text>
                        {t('save')}
                    </Text>
                </Button>

                <Button onPress={() => setInfo(!info)} style={{ backgroundColor: COLORS.SECONDARY_VARIANT, margin: 8, alignSelf: 'center', widht: '50%' }} >
                    <Text>
                        {t('showErrors')}
                    </Text>
                </Button>
            </View>


            <View style={{ flex: 1, paddingVertical: 4, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', borderTopColor: '#dadada', borderTopWidth: 1 }}>
                <Text style={{ flex: 1, fontSize: 18 }}>User info</Text>
                <Text style={{ flex: 1 }}>Name: {user.name}</Text>
                <Text style={{ flex: 1 }}>ID: {user.id}</Text>
                <Text style={{ flex: 1 }}>Language: {prettify(user.language)}</Text>
            </View>

            <View style={{ flex: 1, paddingVertical: 4, width: '100%', borderTopColor: '#dadada', borderTopWidth: 1 }}>
                <Text style={{ marginTop: 10, fontSize: 18 }}>Voice recording info</Text>
                <Text>Voice recording available on system: {voiceState.isAvailable.toString()}</Text>
                <Text>Voice permissions granted: {perm.toString()}</Text>
                <Text>Wake word listening: {porcupineState.toString()}</Text>
                <Text style={{ marginTop: 10, fontSize: 18 }}>Services:</Text>
                {voiceState.services && voiceState.services.map((s, i) => {
                    return <Text key={i} style={{ flex: 1 }}>{s}</Text>
                })}
            </View>

            {info && <View style={{ flex: 1, marginBottom: 40 }} >
                <Text style={{ marginTop: 10, fontSize: 18 }}>Latest errors</Text>
                {errors?.length > 0 && errors.map((e, i) => {
                    return <Text key={i} style={{ color: '#B0171F' }}>{e?.toString()}</Text>
                })}
            </View>}

        </ScrollView>

    </View>
}

const styles = StyleSheet.create({
    lightButton: {
        margin: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
})