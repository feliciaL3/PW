const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config(); // Încarcă variabilele din .env
const app = express();
app.use(express.json());
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');
const fs = require('fs');

app.use(cors({
    origin: 'http://localhost:3000'
}));

const users = {
    'admin': { password: 'admin', role: 'ADMIN' },
    'user': { password: 'user', role: 'VISITOR' }
};

const permissions = {
    ADMIN: ["READ", "WRITE"],
    VISITOR: ["READ"]
};

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

// Middleware to check admin role
function checkAdminRole(req, res, next) {
    if (req.user.role !== 'ADMIN') {
        return res.sendStatus(403);
    }
    next();
}

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Generate a token based on user role
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: The role of the user (ADMIN or VISITOR)
 *     responses:
 *       200:
 *         description: Successfully generated token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT for authenticated access
 *       400:
 *         description: Invalid role provided
 *       403:
 *         description: Unauthorized access attempt
 */

app.post('/token', (req, res) => {
    const { role } = req.body;

    if (!permissions[role]) {
        return res.status(400).json({ error: "Invalid role" });
    }

    const token = jwt.sign(
        { role, permissions: permissions[role] },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
    );

    res.json({ token });
});

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Access protected data
 *     tags: [Data Access]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Protected data content
 *       403:
 *         description: Forbidden, credentials are not valid for this resource
 */

app.get('/data', authenticateToken, (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Your access token is invalid or has expired" });
    }

    if (!req.user.permissions.includes("READ")) {
        return res.status(403).json({ error: "You do not have permission to read this data" });
    }

    res.json({ data: "This is protected data accessible based on permissions." });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Unauthorized
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    if (user && user.password === password) {
        const token = jwt.sign(
            {
                username,
                role: user.role,
                permissions: permissions[user.role]
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ token, username, role: user.role });
    } else {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
});

/**
 * @swagger
 * /user-data:
 *   get:
 *     summary: Get user data based on the provided token
 *     tags: [User Info]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       403:
 *         description: Access Forbidden
 */

app.get('/user-data', authenticateToken, (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Access Forbidden" });
    } else {
        res.json({ username: req.user.username, role: req.user.role, permissions: req.user.permissions });
    }
});

/**
 * @swagger
 * /liked-books:
 *   delete:
 *     summary: Delete a book from LikedBooks by author (Admin only)
 *     tags: [LikedBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         required: true
 *         description: The author of the book to delete
 *     responses:
 *       200:
 *         description: Book successfully deleted
 *       403:
 *         description: Forbidden, only admin can delete books
 *       404:
 *         description: Book not found
 */
app.delete('/liked-books', authenticateToken, checkAdminRole, (req, res) => {
    const { author } = req.query;
    let likedBooks = JSON.parse(fs.readFileSync('likedBooks.json'));

    const booksToDelete = likedBooks.filter(book => book.author.includes(author));

    if (booksToDelete.length > 0) {
        likedBooks = likedBooks.filter(book => !book.author.includes(author));
        fs.writeFileSync('likedBooks.json', JSON.stringify(likedBooks));
        res.json({ message: "Books by the specified author successfully deleted" });
    } else {
        res.status(404).json({ error: "No books found by the specified author" });
    }
});

/**
 * @swagger
 * /liked-books/unprotected:
 *   delete:
 *     summary: Delete books by author without authentication
 *     tags: [Liked Books]
 *     parameters:
 *       - in: query
 *         name: author
 *         required: true
 *         schema:
 *           type: string
 *         description: The author whose books will be deleted
 *     responses:
 *       200:
 *         description: Books successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       404:
 *         description: No books found by the specified author
 */

app.delete('/liked-books/unprotected', (req, res) => {
    const { author } = req.query;
    let likedBooks = JSON.parse(fs.readFileSync('likedBooks.json', 'utf8'));

    const booksToDelete = likedBooks.filter(book => book.author.includes(author));

    if (booksToDelete.length > 0) {
        likedBooks = likedBooks.filter(book => !book.author.includes(author));
        fs.writeFileSync('likedBooks.json', JSON.stringify(likedBooks));
        res.json({ message: "Books by the specified author successfully deleted" });
    } else {
        res.status(404).json({ error: "No books found by the specified author" });
    }
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
