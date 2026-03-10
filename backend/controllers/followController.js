const prisma = require('../prismaClient');

async function followUser(req, res, next) {
    try {
        const userId = req.session.userId;
        const followingId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (userId === followingId) {
            return res.status(400).json({ message: 'Cannot follow yourself' });
        }
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId,
                },
            },
        });
        if (existingFollow) {
            return res.status(400).json({ message: 'Already following this user' });
        }
        const follow = await prisma.follow.create({
            data: {
                followerId: userId,
                followingId,
            },
        });
        res.status(201).json(follow);
    } catch (error) {
        next(error);
    }
}
async function unfollowUser(req, res, next) {
    try {
        const userId = req.session.userId;
        const followingId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId,
                },
            },
        });
        if (!existingFollow) {
            return res.status(400).json({ message: 'Not following this user' });
        }
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId,
                },
            },
        });
        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        next(error);
    }
}
async function getFollowers(req, res, next) {
    try {
        const { id } = req.params;

        const followers = await prisma.follow.findMany({
            where: { followingId: id },
            select: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        res.json(followers);
    } catch (error) {
        next(error);
    }
}

            
async function getFollowing(req, res, next) {
    try {
        const { id } = req.params;

        const following = await prisma.follow.findMany({
            where: { followerId: id },
            select: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        res.json(following);
    } catch (error) {
        next(error);
    }
}




module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
};