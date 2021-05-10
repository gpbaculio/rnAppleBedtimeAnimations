import React from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  Value,
} from 'react-native-reanimated';

import {CENTER, containedInSquare, normalize, STROKE} from './Constants';
import CursorOverlay, {Vector} from './CursorOverlay';

export const cartesian2Polar = (v: Vector) => {
  'worklet';
  return {
    theta: Math.atan2(v.y, v.x),
    radius: Math.sqrt(v.x ** 2 + v.y ** 2),
  };
};
export const canvas2Cartesian = (v: Vector, center: Vector) => {
  'worklet';
  return {
    x: v.x - center.x,
    y: -1 * (v.y - center.y),
  };
};

export const canvas2Polar = (v: Vector, center: Vector) => {
  'worklet';
  return cartesian2Polar(canvas2Cartesian(v, center));
};

enum Region {
  START,
  END,
  MAIN,
}

interface GestureProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
  startPos: Animated.SharedValue<Vector>;
  endPos: Animated.SharedValue<Vector>;
}

const Gesture = ({start, end, startPos, endPos}: GestureProps) => {
  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {offset: number; region: Region}
  >({
    onStart: ({x, y}, ctx) => {
      if (containedInSquare({x, y}, startPos.value, STROKE)) {
        ctx.region = Region.START;
        ctx.offset = start.value;
      } else if (containedInSquare({x, y}, endPos.value, STROKE)) {
        ctx.region = Region.END;
        ctx.offset = end.value;
      } else {
        ctx.region = Region.MAIN;
        const {theta} = canvas2Polar({x, y}, CENTER);
        ctx.offset = theta;
      }
    },
    onActive: ({x, y}, ctx) => {
      const {theta} = canvas2Polar({x, y}, CENTER);
      const delta = theta - ctx.offset;
      if (ctx.region === Region.START || ctx.region === Region.MAIN) {
        start.value = normalize(start.value + delta);
      }
      if (ctx.region === Region.END || ctx.region === Region.MAIN) {
        end.value = normalize(end.value + delta);
      }
      ctx.offset = theta;
    },
  });
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        <CursorOverlay position={startPos} icon="bed" />
        <CursorOverlay position={endPos} icon="bell" />
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Gesture;
