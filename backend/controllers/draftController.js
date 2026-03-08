const prisma = require('../prismaClient');

async function createDraft(req, res, next) {
    try {
        const { title, content, category, picture } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const draft = await prisma.draft.create({
            data: {
                title,
                content,
                category,
                picture,
                authorId: userId,
            },
        });
        res.status(201).json(draft);
    }
    catch (error) {
        next(error);
    }
}

async function getDrafts(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const drafts = await prisma.draft.findMany({
            where: { authorId: userId },
        });
        res.json(drafts);
    } catch (error) {
        next(error);
    }
}

async function getDraftById(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const draft = await prisma.draft.findUnique({
            where: { id },
        });
        if (!draft || draft.authorId !== userId) {
            return res.status(404).json({ message: 'Draft not found' });
        }
        res.json(draft);
    } catch (error) {
        next(error);
    }
}
async function deleteDraft(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const draft = await prisma.draft.findUnique({
            where: { id },
        });
        if (!draft || draft.authorId !== userId) {
            return res.status(404).json({ message: 'Draft not found' });
        }
        await prisma.draft.delete({
            where: { id },
        });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
async function editdrfat(req, res, next) {
    try {
        const { id } = req.params;
        const { title, content, category, picture } = req.body;
        const userId = req.session.userId;  
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const draft = await prisma.draft.findUnique({
            where: { id },
        });
        if (!draft || draft.authorId !== userId) {
            return res.status(404).json({ message: 'Draft not found' });
        }
        const updatedDraft = await prisma.draft.update({
            where: { id },
            data: {
                title,
                content,
                category,
                picture,
            },
        });
        res.json(updatedDraft);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createDraft,
    getDrafts,
    getDraftById,
    editdrfat,
    deleteDraft
};