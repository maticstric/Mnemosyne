import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView,
  TextInput, 
  Modal, 
  Text, 
  TouchableOpacity, 
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import colors from '../constants/colors';
import addWordModalSpecs from '../constants/addWordModalSpecs';

import DefinitionView from '../components/DefinitionView';

const AddWordModal = props => {
  const [currentWord, setCurrentWord] = useState('');

  // For hiding the buttons once the keyboard goes up
  const [buttonHeight, setButtonHeight] = useState(addWordModalSpecs.buttonHeight);
  const [addText, setAddText] = useState(addWordModalSpecs.addText);
  const [cancelText, setCancelText] = useState(addWordModalSpecs.cancelText);
  const [addButtonDisabled, setAddButtonDisabled] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide,
    );

    return function cleanup() {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  });

  const disableAdd = () => {
    setAddButtonDisabled(true);
  };
  
  const enableAdd = () => {
    setAddButtonDisabled(false);
  };

  const keyboardDidShow = () => {
    setButtonHeight(0);
    setAddText('');
    setCancelText('');
  };

  const keyboardDidHide = () => {
    setButtonHeight(addWordModalSpecs.buttonHeight);
    setAddText(addWordModalSpecs.addText);
    setCancelText(addWordModalSpecs.cancelText);
  };

  const hideModal = () => {
    props.dropModal();
    setCurrentWord('');
  };

  const addWordToStorage = async (word) => {
    try {
      await AsyncStorage.setItem(currentWord, 'true');
      hideModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.wordContainer}>
          <TextInput 
            style={styles.wordText} 
            autoCapitalize="none" 
            returnKeyLabel="search"
            onSubmitEditing={e => {
              setCurrentWord(e.nativeEvent.text);
            }} />
        </View>
        <View style={styles.definitionContainer}>
          <DefinitionView word={currentWord} disableAdd={disableAdd} enableAdd={enableAdd} />
        </View>
        <View style={{...styles.buttonContainer, ...{height: buttonHeight}}} behavior="padding">
          <TouchableOpacity style={styles.cancelButton} onPress={hideModal}>
            <Text style={styles.buttonText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addWordToStorage} disabled={addButtonDisabled}>
            <Text style={styles.buttonText}>{addText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: addWordModalSpecs.modalPadding,
    backgroundColor: colors.primaryBackground
  },
  wordContainer: {
    height: addWordModalSpecs.wordContainerHeight,
    paddingLeft: addWordModalSpecs.padding,
    paddingRight: addWordModalSpecs.padding,
    borderRadius: addWordModalSpecs.borderRadius,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    marginBottom: addWordModalSpecs.margin
  },
  wordText: {
    color: 'white',
    fontSize: addWordModalSpecs.wordFontSize,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryAccent
  },
  definitionContainer: {
    flex: 1, 
    borderRadius: addWordModalSpecs.borderRadius,
    backgroundColor: colors.secondaryBackground,
    marginBottom: addWordModalSpecs.margin
  },
  buttonContainer: {
    flexDirection: 'row'
  }, 
  addButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: addWordModalSpecs.margin/2,
    borderRadius: addWordModalSpecs.borderRadius,
    backgroundColor: colors.secondaryBackground
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: addWordModalSpecs.margin/2,
    borderRadius: addWordModalSpecs.borderRadius,
    backgroundColor: colors.secondaryBackground
  },
  buttonText: {
    fontSize: addWordModalSpecs.buttonFontSize,
    color: 'white'
  }
});

export default AddWordModal;
