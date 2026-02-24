import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Card.styles';

const Card = ({ title, children, onPress, style }) => {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {children}
    </Container>
  );
};

export default Card;
