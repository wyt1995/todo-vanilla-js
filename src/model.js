class Model {
    /**
     * The model stores an array of todo item objects.
     * The number of all items and completed items are cached.
     */
    constructor() {
        this.todos = [];
        this.size = 0;
        this.completed = 0;
    }

    getCount() {
        return this.size;
    }

    getCompletedCount() {
        return this.completed;
    }

    getActiveCount() {
        return this.size - this.completed;
    }

    /**
     * Update page by calling function in view.
     * @param {string} query
     * @param {Function} callback
     */
    filterList(query, callback) {
        callback(query, this.todos);
    }

    /**
     * Create a new item, append to the todo list.
     * @param {object} newItem
     */
    create(newItem) {
        this.todos.push(newItem);
        this.size += 1;
    }

    /**
     * Update the description of a todo item.
     * @param {number} id
     * @param {string} updatedTitle
     */
    update(id, updatedTitle) {
        const index = this.todos.findIndex((e) => e.id === id);
        this.todos[index].description = updatedTitle;
    }

    /**
     * Mark an item as copmpleted.
     * @param {number} id
     */
    markCompleted(id) {
        const item = this.todos.find((e) => e.id === id);
        if (!item) {
            return;
        }
        if (item.completed) {
            item.completed = false;
            this.completed -= 1;
        } else {
            item.completed = true;
            this.completed += 1;
        }
    }

    /**
     * Mark all items as completed.
     */
    markAll() {
        for (const e of this.todos) {
            e.completed = true;
        }
        this.completed = this.size;
    }

    /**
     * Remove a todo item as specified by its unique ID.
     * @param {number} id
     */
    remove(id) {
        const index = this.todos.findIndex((e) => e.id === id);
        const status = this.todos[index].completed;
        this.todos.splice(index, 1);

        this.size -= 1;
        if (status) {
            this.completed -= 1;
        }
    }

    /**
     * Remove all completed todo items.
     */
    removeCompleted() {
        const active = this.todos.filter((item) => !item.completed);
        this.todos = active;
        this.size = active.length;
        this.completed = 0;
    }

    /**
     * Clear the current todo list.
     */
    clear() {
        this.todos = [];
        this.size = 0;
        this.completed = 0;
    }
}

export default Model;
