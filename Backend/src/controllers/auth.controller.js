import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import config from "../config/config.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

function generateAccessToken(userId, sessionId) {
    return jwt.sign(
        {
            userId,
            sessionId
        },
        config.jwtSecret,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    );
}

function generateRefreshToken(userId) {
    return jwt.sign(
        {
            userId
        },
        config.jwtSecret,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    );
}

function hashRefreshToken(refreshToken) {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
}

function setRefreshTokenCookie(res, refreshToken) {
    res.cookie(
        "refreshToken",
        refreshToken,
        COOKIE_OPTIONS
    );
}

function clearRefreshTokenCookie(res) {
    res.clearCookie(
        "refreshToken",
        COOKIE_OPTIONS
    );
}

function userResponse(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email
    };
}

async function createSession(req, userId, refreshToken) {

    const refreshTokenHash =
        hashRefreshToken(refreshToken);

    return sessionModel.create({

        userId,

        refreshTokenHash,

        ip: req.ip,

        userAgent: req.headers["user-agent"]

    });

}

export async function register(req, res) {
    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const refreshToken = generateRefreshToken(user._id);

        const session = await createSession(
            req,
            user._id,
            refreshToken
        );

        const accessToken = generateAccessToken(
            user._id,
            session._id
        );

        setRefreshTokenCookie(
            res,
            refreshToken
        );

        return res.status(201).json({

            message: "User registered successfully",

            accessToken,

            user: userResponse(user)

        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

export async function login(req, res) {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const refreshToken = generateRefreshToken(
            user._id
        );

        const session = await createSession(
            req,
            user._id,
            refreshToken
        );

        const accessToken = generateAccessToken(
            user._id,
            session._id
        );

        setRefreshTokenCookie(
            res,
            refreshToken
        );

        return res.status(200).json({

            message: "Logged in successfully",

            accessToken,

            user: userResponse(user)

        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

export async function getMe(req, res) {
    try {

        const authorization = req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            config.jwtSecret
        );

        const user = await userModel
            .findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({

            message: "User fetched successfully",

            user: userResponse(user)

        });

    } catch (error) {

        console.error("Get Me Error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
}

export async function refreshToken(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.jwtSecret
        );

        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const newRefreshToken =
            generateRefreshToken(decoded.userId);

        session.refreshTokenHash =
            hashRefreshToken(newRefreshToken);

        session.ip = req.ip;
        session.userAgent = req.headers["user-agent"];

        await session.save();

        const accessToken =
            generateAccessToken(
                decoded.userId,
                session._id
            );

        setRefreshTokenCookie(
            res,
            newRefreshToken
        );

        return res.status(200).json({

            message: "Access token refreshed successfully",

            accessToken

        });

    } catch (error) {

        console.error(
            "Refresh Token Error:",
            error
        );

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });

    }
}

export async function logout(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) {
            clearRefreshTokenCookie(res);

            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        session.revoked = true;
        await session.save();

        clearRefreshTokenCookie(res);

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {

        console.error("Logout Error:", error);

        clearRefreshTokenCookie(res);

        return res.status(500).json({
            message: "Internal server error"
        });

    }
}

export async function logoutAll(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            config.jwtSecret
        );

        await sessionModel.updateMany(
            {
                userId: decoded.userId,
                revoked: false
            },
            {
                $set: {
                    revoked: true
                }
            }
        );

        clearRefreshTokenCookie(res);

        return res.status(200).json({
            message: "Logged out from all devices successfully"
        });

    } catch (error) {

        console.error("Logout All Error:", error);

        clearRefreshTokenCookie(res);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });

    }
}