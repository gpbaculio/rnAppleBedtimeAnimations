import React from 'react';
import Animated, {useAnimatedProps} from 'react-native-reanimated';

import {Circle} from 'react-native-svg';

import {STROKE, R, CENTER} from './Constants';
import {Vector} from './CursorOverlay';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CursorProps {
  pos: Animated.SharedValue<Vector>;
}

const Cursor = ({pos}: CursorProps) => {
  const animatedProps = useAnimatedProps(() => ({
    cx: pos.value.x,
    cy: pos.value.y,
  }));
  return (
    <AnimatedCircle animatedProps={animatedProps} r={STROKE / 2} fill="green" />
  );
};

export default Cursor;
