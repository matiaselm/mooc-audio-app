import React, { useState, useEffect, useContext } from 'react';
import { RecyclerViewBackedScrollView, StyleSheet, Image } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon, Picker } from 'native-base';
import { skip } from 'react-native-track-player';
import ProgressBar from './ProgressBar';
import AppContext from '../AppContext';

const AudioControls = ({ style }) => {
    const {
        audio,
        setAudio,
        position,
        playing,
        queue,
        skip,
        togglePlayback } = useContext(AppContext);

    const duration = audio.duration && Math.round(audio.duration.$numberDecimal)
    
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

    return <View style={[{ padding: 16 }, style]}>
        <Text numberOfLines={3} style={styles.name}>{audio.title}</Text>

        <Picker
            style={{ position: 'absolute', top: 16, right: 8, zIndex: 1, width: 30 }}
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
                height: 250,
                width: '100%',
                marginVertical: 8,
                borderWidth: 3,
                borderColor: '#006064',
                backgroundColor: audio.image ? null : '#d4fafc'
            }}
            source={{ uri: audio.image ?? 'https://www.muutoslehti.fi/wp-content/uploads/powerpress/muutos_podcast_logo.jpg' }}
        />
        <View style={styles.buttonGroup}>

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
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.numbers}>{elapsed[0] + ":" + Math.floor(elapsed[1])}</Text>
            <Text style={styles.numbers}>{floor10(duration / 60, -1)}min</Text>
        </View>
        <ProgressBar duration={duration} position={position} style={{ alignSelf: 'center', margin: 10 }} />
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