import axios from 'axios';
import { API_URL, TOKEN } from '@env';

export default () => {
    axios.defaults.headers.common = {'Authorization': `bearer ${TOKEN}`}

    const postUser = async () => {
        // console.log('POST USER')
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

            console.log('Post user response', JSON.stringify(response.data.data.AddUser, '', '\t'))
            return response.data.data.AddUser
        } catch (e) {
            console.error('post user error', e.message)
            return null
        }
    }

    const modifyUser = async (user) => {
        // axios method to modify user
        try {
            const query = {
                query: `mutation ModifyUser($id: ID!, $name: String, $language: String){
                    ModifyUser(id: $id, name: $name, language: $language){
                        id
                        name
                        language
                    }
                }`,
                variables: {
                    id: user.id,
                    name: user.name,
                    language: user.language
                } 
            }
            const response = await axios.post(`${API_URL}/graphql`, query)
            console.log('Modify user response', JSON.stringify(response.data, '', '\t'))
            return response.data
        } catch (e) {
            console.error('modify user error', e.message)
            return null
        }

        /**{"id":"608fc01b1c4a393dd886fb12","language":"en_EN","audio":null,"notes":[],"name":"Matias"} */
    }

    const getUser = async (userID) => {
        if (userID !== null) {
            try {
                const query = {
                    query: `{
                    User(id: "${userID}"){
                        id
                        name
                        position
                        language
                        notes{
                            id
                            data
                            audioID{
                                title
                            }
                      }
                    }
                  }`
                }

                // console.log('Getting notes for user: ', userID);
                const response = await axios.post(`${API_URL}/graphql`, query)

                // console.log('Notes response', JSON.stringify(response.data.data.User.notes, '', '\t'))
                return response.data.data.User.notes
            } catch (e) {
                console.error('note fetch error', e.message)
                return null
            }
        }
    };

    const postNote = async (position, note, audioID, userID) => {
        // console.log('POST NOTE', `${API_URL}/graphql`)

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
            return response.data
        } catch (e) {
            console.log(e.message)
            return null
        }
    };

    const modifyNote = async (noteID, data) => {
        const query = {
            query: `mutation{
                ModifyNote(id: "${noteID}", data: "${data}") {
                    id
                    data
                }
            }`
        }

        try {
            console.log('Modifying note', noteID, data, query)
            await axios.post(`${API_URL}/graphql`, query).then((response) => {
                return response.data
            })
        } catch (e) {
            console.log(e.message)
            return null
        }
    }

    const deleteNote = async (noteID, data) => {
        const query = {
            query: `mutation DeleteNote( $noteID: ID!) {
                ModifyNote( noteID: $noteID)
            }`,
            variables: {
                noteID: noteID,
                data: data
            }
        }

        try {
            axios.post(`${API_URL}/graphql`, query).then((response) => {
                return response.data
            })
        } catch (e) {
            console.log(e.message)
            return null
        }
    }

    const getNotes = async (userID) => {
        // console.log('API_URL', API_URL)
        if (userID !== null) {
            // console.log('Getting notes for user: ', userID);
            try {
                const query = {
                    query: `{
                        Notes(userID: "${userID}"){
                            id
                            data
                            timestamp
                            audioID{
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
                        }
                      }`
                }

                // console.log('Getting notes for user: ', userID);
                const response = await axios.post(`${API_URL}/graphql`, query)

                // console.log('Notes response', JSON.stringify(response.data.data.Notes, '', '\t'))
                return response.data.data.Notes
            } catch (e) {
                console.error('note fetch error', e.message)
                return null
            }
        }
    };

    const getAudio = async () => {
        try {
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
            // console.log('AUDIOS', JSON.stringify(response.data.data.Audios, '', '\t'))

            return response.data.data.Audios
        } catch (e) {
            console.error('getAudio error', e.message)
        }
    };

    return {
        postUser,
        getUser,
        getNotes,
        getAudio,
        postNote,
        modifyNote,
        deleteNote,
        modifyUser
    }
}