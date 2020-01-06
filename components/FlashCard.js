import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  Animated, 
  View, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import colors from '../constants/colors';
import flashCardSpecs from '../constants/flashCardSpecs';
import addWordModalSpecs from '../constants/addWordModalSpecs';

import DefinitionView from '../components/DefinitionView';

const FlashCard = props => {
  const [currentOpacity, setCurrentOpacity] = useState(new Animated.Value(0));
  const [flipped, setFliped] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const deleteWord = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();

      if(allKeys.length > 1) {
        await AsyncStorage.removeItem(props.word);

        next();
      } else {
        alert('Cannot delete last word');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const flipCard = () => {
    setFliped(true);

    Animated.timing(
      currentOpacity,
      {
        toValue: 1,
        duration: flashCardSpecs.flipDuration,
      }
    ).start();
  };

  const next = () => {
    setFliped(false);

    Animated.timing(
      currentOpacity,
      {
        toValue: 0,
        duration: 0,
      }
    ).start();

    props.nextWord();
  };

  return (
    <View style={styles.card}>
      <View style={styles.wordTextContainer}>
        <Text style={styles.wordText}>{props.word}</Text>
      </View>
      <TouchableWithoutFeedback onPress={flipCard} disabled={flipped || disabled}>
        <View style={styles.definitionContainer}>
          <DefinitionView 
            word={props.word} 
            opacity={currentOpacity} 
            disableFlashCard={() => setDisabled(true)}
            enableFlashCard={() => setDisabled(false)}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={deleteWord}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={next}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  definitionContainer: {
    margin: 20,
    flex: 1, 
    alignSelf: 'stretch',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primaryAccent,
    backgroundColor: colors.secondaryBackground,
  },
  card: {
    flex: 1,
    alignItems: 'center',
  },
  wordText: {
    color: 'white',
    fontSize: 34,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryAccent
  }, 
  wordTextContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  buttonContainer: {
    flexDirection: 'row'
  },
  deleteButton: {
    marginLeft: 20,
    marginRight: 10,
    marginBottom: 20,
    flex: 1,
    height: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nextButton: {
    marginRight: 20,
    marginLeft: 10,
    marginBottom: 20,
    flex: 1,
    height: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primaryAccent,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  }
});

export default FlashCard;
