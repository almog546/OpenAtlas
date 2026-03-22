const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(express.json());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);
app.set('trust proxy', 1);

app.use(
    session({
        name: 'sid',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        },
    }),
);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/drafts', require('./routes/draftRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/follow', require('./routes/followRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/report', require('./routes/reportRoutes'));



app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
