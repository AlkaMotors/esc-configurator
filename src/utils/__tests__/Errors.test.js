import {
  BufferLengthMismatchError,
  EscInitError,
  InvalidHexFileError,
  SettingsVerificationError,
  TooManyParametersError,
  UnknownInterfaceError,
  UnknownPlatformError,
} from '../Errors';

test('custom errors are instance of Error', () => {
  let error = new BufferLengthMismatchError(10, 20);
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('byteLength of buffers do not match 10 vs. 20');

  error = new EscInitError();
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('');

  error = new InvalidHexFileError();
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('');

  error = new SettingsVerificationError();
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('Failed to verify settings');

  error = new TooManyParametersError(300);
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('4way interface supports maximum of 256 params. 300 passed');

  error = new UnknownInterfaceError('interface');
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('unknown interface: interface');

  error = new UnknownPlatformError('platform');
  expect(error instanceof Error).toBeTruthy();
  expect(error.message).toEqual('Unknown platform: platform');
});
