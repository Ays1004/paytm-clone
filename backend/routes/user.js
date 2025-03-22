const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const authMiddleware = require("../middleware");
const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

router.post("/signup", async (req, res) => {
    const success = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect Inputs",
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username,
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken",
        });
    }

    const user = await User.create({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
    });
    const userId = user._id;

    await Account.create({
        userId,
        balance: Math.random() * 10000 + 1,
    });

    const token = jwt.sign(
        {
            userId,
        },
        JWT_SECRET
    );

    res.json({
        message: "User created Successfully",
        token: token,
    });
});

router.post("/signin", async (req, res) => {
    const success = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Error while logging in",
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    });

    if (user) {
        const token = jwt.sign(
            {
                userId: user._id,
            },
            JWT_SECRET
        );

        res.json({
            token: token,
        });
        return;
    }

    res.status(411).json({
        message: "Error while logging in",
    });
});

router.put("/", authMiddleware, async (req, res) => {
    const success = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message: "Error while updating information",
        });
    }

    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        message: "Updated Successfully",
    });
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            {
                firstName: {
                    $regex: filter,
                },
            },
            {
                lastName: {
                    $regex: filter,
                },
            },
        ],
    });
    res.json({
        user: users.map((user) => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        })),
    });
});

module.exports = router;
