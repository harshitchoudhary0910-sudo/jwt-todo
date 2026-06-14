const express = require('express');
const fs = require('fs/promises');
const app = express();
const path = require('path');
const jwt = require("jsonwebtoken")
const {authenticateToken}=require("./middleware.js");
app.use(express.static(path.join(__dirname, "frontend")));


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

// authenticated endpoint

app.get("/todos",authenticateToken, async (req, res) => {
    const username=req.username;
    const data=await fs.readFile("./data/todo.json", "utf8");
    const users = JSON.parse(data);
    return res.json({
        todos: users[username]
    })
   
})

app.post("/todos", authenticateToken, async (req, res) => {
    const username=req.username;
    const todo=req.body.todo;
    const data=await fs.readFile("./data/todo.json", "utf8");
    const todoObj = JSON.parse(data);
    const todos=todoObj[username];
    const newId =
    todos.length === 0
        ? 1
        : todos[todos.length - 1].id + 1;
    const createdTodo = {
        "id":newId,
        "todo":todo

    };
    todos.push(createdTodo);

    await fs.writeFile(
    "./data/todo.json",
    JSON.stringify(todoObj)
);

res.json({
    message: "Todo added successfully",
    todo: createdTodo
});
    

});


app.delete("/todos",authenticateToken, async (req,res)=>{
    const userName=req.username;
    const id=Number(req.body.id);
    const data=await fs.readFile("./data/todo.json", "utf8");
    const todoObj = JSON.parse(data);
    const todos=todoObj[userName];
    todoObj[userName] = todos.filter(todo => todo.id !== id);

    await fs.writeFile(
        "./data/todo.json",
        JSON.stringify(todoObj)
    );

    res.json({
        message: "Todo deleted successfully",
        id: id
    })
});

app.put("/todos",authenticateToken, async (req,res)=>{
    const userName=req.username;
    const id=Number(req.body.id);
    const newTodo=req.body.todo;
    const data=await fs.readFile("./data/todo.json", "utf8");
    const todoObj = JSON.parse(data);
    const todos=todoObj[userName];
    const todo= todos.find(todo => todo.id === id); 

    if (!todo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    if(todo){
        todo.todo=newTodo;
        await fs.writeFile(
            "./data/todo.json",
            JSON.stringify(todoObj)
        );
        res.json({
            message: "Todo updated successfully",
            todo: todo
        });
    }
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

    const todoData = await fs.readFile("./data/todo.json", "utf8");
    const todoObj = JSON.parse(todoData);
    todoObj[username] = [];
    await fs.writeFile("./data/todo.json", JSON.stringify(todoObj));


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
    }, "harshit123");

    res.json({
        token: token
    })


})




app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
















