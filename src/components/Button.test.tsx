import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

test('button triggers onPress', async () => {
  const onPressMock = jest.fn();
  const { getByText } = await render(<Button title="Click" onPress={onPressMock} />);
  fireEvent.press(getByText('Click'));
  expect(onPressMock).toHaveBeenCalled();
});
