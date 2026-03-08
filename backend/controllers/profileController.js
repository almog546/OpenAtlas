const prisma = require('../prismaClient');

async function getMyProfile(req, res, next) {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                user: {
                    include: {
                        posts: {
                            where: { published: true },
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                },
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        next(error);
    }
}
async function updateMyProfile(req, res, next) {
    try {
        const userId = req.session.userId;
        const { name, bio, avatar } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });
        if (!existingProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const profile = await prisma.profile.update({
            where: { userId },
            data: {
                bio,
                avatar,
                user: {
                    update: {
                        name,
                    },
                },
            },
            include: {
                user: true,
            },
        });

        res.json(profile);
    } catch (error) {
        next(error);
    }
}
async function createMyProfile(req, res, next) {
    try {
        const userId = req.session.userId;
        const { bio, avatar } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        const profile = await prisma.profile.create({
            data: {
                userId,
                bio,
                avatar,
            },
            include: {
                user: true,
            },
        });

        res.status(201).json(profile);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile,
    createMyProfile,
};