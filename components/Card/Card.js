import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ title, children, onPress, style, elevation = 1 }) => {
  const { paperTheme } = useTheme();
  
  return (
    <PaperCard 
      style={[styles.card, style]}
      mode="elevated"
      elevation={elevation}
      onPress={onPress}
    >
      {title && (
        <PaperCard.Title 
          title={title}
          titleStyle={styles.cardTitle}
        />
      )}
      <PaperCard.Content>
        {children}
      </PaperCard.Content>
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Card;
