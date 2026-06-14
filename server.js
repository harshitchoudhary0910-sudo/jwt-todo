const express = require('express');
const fs = require('fs/promises');
const app = express();
const path = require('path');
const jwt = require("jsonwebtoken")

app.use(express.json());

app.get("/main", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/user.html"));
})


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/index.html"));
});

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/signin.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/signup.html"));
});




app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const data = await fs.readFile("./data/users.json", "utf8");
    const users = JSON.parse(data);

    const check = users.find((user) => {
        return user.username === username;
    });

    if (check) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });

    await fs.writeFile("./data/users.json", JSON.stringify(users));
    res.status(201).json({ message: "User created successfully" });

});

app.post("/signin", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const data = await fs.readFile("./data/users.json", "utf8");
    const users = JSON.parse(data);

    const check = users.find((user) => {
        return user.username === username && user.password === password;
    });

    if (!check) {
        return res.status(400).json({ message: "User does not exist" });

    }
    // json web tokens
    const token = jwt.sign({
        username: username
    }, password);

    res.json({
        token: token
    })


})




app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
















