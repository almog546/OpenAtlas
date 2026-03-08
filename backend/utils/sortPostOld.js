function sortPostsold(posts) {
    return [...posts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

module.exports = sortPostsold;