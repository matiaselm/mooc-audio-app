import React from 'react';
import { Text, View, Button, } from 'native-base';
import styles from '../styles/styles';

const CustomButton = (props) => {
    return (
        <View style={styles.container}>
            <Button block onPress={props.onPress} style={{ margin: 8 }}>
                <Text>{props.text}</Text>
            </Button>
        </View>
    );
}

export{ CustomButton };