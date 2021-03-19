import React, { useEffect, useState } from 'react'
import { Text, Footer, FooterTab, Button} from 'native-base';

const CustomFooter = ({changeTab, view}) => {
    return <Footer>
                <FooterTab>
                    <Button full onPress={() => changeTab('main')}>
                       <Text style={{color: view == 'main' ? '#FFF':'#000'}}>Main</Text>
                    </Button>
                </FooterTab>
                <FooterTab>
                    <Button full onPress={() => changeTab('audio')}>
                       <Text style={{color: view == 'audio' ? '#FFF':'#000'}}>Audio</Text>
                    </Button>
                </FooterTab>
            </Footer>
}

export default CustomFooter;