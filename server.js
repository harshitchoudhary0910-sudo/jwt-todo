require("dotenv").config();
const express = require('express');
const fs = require('fs/promises');
const app = express();
const path = require('path');
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const {userModel,todoModel}=require("./models");
const connectDB = require("./db");

connectDB();


app.use(cookieParser());
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
    const userId=req.userId;
    const todos=await todoModel.find({ userId });
    return res.json({
        todos:todos
    })
   
})

app.post("/todos", authenticateToken, async (req, res) => {
    const userId=req.userId;
    const title=req.body.title;
    const description=req.body.description;

    const newTodo=await todoModel.create({
        title:title,
        description:description,
        userId:userId

    });


res.json({
    message: "Todo added successfully",
    todoId: newTodo._id
});
    

});


app.delete("/todos/:id", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;

    const deletedTodo = await todoModel.findOneAndDelete({
        _id: todoId,
        userId: userId
    });// mongoose automatically casts the string id to ObjectId

    if (!deletedTodo) {
        return res.status(404).json({
            message: "Todo not found"
        });
    }

    res.json({
        message: "Todo deleted successfully"
    });
});

app.put("/todos/:id", authenticateToken, async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.id;
    const newTitle=req.body.title;
    const newDescription=req.body.description;

    const todo = await todoModel.findByIdAndUpdate(
        todoId,
        { title: newTitle, description: newDescription },
       
    );



    res.json({
        message: "Todo updated successfully",
        
    });





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

    const isExisting= await userModel.findOne({
        username,
        password
    });


    if (isExisting) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser=await userModel.create({
        username:username,
        password:password
    });

    res.status(201).json({ message: "User created successfully" });

});

app.post("/signin", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const check = await userModel.findOne({
        username: username,
        password: password
    });

    if (!check) {

        return res.status(400).json({ message: "User does not exist" });

    }
    // json web tokens
    const token = jwt.sign({
        userId: check._id
    },process.env.JWT_SECRET,{
        expiresIn:"1h"
    });

    res.cookie("token", token);
    
    res.json({
        // token: token,
        message: "User signed in successfully"
        
    })


});




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})
















