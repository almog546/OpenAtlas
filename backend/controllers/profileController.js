const prisma = require('../prismaClient');

async function getMyProfile(req, res, next) {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: {
                id: true,
                bio: true,
                avatar: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
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
            select: {
                id: true,
                bio: true,
                avatar: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
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
            select: {
                id: true,
                bio: true,
                avatar: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
            },
        });

        res.status(201).json(profile);
    } catch (error) {
        next(error);
    }
}
async function otherPeopleProfile(req, res, next) {
    try {
        const { id } = req.params;
        const profile = await prisma.profile.findUnique({
            where: { userId: id },
            select: {
                id: true,
                bio: true,
                avatar: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
            },
        });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    }
    catch (error) {
        next(error);
    }
}
async function profileposts(req, res, next) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'User id is required' });
        }

        const posts = await prisma.post.findMany({
            where: {
                authorId: id,
                published: true
            },
            select: {
                id: true,
                title: true,
                content: true,
                views: true,
                category: true,
                picture: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(posts);

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile,
    createMyProfile,
    otherPeopleProfile,
    profileposts,
};