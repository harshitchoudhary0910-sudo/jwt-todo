
window.onload = async function () {
    await fetchTodos();
};

async function fetchTodos() {
    try {
        const data = await axios.get("/todos");
        const todos = data.data.todos;
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        todos.forEach(todo => {
            const todoCard = document.createElement("div");
            todoCard.className = "todo-card";
            todoCard.id = "todo-" + todo._id;

            const todoHeader = document.createElement("div");
            todoHeader.className = "todo-header";
            todoHeader.innerHTML = `<span>${escapeHtml(todo.title)}</span> <span>&#9662;</span>`;
            todoHeader.onclick = () => {
                const content = todoCard.querySelector(".todo-content");
                if (content.style.display === "block") {
                    content.style.display = "none";
                    todoHeader.querySelector("span:last-child").innerHTML = "&#9662;";
                } else {
                    content.style.display = "block";
                    todoHeader.querySelector("span:last-child").innerHTML = "&#9660;";
                }
            };

            const todoContent = document.createElement("div");
            todoContent.className = "todo-content";

            const todoDesc = document.createElement("div");
            todoDesc.className = "todo-description";
            todoDesc.innerText = todo.description || "No description";

            const todoActions = document.createElement("div");
            todoActions.className = "todo-actions";

            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.onclick = () => {
                showInputs("update", { id: todo._id, title: todo.title, description: todo.description });
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Completed";
            deleteBtn.style.background = "#8b2635";
            deleteBtn.onclick = () => {
                deleteTodo(todo._id);
            };

            todoActions.appendChild(editBtn);
            todoActions.appendChild(deleteBtn);

            todoContent.appendChild(todoDesc);
            todoContent.appendChild(todoActions);

            todoCard.appendChild(todoHeader);
            todoCard.appendChild(todoContent);

            todoList.appendChild(todoCard);
        });
    } catch (err) {
        console.error("Error loading todos:", err);
    }
}

function showInputs(type, todoData) {
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

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Enter Title";
    titleInput.id = "todo-title";
    titleInput.style.padding = "14px";
    titleInput.style.fontSize = "16px";
    titleInput.style.border = "1px solid #444";
    titleInput.style.borderRadius = "8px";
    titleInput.style.background = "#242424";
    titleInput.style.color = "#f2f2f2";
    if (type === "update") {
        titleInput.value = todoData.title;
    }
    box.appendChild(titleInput);

    const descInput = document.createElement("textarea");
    descInput.placeholder = "Enter Description";
    descInput.id = "todo-desc";
    descInput.style.padding = "14px";
    descInput.style.fontSize = "16px";
    descInput.style.border = "1px solid #444";
    descInput.style.borderRadius = "8px";
    descInput.style.background = "#242424";
    descInput.style.color = "#f2f2f2";
    descInput.style.resize = "vertical";
    descInput.style.minHeight = "80px";
    if (type === "update") {
        descInput.value = todoData.description;
    }
    box.appendChild(descInput);

    const submit = document.createElement("button");
    submit.innerText = type === "create" ? "Create" : "Update";
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

    submit.onclick = async () => {
        if (type === "create") {
            await createTodo(titleInput.value, descInput.value);
        }
        else if (type === "update") {
            await updateTodo(todoData.id, titleInput.value, descInput.value);
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

async function createTodo(title, description) {
    try {
        const response = await axios.post(
            "/todos",
            {
                title: title,
                description: description
            }
        );

        if (response.status === 200) {
            await fetchTodos();
        }
    } catch (err) {
        console.error("Error creating todo:", err);
    }
}

async function deleteTodo(id) {
    try {
        const response = await axios.delete(`/todos/${id}`);

        if (response.status === 200) {
            await fetchTodos();
        }
    } catch (err) {
        console.error("Error deleting todo:", err);
    }
}

async function updateTodo(id, title, description) {
    try {
        const response = await axios.put(
            `/todos/${id}`,
            {
                title: title,
                description: description
            }
        );

        if (response.status === 200) {
            await fetchTodos();
        }
    } catch (err) {
        console.error("Error updating todo:", err);
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
