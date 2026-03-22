const gettotalCommentsPerUser = require('../utils/totalCommentsPerUser');

test('getTotalCommentsPerUser calculates total comments for a user', () => {
    const comments = [
        { id: 1, content: 'Comment 1' },
        { id: 2, content: 'Comment 2' },
        { id: 3, content: 'Comment 3' },
    ];
    expect(gettotalCommentsPerUser(comments)).toBe(3);
});

test('getTotalCommentsPerUser returns 0 if no comments', () => {
    const comments = [];
    expect(gettotalCommentsPerUser(comments)).toBe(0);
});
test('getTotalCommentsPerUser handles comments with missing content', () => {
    const comments = [
        { id: 1, content: 'Comment 1' },
        { id: 2 },
        { id: 3, content: 'Comment 3' },
    ];
    expect(gettotalCommentsPerUser(comments)).toBe(2);
});
