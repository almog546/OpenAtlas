const prisma = require('../prismaClient');

async function createComment(req, res, next) {
    try {
        const { content, postId } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!content || !postId) {
            return res.status(400).json({ message: 'Content and postId are required' });
        }
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: userId,

            },
            orderBy: {
                createdAt: 'desc',
            },
            
        });
        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
}
async function getCommentsByPostId(req, res, next) {
    try {
        const { postId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId },
            include: { author: true },
        });
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
}
async function deleteComment(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const comment = await prisma.comment.findUnique({
            where: { id },
        });
        if (!comment || comment.authorId !== userId) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }
        await prisma.comment.delete({
            where: { id },
        });
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        next(error);
    }
}
async function editComment(req, res, next) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const comment = await prisma.comment.findUnique({
            where: { id },
        });
        if (!comment || comment.authorId !== userId) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }
        const updatedComment = await prisma.comment.update({
            where: { id },
            data: { content },
        });
        res.json(updatedComment);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createComment,
    getCommentsByPostId,
    deleteComment,
    editComment,
};
