import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from '../constants/colors';
import fabSpecs from '../constants/fabSpecs';

const FloatingActionButton = props => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={styles.button}>
          <Icon name="add" size={fabSpecs.iconSize} color="black" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: fabSpecs.padding,
  },
  button: {
    width: fabSpecs.buttonSize,
    height: fabSpecs.buttonSize,
    borderRadius: fabSpecs.buttonSize/2,
    backgroundColor: colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default FloatingActionButton;
