import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';

interface Props {
  size?: number;
}

export function LoaderLottie({ size = 120 }: Props) {
  return (
    <Container>
      <LottieView
        source={require('../../../../assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
`;
