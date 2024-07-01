class View {
    constructor() {
        this.$newTodo = document.querySelector(".new-todo");
        this.$todoList = document.querySelector(".todo-list");
        this.$todoCount = document.querySelector(".count");
        this.$toggleAll = document.querySelector(".toggle-all-container");
        this.$removeBtn = document.querySelector("button.clear");
    }

    /**
     * Display todo items filtered by query.
     * @param {string} query 
     * @param {Array} todos 
     */
    showEntries(query, todos) {
        if (!todos) {
            return;
        }

        let result;
        if (query === "completed") {
            result = todos.filter((e) => e.completed);
        } else if (query === "active") {
            result = todos.filter((e) => !e.completed);
        } else {
            result = todos.filter(() => true);
        }

        let htmlView = "";
        for (const item of result) {
            htmlView += this.createHtmlItem(item);
        }
        this.$todoList.innerHTML = htmlView;
    }

    /**
     * Display the newly created item on the screen.
     * @param {object} item 
     * @returns the corresponding html component.
     */
    createHtmlItem(item) {
        const title = item.description;
        const completed = item.completed ? "completed" : "active";
        const checked = item.completed ? "checked" : "";
        return `
        <li id="item${item.id}" class="${completed}">
            <div class="item">
                <input class="toggle" type="checkbox" ${checked}>
                <label>${title}</label>
                <button class="destroy"></button>
            </div>
        </li>
        `;
    }

    /**
     * Append the new item to the beginning of the list.
     * @param {object} item 
     */
    appendNewItem(item) {
        this.$todoList.insertAdjacentHTML("afterbegin", this.createHtmlItem(item));
    }

    clearInput() {
        this.$newTodo.value = "";
    }

    /**
     * Update the count of the todo items.
     * @param {number} num 
     */
    updateCount(num) {
        const plural = num > 1 ? "s" : "";
        const countText = `${num} item${plural} left`;
        this.$todoCount.textContent = countText;
    }

    /**
     * Edit an item by appending an input component.
     * @param {number} id 
     */
    editingItem(id) {
        const item = this.$todoList.querySelector(`#item${id}`);
        if (!item) {
            return;
        }
        item.className = `${item.className} editing`;

        const editor = document.createElement("input");
        editor.className = "editor";
        item.appendChild(editor);
        editor.focus();
        editor.value = item.querySelector("label").textContent;
    }

    /**
     * Finish updating the item.
     * @param {number} id 
     * @param {string} updatedTitle 
     */
    updateItem(id, updatedTitle) {
        const updated = this.$todoList.querySelector(`#item${id}`);
        if (!updated) {
            return;
        }
        const input = updated.querySelector("input.editor");
        if (input) {
            updated.removeChild(input);
        }
        updated.className = updated.className.replace(" editing", "");
        updated.querySelector("label").textContent = updatedTitle;
    }

    /**
     * Mark a todo item as completed.
     * @param {number} id 
     */
    toggleItem(id) {
        const toggled = this.$todoList.querySelector(`#item${id}`);
        if (!toggled) {
            return;
        }
        const input = toggled.querySelector("input.toggle");
        if (toggled.className === "completed") {
            toggled.className = "active";
            input.checked = false;
        } else {
            toggled.className = "completed";
            input.checked = true;
        }
    }

    /**
     * Delete an item from the list.
     * @param {number} id 
     */
    deleteItem(id) {
        const removed = this.$todoList.querySelector(`#item${id}`);
        if (!removed) {
            return;
        }
        this.$todoList.removeChild(removed);
    }

    /**
     * Delete all completed items.
     */
    deleteCompleted() {
        const items = this.$todoList.childNodes;
        if (!items) {
            return;
        }
        for (const e of items) {
            if (e.className === "completed") {
                this.$todoList.removeChild(e);
            }
        }
    }

    clearView() {
        this.$todoList.remove();
    }

    /**
     * @param {Element} element 
     * @param {string} targetTag 
     * @returns the parent element matches a target tag;
     *          undefined if there is no such element.
     */
    getParent(element, targetTag) {
        if (!element.parentNode) {
            return undefined;
        }
        if (element.parentNode.tagName.toLowerCase() === targetTag) {
            return element.parentNode;
        }
        return this.getParent(element.parentNode, targetTag);
    }

    /**
     * @param {Element} element 
     * @returns the unique ID of the given element.
     */
    getItemID(element) {
        const li = this.getParent(element, "li");
        return parseInt(li.id.replace("item", ""));
    }

    /**
     * Bind user event with callback functions.
     * @param {Event} event 
     * @param {Function} handler 
     */
    bindCallback(event, handler) {
        switch (event) {
            case "newTodo":
                this.$newTodo.addEventListener("change", () => handler(this.$newTodo.value));
                break;
            case "itemToggle":
                this.$todoList.addEventListener("click", (e) => {
                    if (e.target.className === "toggle") {
                        handler(this.getItemID(e.target));
                    }
                });
                break;
            case "itemEdit":
                this.$todoList.addEventListener("dblclick", (e) => {
                    if (e.target.tagName.toLowerCase() === "label") {
                        handler(this.getItemID(e.target));
                    }
                });
                break;
            case "doneEdit":
                this.$todoList.addEventListener(
                    "blur",
                    (e) => {
                        if (e.target.className === "editor") {
                            handler(this.getItemID(e.target), e.target.value);
                        }
                    },
                    true
                );
                this.$todoList.addEventListener("keypress", (e) => {
                    if (e.key === "Enter") {
                        e.target.blur();
                    }
                });
                break;
            case "itemRemove":
                this.$todoList.addEventListener("click", (e) => {
                    if (e.target.className === "destroy") {
                        handler(this.getItemID(e.target));
                    }
                });
                break;
            case "removeCompleted":
                this.$removeBtn.addEventListener("click", () => handler());
                break;
            case "toggleAll":
                this.$toggleAll.addEventListener("click", () => handler());
                break;
        }
    }
}

export default View;
