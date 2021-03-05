import React, { useEffect, useState } from 'react'
import { Container, Header, Body, Title, Left, Right, Text, Content, Footer, FooterTab, Button, View } from 'native-base';

const CustomHeader = ({title}) => {
return <Header>
            <Body>
              <Left />
                <Title>{title}</Title>
              <Right />
            </Body>
        </Header>
}

export default CustomHeader;