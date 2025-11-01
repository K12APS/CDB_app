import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const LargeLoadingCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000, // Slightly slower animation
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
    return () => {
      animatedValue.stopAnimation();
    };
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 2, width * 2],
  });

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.headerSkeleton} />
        <View style={styles.contentContainer}>
          <View style={styles.dateSkeleton} />
          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionSkeleton} />
            <View style={styles.descriptionSkeleton2} />
            <View style={styles.descriptionSkeleton3} />
          </View>
        </View>
        
        {/* Just two shimmer stripes, well spaced */}
        {[...Array(2)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.shimmer,
              {
                left: -width + (index * width), // Much wider spacing between stripes
                opacity: 0.6, // More visible
                transform: [{ translateX }, { rotate: '65deg' }],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    padding: 16,
    paddingTop: 10,
    marginBottom: 0,
    height: 200, // Match ScratchEventCard height
    overflow: 'hidden',
    position: 'relative',
  },
  headerSkeleton: {
    height: 32,
    width: '80%',
    backgroundColor: '#D0D0D0',
    borderRadius: 6,
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    height: 108,
  },
  dateSkeleton: {
    height: 108, // Match the DateCard height from ScratchEventCard
    width: 92,   // Match the DateCard width from ScratchEventCard
    backgroundColor: '#D0D0D0',
    borderRadius: 30,
  },
  descriptionContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  descriptionSkeleton: {
    height: 15,
    width: '90%',
    backgroundColor: '#D0D0D0',
    borderRadius: 3,
    marginBottom: 10,
  },
  descriptionSkeleton2: {
    height: 15,
    width: '80%',
    backgroundColor: '#D0D0D0',
    borderRadius: 3,
    marginBottom: 10,
  },
  descriptionSkeleton3: {
    height: 15,
    width: '60%',
    backgroundColor: '#D0D0D0',
    borderRadius: 3,
  },
  shimmer: {
    width: 25, // Slightly wider stripes
    height: 500,
    backgroundColor: 'rgba(255, 255, 255, 1)', // Solid white for maximum contrast
    position: 'absolute',
    top: -200,
  },
});

export default LargeLoadingCard;