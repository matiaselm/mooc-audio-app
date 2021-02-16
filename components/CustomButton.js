import React from 'react';
import { Text, View, Button } from 'react-native';
import styles from '../styles/styles';

const CustomButton = (props) => {
    const playAudio = () => {
        console.log('playAudio')
    }

    return (
        <View style={styles.container}>
            <Button onPress={playAudio} title='play'></Button>
        </View>
    );
}

export default CustomButton
