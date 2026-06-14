

window.onload =async function () {
    const data= await axios.get("/todos",{
        headers: {
            token: localStorage.getItem("token")
        }
    });
    const todos=data.data.todos;

    todos.forEach(todo => {
        const todoItem= document.createElement("div");
        todoItem.id = "todo-" + todo.id;
        todoItem.appendChild(document.createTextNode(todo.id + ". " + todo.todo));
        document.getElementById("todo-list").appendChild(todoItem);
    });
       
};

function showInputs(type) {
    const old = document.getElementById("input-box");
    if (old) old.remove();

    const box = document.createElement("div");
    box.id = "input-box";

    box.style.marginTop = "24px";
    box.style.padding = "22px";
    box.style.border = "1px solid #333";
    box.style.borderRadius = "8px";
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.gap = "14px";
    box.style.width = "320px";
    box.style.background = "#1b1b1b";
    box.style.boxShadow = "0 8px 22px rgba(0, 0, 0, 0.28)";

    let idInput = null;
    let todoInput = null;

    if (type === "update" || type === "delete") {
        idInput = document.createElement("input");
        idInput.type = "number";
        idInput.placeholder = "Enter Todo ID";
        idInput.id = "todo-id";
        box.appendChild(idInput);
    }

    if (type === "create" || type === "update") {
        todoInput = document.createElement("input");
        todoInput.type = "text";
        todoInput.placeholder = "Enter Todo";
        todoInput.id = "todo-text";
        todoInput.style.padding = "14px";
        todoInput.style.fontSize = "16px";
        todoInput.style.border = "1px solid #444";
        todoInput.style.borderRadius = "8px";
        todoInput.style.background = "#242424";
        todoInput.style.color = "#f2f2f2";
        box.appendChild(todoInput);
    }

    const submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.style.width = "100%";
    submit.style.padding = "12px";
    submit.style.background = "#4f6f52";
    submit.style.borderRadius = "8px";

    const cancel = document.createElement("button");
    cancel.innerText = "Cancel";
    cancel.style.width = "100%";
    cancel.style.padding = "12px";
    cancel.style.background = "#3a3a3a";
    cancel.style.borderRadius = "8px";

    submit.onclick = () => {
        if (type === "create") {
            createTodo(todoInput.value);
        }
        else if (type === "update") {
            updateTodo(idInput.value, todoInput.value);
        }
        else {
            deleteTodo(idInput.value);
        }

        box.remove();
    };

    cancel.onclick = () => {
        box.remove();
    };

    box.appendChild(submit);
    box.appendChild(cancel);

    document.querySelector(".right").appendChild(box);
}

async function createTodo(todo) {
    const response = await axios.post(
        "/todos",
        {
            todo: todo
        },
        {
            headers: {
                token: localStorage.getItem("token")
            }
        }
    );

    if (response.status === 200) {
        const createdTodo = response.data.todo;
        const todoItem= document.createElement("div");
        todoItem.id = "todo-" + createdTodo.id;
        todoItem.appendChild(document.createTextNode(createdTodo.id + ". " + createdTodo.todo));
        document.getElementById("todo-list").appendChild(todoItem);
    }
}

async function deleteTodo(id) {
    const response = await axios.delete(
        "/todos",
        {
            headers: {
                token: localStorage.getItem("token")
            },
            data: {
                id: Number(id)
            }
        }
    );

    if (response.status === 200) {
        document.getElementById("todo-" + id).remove();
    }
}

async function updateTodo(id, todo) {
    const response = await axios.put(
        "/todos",
        {
            id: Number(id),
            todo: todo
        },
        {
            headers: {
                token: localStorage.getItem("token")
            }
        }
    );

    if (response.status === 200) {
        const todoItem = document.getElementById("todo-" + id);
        todoItem.textContent = id + ". " + todo;
    }
}

