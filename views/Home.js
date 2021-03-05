import React from 'react';
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { StatusBar } from 'expo-status-bar';

const Home = (props) => {
    
    
      // A basic example function that is passed to customButton and called from there via callback 
  const playAudio = (button) => {
    console.log('Button ' + button + ' pressed');      
  }

return <>
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
          <Text>Home</Text>
        </Button>
      </FooterTab>
      <FooterTab>
        <Button full>
          <Text>Audio</Text>
        </Button>
      </FooterTab>
    </Footer>
  </>
}

export default Home;