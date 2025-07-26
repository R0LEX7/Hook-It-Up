import { FONT } from '@/constants/fonts.constant';
import { PRIMARY } from '@/constants/myColor';
import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface IProps {
  title: string;
  onPressHandler: () => void;
  loading?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button: React.FC<IProps> = ({ title, onPressHandler  , loading = false}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPressHandler}
      style={[
        {
          // width: wp(70),
          // height: wp(10),
          borderRadius: 6,
          backgroundColor: PRIMARY,
          justifyContent: 'center',
          alignItems: 'center',
        },
        animatedStyle,
      ]}
      className={"h-[50px] w-[300px] px-4"}
    >
      {loading ? (
        <ActivityIndicator size={'small'} color={'white'} />
      ) : (
        <Text
          style={{ fontFamily: FONT.medium }}
          className="text-white text-center capitalize text-xl "
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

export default Button;
