const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();

const PORT = 3000;

// MongoDB connection
const client = new MongoClient("mongodb://localhost:27017");

let usersCollection;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "student-login-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60
        }
    })
);

// Serve files from public folder
app.use(express.static("public"));


// ============================
// REGISTER
// ============================

app.post("/api/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        // Check if user already exists
        const existingUser =
            await usersCollection.findOne({
                email: email
            });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });

        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Save user in MongoDB
        await usersCollection.insertOne(newUser);

        res.json({
            success: true,
            message: "Registration successful."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Registration failed."
        });

    }

});


// ============================
// LOGIN
// ============================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await usersCollection.findOne({
                email: email
            });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        // Create session
        req.session.userId =
            user._id.toString();

        req.session.username =
            user.name;

        req.session.email =
            user.email;

        res.json({
            success: true,
            message: "Login successful.",
            name: user.name
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed."
        });

    }

});


// ============================
// CHECK LOGIN
// ============================

app.get("/api/user", (req, res) => {

    if (!req.session.userId) {

        return res.status(401).json({
            success: false,
            message: "Not logged in."
        });

    }

    res.json({
        success: true,
        name: req.session.username,
        email: req.session.email
    });

});


// ============================
// LOGOUT
// ============================

app.post("/api/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });

        }

        res.json({
            success: true,
            message: "Logged out successfully."
        });

    });

});


// ============================
// MONGODB CONNECTION
// ============================

async function startServer() {

    try {

        await client.connect();

        console.log("Connected to MongoDB");

        const db =
            client.db("studentLoginDB");

        usersCollection =
            db.collection("users");

        console.log(
            "Database: studentLoginDB"
        );

        console.log(
            "Collection: users"
        );

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error
        );

    }

}

startServer();