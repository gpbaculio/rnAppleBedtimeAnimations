import React from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import Svg, {Defs, Mask, Path} from 'react-native-svg';
export const cartesian2Canvas = (v: Vector, center: Vector) => {
  'worklet';
  return {
    x: v.x + center.x,
    y: -1 * v.y + center.y,
  };
};

export interface PolarPoint {
  theta: number;
  radius: number;
}
export const polar2Cartesian = (p: PolarPoint) => {
  'worklet';
  return {
    x: p.radius * Math.cos(p.theta),
    y: p.radius * Math.sin(p.theta),
  };
};

export const polar2Canvas = (p: PolarPoint, center: Vector) => {
  'worklet';
  return cartesian2Canvas(polar2Cartesian(p), center);
};
import {SIZE, STROKE, R, PI, CENTER, arc, absoluteDuration} from './Constants';
import Cursor from './Cursor';
import Gesture from './Gesture';
import Quadrant from './components/Quadrant';
import {Vector} from './CursorOverlay';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CircularProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
}

const CircularSlider = ({start, end}: CircularProps) => {
  const startPos = useDerivedValue(() =>
    polar2Canvas({theta: start.value, radius: R}, CENTER),
  );
  const endPos = useDerivedValue(() =>
    polar2Canvas({theta: end.value, radius: R}, CENTER),
  );
  const animatedProps = useAnimatedProps(() => {
    const p1 = startPos.value;
    const p2 = endPos.value;
    const duration = absoluteDuration(start.value, end.value);
    return {
      d: `M ${p1.x} ${p1.y} ${arc(p2.x, p2.y, duration > PI)}`,
    };
  });
  return (
    <View>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <Mask id="mask">
            <AnimatedPath
              stroke="#FD9F07"
              strokeWidth={STROKE}
              animatedProps={animatedProps}
            />
          </Mask>
        </Defs>
        <Quadrant />
        <Cursor pos={startPos} />
        <Cursor pos={endPos} />
      </Svg>
      <Gesture start={start} end={end} startPos={startPos} endPos={endPos} />
    </View>
  );
};

export default CircularSlider;
