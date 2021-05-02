import axios from 'axios';
import { API_URL } from '@env';

export default () => {
    const postUser = async () => {
        console.log('POST USER')
        try {
            const query = {
                query: `mutation{
                    AddUser{
                        id
                        name
                        language
                        audio{
                            id
                        }
                        notes{
                            id
                        }
                    }
                }`
            }
            const response = await axios.post(`${API_URL}/graphql`, query)
            console.log('Post user response', JSON.stringify(response.data.data.AddUser,'','\t'))
            return response.data.data.AddUser
        } catch (e) {
            console.error('post user error', e.message)
            return null
        }
    }

    const modifyUser = async (user) => {
        // axios method to modify user
    }

    const getUser = async () => {
        // axios method to get user with id from server
    };

    const postNote = async (position, note, audioID, userID) => {
        console.log('POST NOTE', `${API_URL}/graphql`)

        const query = {
            query: `mutation AddNote( $userID: String!, $audioID: String!, $data: String!, $timestamp: Float!){
                AddNote(userID: $userID, audioID: $audioID, data: $data, timestamp: $timestamp)
            }`,
            variables: {
                timestamp: position,
                data: note,
                audioID: audioID,
                userID: userID
            }
        }

        try {
            const response = await axios.post(`${API_URL}/graphql`, query)
            console.log('POST NOTE', JSON.stringify(response.data, '', '\t'))
            return response.data
        } catch (e) {
            console.log(e.message)
            return null
        }
    };

    const getNotes = async (userID) => {
        if (userID !== null) {
            console.log('Getting notes for user: ', userID);
            try {
                console.log('Getting notes for user: ', userID);
                await axios.post(`${API_URL}/graphql`, {
                    query: `Notes($userID: String!){
                            id
                            data
                            timestamp
                            audioID
                            userID
                        }`,
                    variables: {
                        userID: userID
                    }
                }).then((response, err) => {
                    if (err) {
                        console.error(err)
                        return null
                    } else {
                        return response.data
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
    };

    const getAudio = async () => {
        try{
            const url = `${API_URL}/graphql`;
            const query = {
                query: `{
                    Audios{
                        id
                        url
                        title
                        artist
                        album
                        genre
                        date
                        artwork
                        duration
                    }
                }`
            }
            const response = await axios.post(url, query)
            console.log('AUDIOS', JSON.stringify(response.data,'','\t'))

            return response.data
        }catch(e){
            console.error('getAudio error', e.message)
        }
    };

    return {
        postUser,
        getUser,
        getNotes,
        getAudio,
        postNote,
        modifyUser
    }
}