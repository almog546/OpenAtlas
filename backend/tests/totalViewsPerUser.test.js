const viewsByUser = require('../utils/getTotalViews');

test('getTotalViews calculates total views for a user', () => {
    const posts = [
        { id: 1, views: 100 },
        { id: 2, views: 150 },
        { id: 3, views: 200 },
    ];
    expect(viewsByUser(posts)).toBe(450);
});

test('getTotalViews returns 0 if no posts', () => {
    const posts = [];
    expect(viewsByUser(posts)).toBe(0);
});
test('getTotalViews handles posts with missing views', () => {
    const posts = [
        { id: 1, views: 100 },
        { id: 2 },
        { id: 3, views: 200 },
    ];
    expect(viewsByUser(posts)).toBe(300);
});
