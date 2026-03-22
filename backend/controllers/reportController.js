const prisma = require('../prismaClient');

async function createReportPost(req, res, next) {
    try {
        const userId = req.session.userId;
        const { postId, reason } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const report = await prisma.report.create({
            data: {
                postId,
                reporterId: userId,
                reason,
                type: 'POST',
            },
        });
        res.status(201).json(report);
    } catch (error) {
        next(error);
    } 
}
async function createReportComment(req, res, next) {
    try {
        const userId = req.session.userId;
        const { commentId, reason } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const report = await prisma.report.create({
            data: {
                commentId,
                reporterId: userId,
                type: 'COMMENT',
                reason,    
            },
        });
        res.status(201).json(report);
    } catch (error) {
        next(error);
    }
}
async function getReports(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const reports = await prisma.report.findMany(
            {
                where: { status: 'OPEN' },
                select: {
                    id: true,
                    reason: true,
                    type: true,
                    status: true,
                    createdAt: true,
                    reporterId: true,
                    postId: true,
                    commentId: true,
                    post: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    comment: {
                        select: {
                            id: true,
                            content: true,
                        },
                    },
                    reporter: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        },
                    },
                },
            }
        );
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
}
async function deleteReport(req, res, next) {
    try {
        const userId = req.session.userId;
         const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
       
        const report = await prisma.report.delete({
            where: { id: id },
        });
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}
async function resolveReport(req, res, next) {
    try {
        const userId = req.session.userId;
         const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const report = await prisma.report.update({
            where: { id: id },
            data: { status: 'RESOLVED' },
        });
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
}
module.exports = {
    createReportPost,
    createReportComment,
    getReports,
    deleteReport,
    resolveReport,
}