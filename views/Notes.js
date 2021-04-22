import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Form, Item, Input, ScrollView, Icon } from 'native-base';
import axios from 'axios';
import { API_URL } from '@env';
import CustomHeader from '../components/CustomHeader';
import AppContext from '../AppContext';

const Notes = ({ navigation, userName }) => {
    const [input, setInput] = useState(null);
    const { user, notes, getNotes, audio, position } = useContext(AppContext);

    const postNote = async (data) => {
        await axios.post(`${API_URL}/user/note`, {
            timestamp: position,
            data: data,
            audioID: audio.id,
            userID: user._id
        }).then((response, err) => {
            if (err) {
                console.error(err)
            } else {
                console.log(JSON.stringify(response.data))
                getNotes();
            }
        })
    }

    const noteItem = ({ item }) => (
        <Text style={{ minHeight: 30 }}>{item.data}</Text>
      );

    return <View>
        <CustomHeader title={'Notes'} onPressNavigation={() => navigation.goBack()} userName={userName} />

        <View style={{height: '100%', padding: 8}}>
            <FlatList
                keyExtractor={item => item._id}  
                data={notes ?? []}
                renderItem={noteItem}
            >
            </FlatList>

            <Form style={{ position: 'absolute', bottom: 140, display: 'flex', flexDirection: 'row' }}>
                <Item style={{ flex: 4 }}>
                    <Input
                        placeholder='Create note'
                        value={input}
                        onChangeText={text => setInput(text)}>
                    </Input>
                </Item>
                <Button icon transparent style={{ flex: 1, borderRadius: 8, maxWidth: 60 }}
                    onPress={() => {
                        postNote(input)
                        setInput('')
                    }}>
                    <Icon name='arrow-forward' />
                </Button>
            </Form>

        </View>
    </View>
}

export default Notes;