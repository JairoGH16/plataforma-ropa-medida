import { register, login } from '../services/auth.service';

const mockUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'CLIENT' as const, phone: null, createdAt: '' };
const mockResponse = { token: 'tok', user: mockUser };

global.fetch = jest.fn();

function mockFetch(data: unknown, ok = true) {
  (fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => data,
  });
}

describe('auth.service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('returns token and user on success', async () => {
      mockFetch(mockResponse);
      const result = await register({ email: 'test@test.com', name: 'Test', password: 'pass123' });
      expect(result.token).toBe('tok');
      expect(result.user.email).toBe('test@test.com');
    });

    it('throws on failure', async () => {
      mockFetch({ message: 'Email already in use' }, false);
      await expect(register({ email: 'x@x.com', name: 'X', password: 'x' })).rejects.toThrow('Email already in use');
    });
  });

  describe('login', () => {
    it('returns token and user on success', async () => {
      mockFetch(mockResponse);
      const result = await login({ email: 'test@test.com', password: 'pass123' });
      expect(result.token).toBe('tok');
    });

    it('throws on invalid credentials', async () => {
      mockFetch({ message: 'Invalid credentials' }, false);
      await expect(login({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });
  });
});
