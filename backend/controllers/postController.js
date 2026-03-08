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
async function getMyPosts(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const posts = await prisma.post.findMany({
            where: { authorId: userId },
        });
        res.json(posts);
    }
    catch (error) {
        next(error);
    }
}

async function getmypostbyid(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const post = await prisma.post.findUnique({
            where: { id },
                include: { author: true },
        });
        if (!post ) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.json(post);
    } catch (error) {
        next(error);
    }
}

async function deletemyposts(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        await prisma.post.delete({
            where: { id },
        });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        next(error);
    }
}
async function editmyposts(req, res, next) {
    try {
        const { id } = req.params;
        const { title, content, category, picture } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.authorId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                    title,
                    content,
                    category,
                    picture,
            },
        });
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getPosts,
    getpostbyid,
    createPosts,
    getMyPosts,
    getmypostbyid,
    deletemyposts,
    editmyposts
};