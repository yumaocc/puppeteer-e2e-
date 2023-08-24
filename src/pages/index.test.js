import { requestErrorMonitoring } from './error';
test('should add new time and error to sessionStorage when feErrorKey is empty', () => {
  const error = { message: 'Something went wrong' };

  // Mock sessionStorage methods
  const sessionStorageMock = {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  global.sessionStorage = sessionStorageMock;

  // Call the function
  requestErrorMonitoring(error);

  // Assertions
  expect(sessionStorageMock.getItem).toHaveBeenCalledWith('feErrorKey');
  expect(sessionStorageMock.setItem).toHaveBeenCalledTimes(3);
  expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
    'feErrorKey',
    JSON.stringify(['YYYY-MM-DD HH:mm:ss']),
  );
  expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
    'YYYY-MM-DD HH:mm:ss',
    JSON.stringify(error),
  );
});

test('should remove oldest error key and add new time and error to sessionStorage when feErrorKey has 100 records', () => {
  const error = { message: 'Something went wrong' };

  // Mock sessionStorage methods
  const sessionStorageMock = {
    getItem: jest.fn(() => JSON.stringify(Array.from({ length: 100 }))),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  global.sessionStorage = sessionStorageMock;

  // Call the function
  requestErrorMonitoring(error);

  // Assertions
  expect(sessionStorageMock.getItem).toHaveBeenCalledWith('feErrorKey');
  expect(sessionStorageMock.removeItem).toHaveBeenCalledTimes(1);
  expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('oldestErrorKey');
  expect(sessionStorageMock.setItem).toHaveBeenCalledTimes(3);
  expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
    'feErrorKey',
    JSON.stringify(['YYYY-MM-DD HH:mm:ss']),
  );
  expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
    'YYYY-MM-DD HH:mm:ss',
    JSON.stringify(error),
  );
});
