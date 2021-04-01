import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';

const AudioControls = ({ style, duration, position, handlePress, title, togglePlayback, progress, status }) => {

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

    return <View style={style}>
        <Text style={styles.name}>{title}</Text>
        <Text style={styles.progress}>{elapsed[0] + ":" + Math.floor(elapsed[1])} / {floor10(duration / 60, -1)}min</Text>
        <View style={styles.buttonGroup}>
            <Button icon style={styles.audioButton}>
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

            <Button icon style={styles.audioButton}>
                <Icon name='play-forward-sharp' />
            </Button>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', width: '100%', height: 6, backgroundColor: '#dadada' }}>
            <View style={{ width: position, alignSelf: 'flex-start', height: 6, backgroundColor: '#39FF' }}></View>
        </View>
    </View>
};

const styles = StyleSheet.create({
    name: {
        fontSize: 28,
        alignSelf: 'center',
    },
    progress: {
        color: 'black',
        alignSelf: 'center'
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 100,
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