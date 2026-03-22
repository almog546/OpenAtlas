const prisma = require('../prisma/client');
const { getAllUsers } = require('../controllers/authController');

jest.mock('../prisma/client', () => ({
    user: {
        findMany: jest.fn(),
    },
}));

describe('getAllUsers', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        next = jest.fn();

        jest.clearAllMocks();
    });

    test('should return all users', async () => {
        const mockUsers = [
            {
                id: '1',
                username: 'john123',
                name: 'John',
                role: 'user',
                _count: {
                    posts: 2,
                    comments: 4,
                    replies: 1,
                },
            },
        ];

        prisma.user.findMany.mockResolvedValue(mockUsers);

        await getAllUsers(req, res, next);

        expect(prisma.user.findMany).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockUsers);
        expect(next).not.toHaveBeenCalled();
    });
});