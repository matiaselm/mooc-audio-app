import React, { useState, useEffect } from 'react';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input } from 'native-base';
import axios from 'axios';
import { WIT_BEARER } from "@env";
import CustomHeader from '../components/CustomHeader';
import SpeechToText from 'react-native-google-speech-to-text';

const Wit = ({ navigation, userName }) => {
    const [intent, setIntent] = useState(null);
    const [input, setInput] = useState(null);

    const instance = axios.create({
        baseURL: 'https://api.wit.ai',
        timeout: 1000,
        headers: { 'Authorization': `Bearer ${WIT_BEARER}` }
    });

    const getWit = async (query) => {
        instance.get('/message', {
            params: {
                q: query
            }
        }).then((response) => {
            if (response.data.intents) {
                setIntent(response.data.intents[0])
            }
        })
    }

    const formatResponse = (response) => {
        switch (response) {
            case 'listening': {
                return 'What would you want to listen to?'
            }
            case 'next': {
                return "I'll skip that for you"

            }
            case 'pause': {
                return "I'll pause that for you"
            }
            case 'backward': {
                return "I'll skip backwards"
            }
            case 'resume': {
                return "Okay let's resume"
            }
            default: {
                return "I didn't quite catch that"
            }
        }
    }

    return <>
        <Container>
            <View style={{ height: '100%', padding: 8, backgroundColor: '#fafafa'}}>
                {intent && <Text style={{ alignSelf: 'center', margin: 16, padding: 16, backgroundColor: '#ddd', borderRadius: 16 }}>{intent && formatResponse(intent.name)}</Text>}

                <Form style={{ position: 'absolute', display: 'flex', flexDirection: 'row', margin: 8, bottom: 0 }}>
                    <Item style={{ flex: 3, marginRight: 16 }}>
                        <Input
                            placeholder='Message wit'
                            value={input}
                            onChangeText={text => setInput(text)}>
                        </Input>
                    </Item>
                    <Button style={{ flex: 1, borderRadius: 8 }}
                        onPress={() => {
                            getWit(input)
                            setInput('')
                        }}>
                        <Text>Send</Text>
                    </Button>
                </Form>
            </View>
        </Container>
    </>
}

export default Wit;