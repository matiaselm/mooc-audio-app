import React from 'react';
import { Text, View, Button, } from 'native-base';
import styles from '../styles/styles';

const CustomButton = (props) => {
    const playAudio = () => {
        console.log('playAudio')
    }

    return (
        <View style={styles.container}>
            <Button block onPress={playAudio} style={{ margin: 8 }}>
                <Text>playaudio</Text>
            </Button>
        </View>
    );
}

export default CustomButton
