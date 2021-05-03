import React, { useState, useEffect, useContext } from 'react';
import { RecyclerViewBackedScrollView, StyleSheet, Image } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon, Picker } from 'native-base';
import { skip } from 'react-native-track-player';
import ProgressBar from './ProgressBar';
import AppContext from '../AppContext';
import COLORS from '../assets/colors';

const AudioControls = ({ style }) => {
    const {
        audio,
        setAudio,
        position,
        playing,
        queue,
        skip,
        togglePlayback } = useContext(AppContext);

    const duration = audio.duration && Math.round(audio.duration)

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

    const minutesAndSeconds = (position) => ([
        pad(Math.floor(position / 60), 2),
        pad(position % 60, 2)
    ]);

    const elapsed = minutesAndSeconds(position);
    const remaining = minutesAndSeconds(duration - position);

    return <View style={[{ padding: 8, display: 'flex', flexDirection: 'column' }, style]}>
        <View style={{flex: 3}}>
            <Text numberOfLines={3} style={[styles.name, {flex: 1, alignSelf: 'flex-start'}]}>{audio.title}</Text>

            <Picker
                style={{ position: 'absolute', top: 8, right: 8, zIndex: 1, width: 40, height: 40 }}
                selectedValue={audio}
                onValueChange={(itemValue, itemIndex) =>
                    setAudio(itemValue)
                }>
                {queue && queue.map((audio, key) => {
                    return <Picker.Item key={key} label={audio.title} value={audio} />
                })}
            </Picker>

            <Image
                style={{
                    flex: 2,
                    width: '100%',
                    marginVertical: 8,
                    borderWidth: 3,
                    borderColor: COLORS.PRIMARY,
                    backgroundColor: audio.image ? null : COLORS.SECONDARY
                }}
                source={{ uri: audio.image ?? 'https://www.muutoslehti.fi/wp-content/uploads/powerpress/muutos_podcast_logo.jpg' }}
            />
        </View>
        <View style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingVertical: 30 }}>
            <View style={[styles.buttonGroup, {flex: 2}]}>
                <Button icon style={styles.audioButton} onPress={() => skip('backward')}>
                    <Icon name='play-back-sharp' />
                </Button>
                {playing === true ?
                    <Button icon style={styles.audioButton} onPress={() => togglePlayback(false)}>
                        <Icon name='pause-sharp' />
                    </Button> :
                    <Button icon style={styles.audioButton} onPress={() => togglePlayback(true)}>
                        <Icon name='play-sharp' />
                    </Button>
                }

                <Button icon style={styles.audioButton} onPress={() => skip('forward')}>
                    <Icon name='play-forward-sharp' />
                </Button>

            </View>

            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <Text style={styles.numbers}>{elapsed[0] + ":" + Math.floor(elapsed[1])}</Text>
                <Text style={styles.numbers}>{floor10(duration / 60, -1)}min</Text>
            </View>
            <ProgressBar duration={duration} position={position} style={{ alignSelf: 'center' }} />
        </View>
    </View>
};

const styles = StyleSheet.create({
    name: {
        fontSize: 26,
        alignSelf: 'center',
        marginBottom: 8,
        marginEnd: 16
    },
    numbers: {
        fontSize: 18,
        marginHorizontal: 8
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 16,
    },
    audioButton: {
        borderColor: '#d4fafc',
        backgroundColor: '#006064',
        width: 70,
        height: 70,
        margin: 8,
        borderRadius: 70,
        justifyContent: 'center',
        elevation: 10
    }
})

export default AudioControls