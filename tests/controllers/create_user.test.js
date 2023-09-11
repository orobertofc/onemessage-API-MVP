const new_user = require("../../src/REST/controllers/users/new/main");

const { v4: uuidv4 } = require('uuid');
const {generateAccessToken, generateRefreshToken} = require("../../src/REST/JWT/create_token/create_token");

jest.mock('../../src/helpers/JWT/generate_new', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

describe('new_user function', () => {
  it('registers a new user', async () => {
    // Mock Prisma client methods
    prisma.user.create = jest.fn().mockResolvedValue({
      id: 1,
      user_name: 'testuser',
      public_id: 'test-uuid',
      private_id: 'test-uuid',
    });

    // Mock UUID generation
    uuidv4.mockReturnValue('test-uuid');

    // Mock JWT generation
    generateAccessToken.mockResolvedValue('test-access-token');
    generateRefreshToken.mockResolvedValue('test-refresh-token');

    const result = await new_user('testuser');

    expect(result).toEqual(['test-access-token', 'test-refresh-token']);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        user_name: 'testuser',
        public_id: 'test-uuid',
        private_id: 'test-uuid',
      },
    });
    expect(generateAccessToken).toHaveBeenCalledWith({
      id: 1,
      user_name: 'testuser',
      public_id: 'test-uuid',
      private_id: 'test-uuid',
    });
    expect(generateRefreshToken).toHaveBeenCalledWith({
      private_id: 'test-uuid',
    });
  });

  it('handles errors', async () => {
    // Mock Prisma client methods
    prisma.$transaction = jest.fn().mockRejectedValue(new Error('Test error'));

    const result = await new_user('testuser');

    expect(result).toEqual('An error occurred while processing the request.');
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});