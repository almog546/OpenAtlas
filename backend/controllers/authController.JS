const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');

async function signup(req, res, next) {
    try {
        const { username, name, password } = req.body;
        
        if (!username || !name || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long' });
        }
        if (name.length < 3) {
            return res.status(400).json({ message: 'Name must be at least 3 characters long' });
        }
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                name,
                password: hashedPassword,
            },
        });
        res.status(201).json(
            {
                id: user.id,
                username: user.username,
                name: user.name,
            }
        );
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        req.session.userId = user.id;
        res.json(
            {
                id: user.id,
                username: user.username,
                name: user.name,
            }
        );
    } catch (error) {
        next(error);
    }
}

async function me(req, res, next) {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(
            {
                id: user.id,
                username: user.username,
                name: user.name,
            }
        );
    }
    catch (error) {
        next(error);
    }
}
async function logout(req, res, next) {
    try {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('sid');
            res.json({ message: 'Logged out successfully' });
        }
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    login,
    me,
};