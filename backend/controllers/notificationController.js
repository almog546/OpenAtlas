const prisma = require('../prismaClient');

async function getNotifications(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                actor: {
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
                post: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        res.json(notifications);
    }
    catch (error) {
        next(error);
    }
}

async function markAsRead(req, res, next) {
    try {
        const userId = req.session.userId;
        const { notificationIds } = req.body || {};
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds },
                userId,
            },
            data: { isRead: true },
        });
        res.json({ message: 'Notifications marked as read' });
    }
        catch (error) {
        next(error);
    }
}
async function markOneAsRead(req, res, next) {
    try {
        const userId = req.session.userId;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const notification = await prisma.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

     
        if (notification.userId !== userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });

        res.json(updated);
    } catch (error) {
        next(error);
    }
}




module.exports = {
    getNotifications,
    markAsRead,
    markOneAsRead,
   
};