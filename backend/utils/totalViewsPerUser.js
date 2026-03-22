function getTotalViews(posts) {
  return posts.reduce((acc, post) => acc + (post.views || 0), 0);
}
module.exports = getTotalViews;