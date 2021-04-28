import React, { useEffect, useState } from 'react'
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View, Icon } from 'native-base';

const CustomHeader = ({ title, onPressNavigation, userName }) => {
  return <Header>
    <Left>
      <Button transparent onPress={onPressNavigation}>
        <Icon name={'book'} />
      </Button>
    </Left>
    <Body>
      <Title>{title}</Title>
    </Body>
    <Right>
      <Text>{userName}</Text>
    </Right>
  </Header>
}

export default CustomHeader;