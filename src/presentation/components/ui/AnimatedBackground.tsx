import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');

interface Props {
  children: React.ReactNode;
}

interface Move {
  x: number;
  y: number;
  s: number;
  dur: number;
}

interface OrbConfig {
  size: number;
  top: number;
  left?: number;
  right?: number;
  colors: [string, string];
  moves: Move[];
}

interface OrbState {
  x: Animated.Value;
  y: Animated.Value;
  s: Animated.Value;
  config: OrbConfig;
}

const CONFIGS: OrbConfig[] = [
  {
    size: 420,
    top: -0.1,
    left: -130,
    colors: ['#10B981', '#065F46'],
    moves: [
      { x: 150, y: -90, s: 1.3, dur: 15000 },
      { x: -110, y: 130, s: 0.78, dur: 12000 },
      { x: 90, y: -70, s: 1.18, dur: 18000 },
      { x: -130, y: 100, s: 0.82, dur: 14000 },
      { x: 70, y: -110, s: 1.22, dur: 16000 },
      { x: -70, y: 70, s: 0.88, dur: 13000 },
      { x: 0, y: 0, s: 1, dur: 19000 },
    ],
  },
  {
    size: 320,
    top: 0.1,
    right: -90,
    colors: ['#F59E0B', '#FDE047'],
    moves: [
      { x: -130, y: 110, s: 0.82, dur: 16000 },
      { x: 100, y: -80, s: 1.28, dur: 13000 },
      { x: -80, y: 90, s: 0.88, dur: 17000 },
      { x: 120, y: -60, s: 1.12, dur: 12000 },
      { x: -60, y: 100, s: 1.22, dur: 15000 },
      { x: 0, y: 0, s: 1, dur: 18000 },
    ],
  },
  {
    size: 260,
    top: 0.4,
    left: width * 0.44,
    colors: ['#065F46', '#10B981'],
    moves: [
      { x: 90, y: -100, s: 1.22, dur: 14000 },
      { x: -110, y: 70, s: 0.82, dur: 11000 },
      { x: 70, y: -50, s: 1.14, dur: 19000 },
      { x: -90, y: 110, s: 0.86, dur: 13000 },
      { x: 50, y: -80, s: 1.18, dur: 16000 },
      { x: 0, y: 0, s: 1, dur: 15000 },
    ],
  },
  {
    size: 200,
    top: 0.72,
    left: -40,
    colors: ['#FDE047', '#F59E0B'],
    moves: [
      { x: -80, y: 70, s: 1.18, dur: 13000 },
      { x: 100, y: -90, s: 0.82, dur: 10000 },
      { x: -60, y: 50, s: 1.12, dur: 16000 },
      { x: 80, y: -70, s: 0.88, dur: 12000 },
      { x: -50, y: 60, s: 1.06, dur: 14000 },
      { x: 0, y: 0, s: 1, dur: 17000 },
    ],
  },
  {
    size: 300,
    top: 0.86,
    left: width * 0.52,
    colors: ['#10B981', '#FDE047'],
    moves: [
      { x: -70, y: -110, s: 0.78, dur: 18000 },
      { x: 90, y: 70, s: 1.24, dur: 14000 },
      { x: -50, y: -60, s: 0.88, dur: 15000 },
      { x: 110, y: 90, s: 1.18, dur: 11000 },
      { x: -90, y: -50, s: 1.12, dur: 16000 },
      { x: 0, y: 0, s: 1, dur: 20000 },
    ],
  },
];

export function AnimatedBackground({ children }: Props) {
  const orbsRef = useRef<OrbState[]>(
    CONFIGS.map((config) => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      s: new Animated.Value(1),
      config,
    })),
  ).current;

  useEffect(() => {
    const animations = orbsRef.map((orb) => {
      const anim = Animated.loop(
        Animated.sequence(
          orb.config.moves.map((m) =>
            Animated.parallel([
              Animated.timing(orb.x, {
                toValue: m.x,
                duration: m.dur,
                useNativeDriver: true,
              }),
              Animated.timing(orb.y, {
                toValue: m.y,
                duration: m.dur,
                useNativeDriver: true,
              }),
              Animated.timing(orb.s, {
                toValue: m.s,
                duration: m.dur,
                useNativeDriver: true,
              }),
            ]),
          ),
        ),
      );
      anim.start();
      return anim;
    });

    return () => {
      animations.forEach((a) => a.stop());
    };
  }, [orbsRef]);

  return (
    <Container>
      <DeepGradient colors={['#F8FAFC', '#F0FDF4', '#F8FAFC']} />
      {orbsRef.map((orb, i) => {
        const { config } = orb;
        const posStyle: Record<string, number | string> = {
          position: 'absolute' as const,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          top: config.top * height,
        };
        if (config.left !== undefined) posStyle.left = config.left;
        if (config.right !== undefined) posStyle.right = config.right;

        return (
          <OrbBase
            key={i}
            style={[
              posStyle,
              {
                transform: [
                  { translateX: orb.x },
                  { translateY: orb.y },
                  { scale: orb.s },
                ],
              },
            ]}
          >
            <OrbGradient colors={config.colors} />
          </OrbBase>
        );
      })}
      <StyledBlur intensity={90} tint="light" />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #F8FAFC;
`;

const DeepGradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 0.5, y: 1 },
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const OrbBase = styled(Animated.View)`
  position: absolute;
  overflow: hidden;
`;

const OrbGradient = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 100%;
  height: 100%;
`;

const StyledBlur = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Content = styled.View`
  flex: 1;
`;
