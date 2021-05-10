import React, {ReactNode} from 'react';
import {
  TextProps as RNTextProps,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({text: true});

interface TextProps {
  text: Animated.SharedValue<string>;
  style?: Animated.AnimateProps<RNTextProps>['style'];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const ReText = (props: TextProps) => {
  const {text, style} = {style: {}, ...props};
  const animatedProps = useAnimatedProps(() => {
    return {
      text: text.value,
      // Here we use any because the text prop is not available in the type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  });
  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={text.value}
      style={[
        {
          color: 'black',
        },
        style,
      ]}
      {...{animatedProps}}
    />
  );
};

import {
  PADDING,
  formatDuration2,
  radToMinutes,
  absoluteDuration,
} from '../Constants';

import Label from './Label';

interface ContainerProps {
  start: Animated.SharedValue<number>;
  end: Animated.SharedValue<number>;
  children: ReactNode;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2B2D',
    borderRadius: 16,
    padding: PADDING,
  },
  values: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: PADDING,
    color: 'white',
  },
});

const Container = ({start, end, children}: ContainerProps) => {
  const duration = useDerivedValue(() => {
    const d = absoluteDuration(start.value, end.value);
    return formatDuration2(radToMinutes(d));
  });
  return (
    <View style={styles.container}>
      <View style={styles.values}>
        <Label theta={start} label="BEDTIME" icon="bed" />
        <Label theta={end} label="WAKE UP" icon="bell" />
      </View>
      {children}
      <ReText style={styles.duration} text={duration} />
    </View>
  );
};

export default Container;
