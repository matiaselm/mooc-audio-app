import React, { useEffect, useState } from 'react'
import { Text, Footer, FooterTab, Button} from 'native-base';

const CustomFooter = ({changeTab}) => {
    return <Footer>
                <FooterTab>
                    <Button full onPress={() => changeTab('home')}>
                       <Text>Home</Text>
                    </Button>
                </FooterTab>
                <FooterTab>
                    <Button full onPress={() => changeTab('audio')}>
                       <Text>Audio</Text>
                    </Button>
                </FooterTab>
            </Footer>
}

export default CustomFooter;