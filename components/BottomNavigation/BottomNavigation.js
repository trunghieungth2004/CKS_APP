import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const getIconAnimation = (iconName) => {
  const animations = {
    'clipboard-list': 'bounce',
    'plus-circle': 'pulse',
    'package-variant': 'shake',
    'alert-circle': 'ring',
    'cog': 'spin',
    'clipboard-check': 'checkBounce',
  };
  return animations[iconName] || 'bounce';
};

const AnimatedIcon = ({ name, size, color, isActive }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const translateXAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isActive) {
      const animationType = getIconAnimation(name);
      
      switch (animationType) {
        case 'bounce':
          Animated.sequence([
            Animated.spring(translateYAnim, {
              toValue: -8,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(translateYAnim, {
              toValue: 0,
              friction: 4,
              tension: 40,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case 'pulse':
          Animated.sequence([
            Animated.spring(scaleAnim, {
              toValue: 1.3,
              friction: 2,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 3,
              tension: 40,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case 'shake':
          Animated.sequence([
            Animated.timing(translateXAnim, {
              toValue: -4,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: 4,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: -4,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: 4,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case 'ring':
          Animated.parallel([
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: -1,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
          break;

        case 'spin':
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start(() => {
            rotateAnim.setValue(0);
          });
          break;

        case 'checkBounce':
          Animated.parallel([
            Animated.sequence([
              Animated.spring(scaleAnim, {
                toValue: 1.25,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
              }),
              Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
              }),
            ]),
            Animated.sequence([
              Animated.timing(rotateAnim, {
                toValue: 0.5,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
          break;

        default:
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            friction: 3,
            useNativeDriver: true,
          }).start(() => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }).start();
          });
      }
    }
  }, [isActive]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const spinRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animationType = getIconAnimation(name);
  const rotateValue = animationType === 'spin' ? spinRotate : rotate;

  return (
    <Animated.View style={{ 
      transform: [
        { scale: scaleAnim },
        { translateX: translateXAnim },
        { translateY: translateYAnim },
        { rotate: rotateValue },
      ] 
    }}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Animated.View>
  );
};

const BottomNavigation = ({ currentTab, onTabChange, tabs }) => {
  const { paperTheme } = useTheme();

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <Surface style={[styles.container, { backgroundColor: paperTheme.colors.surface }]} elevation={3}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              isActive && {
                backgroundColor: paperTheme.colors.secondaryContainer,
                borderRadius: 24,
              }
            ]}>
              <AnimatedIcon
                name={tab.icon}
                size={24}
                color={isActive ? paperTheme.colors.onSecondaryContainer : paperTheme.colors.onSurfaceVariant}
                isActive={isActive}
              />
            </View>
            <Text 
              variant="labelSmall" 
              style={[
                styles.label,
                { color: isActive ? paperTheme.colors.onSurface : paperTheme.colors.onSurfaceVariant }
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: 100,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 4,
    minWidth: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default BottomNavigation;
