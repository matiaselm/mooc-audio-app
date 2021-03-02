import React from 'react';
import AppLoading from 'expo-app-loading';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './components/CustomButton';
import { StatusBar } from 'expo-status-bar';


/* TODO:
 - How to get soundCloud audio playing to work
 - Basic controls for soundCloud audio
 - Voice recognition API for React/JavaScript
 - Sound input to text
*/

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    // A basic example function that is passed to customButton and called from there via callback 
    const playAudio = (button) => {
      console.log('Button ' + button + ' pressed');      
    }

    return (
      <Container>
        <Header>
          <Body>
            <Left />
            <Title>Home</Title>
            <Right />
          </Body>
        </Header>
        <Content>
          <CustomButton playAudio={playAudio}/>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Page1</Text>
            </Button>
          </FooterTab>
          <FooterTab>
            <Button full>
              <Text>Page2</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}
