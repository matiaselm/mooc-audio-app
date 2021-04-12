import React from 'react';
import { RecyclerViewBackedScrollView, StyleSheet, Image } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';
import { skip } from 'react-native-track-player';

const AudioControls = ({ style, duration, position, handlePress, title, togglePlayback, image, progress, status, skip }) => {

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

    const ProgressBar = ({ duration, position, style }) => {
        if (position === NaN) {
            position = 0
        }
        const progress = (_duration, _position) => {
            if (!isNaN(_duration - _position)) {
                return _duration - _position
            } else {
                return 0
            }
        }

        return <View style={[{ display: 'flex', flexDirection: 'row-reverse', width: '100%', height: 6 }, style]}>
            <View style={{ flex: progress(duration, position), alignSelf: 'flex-start', height: 6, backgroundColor: '#dadada' }} />
            <View style={{ flex: position, height: 6, backgroundColor: '#39FF' }} />
        </View>
    }

    return <View style={[{ padding: 16 }, style]}>
        <Text style={styles.name}>{title}</Text>

        <Image
            style={{
                height: 250,
                width: '100%',
                marginVertical: 8,
                backgroundColor: image ? null : 'rgba(24,244,24, 0.4)'
            }}
            source={{ uri: image ?? 'https://www.muutoslehti.fi/wp-content/uploads/powerpress/muutos_podcast_logo.jpg' }}
        />
        <View style={styles.buttonGroup}>
            <Button icon style={styles.audioButton} onPress={() => skip('backward')}>
                <Icon name='play-back-sharp' />
            </Button>
            {status == true &&
                <Button icon style={styles.audioButton} onPress={togglePlayback}>
                    <Icon name='pause-sharp' />
                </Button>
            }
            {status == false &&
                <Button icon style={styles.audioButton} onPress={togglePlayback}>
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
        <ProgressBar duration={duration} position={position} style={{ alignSelf: 'center', margin: 10 }}></ProgressBar>
    </View>
};

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        alignSelf: 'center',
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
        width: 70,
        height: 70,
        margin: 8,
        borderRadius: 70,
        justifyContent: 'center'
    }
})

export default AudioControls