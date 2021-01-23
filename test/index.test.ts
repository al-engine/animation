import { AnimationData } from '../src';

test('', () => {
  const asset = {
    isLoading: () => false,
    data: undefined,
    load: jest.fn(),
  };

  const animationData = new AnimationData(asset, {});
  expect(animationData).toBeTruthy();
});
