import React from 'react';
import { Text, View, Button, } from 'native-base';
import styles from '../styles/styles';

const CustomButton = (props) => {
    return (
        <View style={styles.container}>
            <Button block onPress={() => props.playAudio('customButton')} style={{ margin: 8 }}>
                <Text>playaudio</Text>
            </Button>
        </View>
    );
}

export default CustomButton
