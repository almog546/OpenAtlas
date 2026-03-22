function getTotalCommentsPerUser(comments) {
    if (!Array.isArray(comments)) return 0;

    return comments.reduce((acc, comment) => {
        const replies = comment._count?.replies || 0;
        return acc + 1 + replies;
    }, 0);
}

module.exports = getTotalCommentsPerUser;