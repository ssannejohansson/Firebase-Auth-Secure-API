import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll
} from 'vitest';
import express from 'express';
import {
    createServer
} from 'node:http';

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'No token provided'
        });
    }

    try {
        if (token !== 'test-token') throw new Error('bad token');
        req.user = {
            uid: 'user-123',
            email: 'test@test.com'
        };
        next();
    } catch {
        res.status(401).json({
            error: 'Unauthorized'
        });
    }
};

const app = express();
app.use(express.json());
app.get('/api/secure-data', verifyToken, (req, res) => {
    res.json({
        message: 'This is protected data.'
    });
});

let server;
let baseUrl;

beforeAll(() => {
    server = createServer(app);
    server.listen(0);
    const {
        port
    } = server.address();
    baseUrl = `http://localhost:${port}`;
});

afterAll(() => server.close());

describe('GET /api/secure-data', () => {
    it('returns 401 when there is no token', async () => {
        const res = await fetch(`${baseUrl}/api/secure-data`);
        expect(res.status).toBe(401);
    });

    it('returns 401 when the token is wrong', async () => {
        const res = await fetch(`${baseUrl}/api/secure-data`, {
            headers: {
                Authorization: 'Bearer wrong-token'
            },
        });
        expect(res.status).toBe(401);
    });

    it('returns 200 and data when the token is correct', async () => {
        const res = await fetch(`${baseUrl}/api/secure-data`, {
            headers: {
                Authorization: 'Bearer test-token'
            },
        });
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toMatch(/protected data/i);
    });
});