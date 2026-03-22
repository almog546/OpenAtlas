const prisma = require('../prisma/client');
const { getTrendingPosts } = require('../controllers/postController');
jest.mock('../prisma/client', () => ({
    post: {
        findMany: jest.fn(),
    },
}));
describe('getTrendingPosts', () => {
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
    test('should return trending posts', async () => {
        const mockPosts = [
            {
                id: '1',
                title: 'Post 1',
                content: 'Content 1',
                authorId: '1',
                views: 100,
                createdAt: new Date(),
            },
            {
                id: '2',
                title: 'Post 2',
                content: 'Content 2',
                authorId: '2',
                views: 50,
                createdAt: new Date(),
            },
            {
                id: '3',
                title: 'Post 3',
                content: 'Content 3',
                authorId: '3',
                views: 150,
                createdAt: new Date(),
            }
        ];
        prisma.post.findMany.mockResolvedValue(mockPosts);
        await getTrendingPosts(req, res, next);
        expect(prisma.post.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                orderBy: { views: 'desc' },
                take: 10,
            })
        );
        expect(res.json).toHaveBeenCalledWith(mockPosts);
        expect(next).not.toHaveBeenCalled();
            }
    );
});
        
