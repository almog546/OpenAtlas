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
       await prisma.postHistory.create({
            data: {
                title: post.title,
                content: post.content,
                category: post.category,
                picture: post.picture,
                postId: post.id,
                authorId: userId,
            },
        });

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

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: userId,

            },
            include: {
                 author:{
                    include: {
                        profile: true,
                    },
                },
                 }
            
        });
        
        if (post.authorId !== userId) {
            await prisma.notification.create({
                data: {
                    userId: post.authorId,
                    actorId: userId,
                    type: 'comment',
                    postId,
                    commentId: comment.id,
                },
            });
        }
        
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
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
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
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
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
async function replyToComment(req, res, next) {
    try {
        const { id } = req.params; 
        const { content } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const parentComment = await prisma.comment.findUnique({
            where: { id },
        });
        if (!parentComment) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }
        const reply = await prisma.reply.create({
            data: {
                content,
                commentId: id,
                authorId: userId,
            },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        res.status(201).json(reply);
    } catch (error) {
        next(error);
    }
}
async function getRepliesByCommentId(req, res, next) {
    try {
        const { id } = req.params;
        const replies = await prisma.reply.findMany({
            where: { commentId: id },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        res.json(replies);
    } catch (error) {
        next(error);
    }
}
async function getRepliesByPostId(req, res, next) {
    try {
        const { postId } = req.params;
        const comments = await prisma.comment.findMany({
            where: { postId },
        });
        const commentIds = comments.map(c => c.id);
        const replies = await prisma.reply.findMany({
            where: { commentId: { in: commentIds } },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        res.json(replies);
    } catch (error) {
        next(error);
    }
}
async function deleteReply(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const reply = await prisma.reply.findUnique({
            where: { id },
        });
        if (!reply || reply.authorId !== userId) {
            return res.status(404).json({ message: 'Reply not found or unauthorized' });
        }
        await prisma.reply.delete({
            where: { id },
        });
        res.json({ message: 'Reply deleted' });
    } catch (error) {
        next(error);
    }
}
async function editReply(req, res, next) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const reply = await prisma.reply.findUnique({
            where: { id },
        });
        if (!reply || reply.authorId !== userId) {
            return res.status(404).json({ message: 'Reply not found or unauthorized' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const updatedReply = await prisma.reply.update({
            where: { id },
            data: { content },
        });
        res.json(updatedReply);
    } catch (error) {
        next(error);
    }
}
async function bookMarkpost(req, res, next) {
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
        const existingBookmark = await prisma.bookmark.findFirst({
            where: {
                userId,
                postId: id,
            },
        });
        if (existingBookmark) {
            return res.status(400).json({ message: 'Post already bookmarked' });
        }
        await prisma.bookmark.create({
            data: {
                userId,
                postId: id,
            },
        });
        res.json({ message: 'Post bookmarked' });
    } catch (error) {
        next(error);
    }
}
async function unbookmarkpost(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const bookmark = await prisma.bookmark.findFirst({
            where: {
                userId,
                postId: id,
            },
        });
        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        await prisma.bookmark.delete({
            where: {
                id: bookmark.id,
            },
        });
        res.json({ message: 'Post unbookmarked' });
    } catch (error) {
        next(error);
    }
}
async function getBookmarkedPosts(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                post: {
                    include: {
                        author: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(bookmarks);
    }
        catch (error) {
        next(error);
    }
}

async function checkBookmarkStatus(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.json({ bookmarked: false });
        }
        const bookmark = await prisma.bookmark.findFirst({
            where: {
                userId,
                postId: id,
            },
        });
        res.json({ bookmarked: !!bookmark });
    } catch (error) {
        next(error);
    }
}
async function addView(req, res, next) {
    try {
        const { id } = req.params;
        
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await prisma.post.update({
            where: { id },
            data: {
                views: post.views + 1,
             },
        });
        res.json({ message: 'View added' });
    } catch (error) {
        next(error);
    }
}
async function getTrendingPosts(req, res, next) {
    try {
         const fourDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 4);
        const trendingPosts = await prisma.post.findMany({
            where: {
                createdAt: {
                    gte: fourDaysAgo,
                },
            },
            orderBy: {
                views: 'desc',
            },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        res.json(trendingPosts);
    } catch (error) {
        next(error);
    }
}
async function getPostsByAuthorId(req, res, next) {
    try {
        const { authorId } = req.params;
        const posts = await prisma.post.findMany({
            where: { authorId },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        res.json(posts);
    }
        catch (error) {
        next(error);
    }
}
async function getEditedHistory(req, res, next) {
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
            return res.status(403).json({ message: 'Not authorized' });
        }
        const postHistory = await prisma.postHistory.findMany({
            where: { postId: id },
        });
        res.json(postHistory);
    } catch (error) {
        next(error);
    }
}
async function getEditedHistoryById(req, res, next) {
    try {
        const { id, historyId } = req.params;
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
            return res.status(403).json({ message: 'Not authorized' });
        }
        const history = await prisma.postHistory.findUnique({
            where: { id: historyId },
        });
        if (!history || history.postId !== id) {
            return res.status(404).json({ message: 'History not found' });
        }
        res.json(history);
    } catch (error) {
        next(error);
    }   
}
async function adminDeletePost(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const post = await prisma.post.findUnique({
            where: { id },
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await prisma.post.delete({
            where: { id },
        });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
async function adminDeleteComment(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const comment = await prisma.comment.findUnique({
            where: { id },
        });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        await prisma.comment.delete({
            where: { id },
        });
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
async function adminDeleteReply(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const reply = await prisma.reply.findUnique({
            where: { id },
        });
        if (!reply) {
            return res.status(404).json({ message: 'Reply not found' });
        }
        await prisma.reply.delete({
            where: { id },
        });
        res.status(204).end();
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
    editmyposts,
    createComment,
    getCommentsByPostId,
    deleteComment,
    editComment,
    replyToComment,
    getRepliesByCommentId,
    getRepliesByPostId,
    deleteReply,
    editReply,
    bookMarkpost,
    unbookmarkpost,
    getBookmarkedPosts,
    checkBookmarkStatus,
    addView,
    getTrendingPosts,
    getPostsByAuthorId,
    getEditedHistory,
    getEditedHistoryById,
    adminDeletePost,
    adminDeleteComment,
    adminDeleteReply
};