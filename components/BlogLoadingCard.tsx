import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BlogLoadingCard = () => {
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
      <View style={styles.blogContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.titleSkeleton} />
        </View>
        <View style={styles.imageSkeleton} />
        
        {/* Two shimmer stripes, well spaced */}
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
  blogContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 16,
    paddingVertical: 20,
    overflow: 'hidden',
    height: 135,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#E0E0E0', // Same light gray as LargeLoadingCard
  },
  contentContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titleSkeleton: {
    height: 24,
    width: '80%',
    backgroundColor: '#D0D0D0',
    borderRadius: 4,
    alignSelf: 'center',
  },
  imageSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#D0D0D0',
    marginLeft: 10,
  },
  shimmer: {
    width: 25, // Same width as LargeLoadingCard
    height: 500,
    backgroundColor: 'rgba(255, 255, 255, 1)', // Solid white for maximum contrast
    position: 'absolute',
    top: -200,
  },
});

export default BlogLoadingCard;