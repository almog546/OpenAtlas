const sortPostsnew = require('../utils/sortPostNew');

test('sortPostsnew sorts posts by newest first', () => {
    const posts = [
        { id: 1, createdAt: '2023-02-01T00:00:00Z' },
        { id: 2, createdAt: '2023-04-02T00:00:00Z' },
        { id: 3, createdAt: '2023-01-03T00:00:00Z' },
    ];
    expect(sortPostsnew(posts)).toEqual([
        { id: 2, createdAt: '2023-04-02T00:00:00Z' },
        { id: 1, createdAt: '2023-02-01T00:00:00Z' },
        { id: 3, createdAt: '2023-01-03T00:00:00Z' },
    ]);
}
);
