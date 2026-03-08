const prisma = require('../prismaClient');

async function getPosts(req, res, next) {
    try {
        const posts = await prisma.post.findMany({
            include: { author: true },
        });
        res.json(posts);
    } catch (error) {
        next(error);
    }
}

async function getpostbyid(req, res, next) {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: true },
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
}
async function createPosts(req, res, next) {
    try {
        const { title, content, category, picture } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
     
        const post = await prisma.post.create({
            data: {
                title,
                content,
                category,
                picture,
                authorId: userId,
            },
        });
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPosts,
    getpostbyid,
    createPosts
};