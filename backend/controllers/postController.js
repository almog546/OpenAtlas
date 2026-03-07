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

module.exports = {
    getPosts,
    getpostbyid,
};