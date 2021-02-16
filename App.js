import { StatusBar } from 'expo-status-bar';
import React from 'react';
import CustomButton from './components/CustomButton';

/* TODO:
 - How to get soundCloud audio playing to work
 - Basic controls for soundCloud audio
 - Voice recognition API for React/JavaScript
 - Sound input to text
*/

export default function App() {
  return (<>
    <StatusBar style="auto" />
    <CustomButton />
  </>
  );
}
