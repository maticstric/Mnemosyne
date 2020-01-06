import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Animated, View, TouchableWithoutFeedback } from 'react-native';

const FlipCard = props => {
  const [frontAlpha] = useState(new Animated.Value(1));
  const [backAlpha] = useState(new Animated.Value(0));

  const [isFront, setIsFront] = useState(true);

  const flipCard = () => {
    if(isFront) {
      setIsFront(false);
      fadeOutThenIn(frontAlpha, backAlpha);
    } else {
      setIsFront(true);
      fadeOutThenIn(backAlpha, frontAlpha);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View>
        <Animated.View visible={frontVisible} style={{backgroundColor: 'green', opacity: frontAlpha}}>
          <Text style={{color: 'white'}}>front</Text>
        </Animated.View>
        <Animated.View visible={backVisible} style={{backgroundColor: 'red', opacity: backAlpha}}>
          <Text style={{color: 'white'}}>back</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

});

export default FlipCard;
