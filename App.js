import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import FloatingActionButton from './components/FloatingActionButton';
import AddWordModal from './components/AddWordModal';
import DefinitionView from './components/DefinitionView';
import FlashCard from './components/FlashCard';

import colors from './constants/colors';

export default function App() {
  const [isAddMode, setIsAddMode] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  const addWordShow = () => {
    setIsAddMode(true);
  };

  const addWordHide = () => {
    setIsAddMode(false);
  };

  useEffect(() => {
      AsyncStorage.getAllKeys().then((allKeys) => {
        // If no words
        if(allKeys.length === 0) {
          AsyncStorage.setItem('mnemosyne', 'true');
          setCurrentWord('mnemosyne');
        } else {
          // Just used to start with a random word when you first go into app
          setCurrentWord(allKeys[Math.floor(Math.random() * allKeys.length)]);
        }
      });
  }, []);

  const nextWord = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      let randomKey = currentWord;
      const maxLoops = 20;
      let loops = 0;

      while(randomKey === currentWord && loops < maxLoops) {  // So that you don't get duplicates
        randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
        loops++;
      }

      setCurrentWord(randomKey);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar hidden={true} />
      <View style={styles.fabContainer}>
        <FloatingActionButton onPress={addWordShow}/>
      </View>
      <View style={styles.flashCardContainer}>
        <FlashCard word={currentWord} nextWord={nextWord} />
      </View>
      <AddWordModal visible={isAddMode} dropModal={addWordHide}/>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column-reverse',
    backgroundColor: colors.primaryBackground
  },
  fabContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  flashCardContainer: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    backgroundColor: colors.secondaryBackground
  }
});
