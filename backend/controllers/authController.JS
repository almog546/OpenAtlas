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

module.exports = {
    signup,
};