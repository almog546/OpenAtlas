const totalPosts = require('../utils/totalposts');

test('totalPosts returns the correct number of posts', () => {
    const posts = [
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
        { id: 3, title: 'Post 3' },
    ];
    expect(totalPosts(posts)).toBe(3);
});

test('totalPosts returns 0 for an empty array', () => {
    const posts = [];
    expect(totalPosts(posts)).toBe(0);
});
