import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Animated, 
  TouchableWithoutFeedback 
} from 'react-native';

//import { Audio } from 'expo-av';
import SoundPlayer from 'react-native-sound-player'

import Icon from 'react-native-vector-icons/MaterialIcons';

import definitionViewSpecs from '../constants/definitionViewSpecs';
import colors from '../constants/colors';

// Array of all the text we'll need to display in the definition
const getDefinitionArray = (json) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  if(json.length === 0) {
    return null;
  }

  const definitionArray = [];

  for(let i = 0; i < json.length; i++) {
    const shortdef = json[i].shortdef;

    if(shortdef) { // If one exists
      const label = (i + 1) + '';

      for(let j = 0; j < shortdef.length; j++) {
        let labelViewStyle;
        let defViewStyle;

        // If first
        if(i === 0 && j === 0) { 
          labelViewStyle = styles.firstLabelView;
        } else {
          labelViewStyle = styles.normalLabelView;
        }
        
        // If last
        if(i === json.length - 1 && j === shortdef.length - 1) {
          defViewStyle = styles.lastDefView;
        } else {
          defViewStyle = styles.normalDefView;
        }

        // Label
        definitionArray.push({
          text: label + alphabet[j] + ':',
          viewStyle: labelViewStyle,
          textStyle: styles.labelText
        });

        // Definition
        definitionArray.push({
          text: shortdef[j] + '',
          viewStyle: defViewStyle,
          textStyle: styles.defText
        });
      }
    } else {
      return null;
    }
  }
  
  return definitionArray;
};

const jsonToDefinition = (props, json) => {
  const definitionArray = getDefinitionArray(json);

  if(definitionArray) {
    if(props.enableAdd) {
      props.enableAdd();
    }

    return (
      definitionArray.map((defPart, key) => (
        <View key={key} style={defPart.viewStyle}>
          <Text style={defPart.textStyle}>{defPart.text}</Text> 
        </View>
      ))
    );
  } else { // If not defintion was found, we get suggestions for misspellings
    if(props.disableAdd) {
      props.disableAdd();
    }

    const suggestions =
      json.map((suggestion, key) => (
        <View key={key} style={styles.suggestionView}>
          <Text style={styles.suggestionText}>{suggestion}</Text> 
        </View>
      ));
    return (
      <View key={Math.random()}>
        <View style={styles.titleSuggestionView}>
          <Text style={styles.titleSuggestionText}>No defintion was found. Other suggestions:</Text>
        </View>
        {suggestions}
      </View>
    );
  }
};

const getAudioFile = (json) => {
  if(json.length === 0) {
    return null;
  }

  if(json[0].hwi) {
    const hwi = json[0].hwi;

    if(hwi.prs[0]) {
      const prs = hwi.prs[0];

      if(prs.sound) {
        const sound = prs.sound;

        if(sound.audio) {
          return sound.audio;
        }
      } 
    }
  }

  return null;
};

const getPath = (word, audioFile) => {
  if(audioFile) {
    const baseUrl = 'https://media.merriam-webster.com/soundc11/';
    let subDir = '';

    // Rules accoring to 'https://dictionaryapi.com/info/faq-audio-image#collegiate'
    if(word.substring(0, 3) === 'bix') {
      subDir = 'bix/';
    } else if(word.substring(0, 2) == 'gg') {
      subDir = 'gg/';
    } else if(word[0] >= '0' && word[0] <= '9') {
      subDir = 'number/'
    } else {
      subDir = word[0] + '/';
    }
   
    return baseUrl + subDir + audioFile + '.wav';
  } else {
    return null;
  }
};

const DefinitionView = props => {
  const [definition, setDefinition] = useState();
  const [wordAudio, setWordAudio] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const apiUrl = 'https://dictionaryapi.com/api/v3/references/collegiate/json/'
  const apiKey = '13007426-6dc4-4d14-82f9-8f67bcf06f57';

  useEffect(() => {
    async function fetchData() {
      try {
        if(props.disableFlashCard) {
          props.disableFlashCard();
        }

        setLoaded(false);
        // Definition
        let response = await fetch(apiUrl + props.word + '?key=' + apiKey);
        let responseJson = await response.json();

        const definition = jsonToDefinition(props, responseJson);
        setDefinition(definition); 

        // Audio
        const audioFile = getAudioFile(responseJson);
        const path = getPath(props.word, audioFile);

        if(path) {
          setWordAudio(path);
        }

        if(props.enableFlashCard) {
          props.enableFlashCard();
        }

        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    }

    if(props.word) { 
      fetchData();
    } else {
      if(props.disableAdd) {
        props.disableAdd();
      }
    }
  }, [props.word]);

  const playWordAudio = async () => {
    try {
      if(wordAudio) {
        SoundPlayer.playUrl(wordAudio);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView style={{opacity: props.opacity}}>
        {definition}
      </Animated.ScrollView>
      <Animated.View style={{...styles.audioContainer, ...{opacity: props.opacity}}}>
        <TouchableWithoutFeedback onPress={playWordAudio} disabled={!loaded}>
          <View style={styles.audioButton}>
            <Icon name="volume-up" size={definitionViewSpecs.audioIconSize} color="black" />
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  firstLabelView: {
    marginTop: definitionViewSpecs.scrollViewMargin,
    marginRight: definitionViewSpecs.scrollViewMargin,
    marginLeft: definitionViewSpecs.scrollViewMargin
  },
  normalLabelView: {
    marginRight: definitionViewSpecs.scrollViewMargin,
    marginLeft: definitionViewSpecs.scrollViewMargin
  },
  normalDefView: {
    marginRight: definitionViewSpecs.scrollViewMargin,
    marginLeft: 2*definitionViewSpecs.scrollViewMargin,
    marginBottom: definitionViewSpecs.scrollViewMargin/2
  }, 
  lastDefView: {
    marginRight: definitionViewSpecs.scrollViewMargin,
    marginLeft: 2*definitionViewSpecs.scrollViewMargin,
    marginBottom: definitionViewSpecs.scrollViewMargin
  },
  labelText: {
    fontSize: definitionViewSpecs.labelFontSize,
    fontWeight: 'bold',
    color: 'white'
  },
  defText: {
    fontSize: definitionViewSpecs.defFontSize,
    color: 'white'
  },
  titleSuggestionView: {
    marginTop: definitionViewSpecs.scrollViewMargin,
    marginLeft: definitionViewSpecs.scrollViewMargin,
    marginBottom: definitionViewSpecs.scrollViewMargin/2
  },
  titleSuggestionText: {
    fontSize: definitionViewSpecs.labelFontSize,
    color: 'white'
  },
  suggestionView: {
    marginLeft: 2*definitionViewSpecs.scrollViewMargin,
    marginBottom: definitionViewSpecs.scrollViewMargin/2,
  }, 
  suggestionText: {
    fontSize: definitionViewSpecs.defFontSize,
    color: 'white'
  }, 
  audioButton: {
    width: definitionViewSpecs.audioButtonSize,
    height: definitionViewSpecs.audioButtonSize,
    borderRadius: definitionViewSpecs.audioButtonSize/2,
    backgroundColor: colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  audioContainer: {
    margin: definitionViewSpecs.scrollViewMargin,
    position: 'absolute',
    bottom: 0,
    right: 0
  }
});

export default DefinitionView;
