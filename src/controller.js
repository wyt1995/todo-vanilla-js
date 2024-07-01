class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.count = 0;

        this.view.bindCallback("newTodo", (text) => this.addItem(text));
        this.view.bindCallback("itemToggle", (item) => this.completeItem(item));
        this.view.bindCallback("itemEdit", (item) => this.editItem(item));
        this.view.bindCallback("doneEdit", (item, text) => this.finishEdit(item, text));
        this.view.bindCallback("itemRemove", (item) => this.removeItem(item));
        this.view.bindCallback("removeCompleted", () => this.removeCompletedItems());
        this.view.bindCallback("toggleAll", () => this.completeAllItems());
    }

    /**
     * Set webpage view based on the URL selector.
     */
    setView(direction) {
        let page = direction.split("/")[1];
        if (page === "") {
            page = "all";
        }
        this.model.filterList(page, (query, todos) => this.view.showEntries(query, todos));
    }

    /**
     * Add item to the todo list.
     * @param {string} description as specified by the user.
     */
    addItem(description) {
        if (description.trim() === "") {
            return;
        }

        // create object for a todo item
        const newItem = {
            id: this.count++,
            description: description.trim(),
            completed: false,
        };
        this.model.create(newItem);
        this.view.clearInput();
        this.view.appendNewItem(newItem);
        this.countItems();
    }

    /**
     * Triggle the item edit mode.
     * @param {number} id the unique id of the item being edited.
     */
    editItem(id) {
        this.view.editingItem(id);
    }

    /**
     * Finish the item edit mode.
     * @param {number} id unique id
     * @param {string} updated description
     */
    finishEdit(id, updated) {
        updated = updated.trim();
        if (updated.length === 0) {
            this.removeItem(id);
        } else {
            this.model.update(id, updated);
            this.view.updateItem(id, updated);
        }
    }

    /**
     * Mark an item as completed.
     * @param {number} id
     */
    completeItem(id) {
        this.model.markCompleted(id);
        this.view.toggleItem(id);
        this.countItems();
    }

    /**
     * Mark all items as completed.
     */
    completeAllItems() {
        this.model.markAll();
        console.log(document.location.hash);
        this.setView(document.location.hash);
        this.countItems();
    }

    /**
     * Remove the given item from the list.
     * @param {number} id
     */
    removeItem(id) {
        this.model.remove(id);
        this.view.deleteItem(id);
        this.countItems();
    }

    removeCompletedItems() {
        this.model.removeCompleted();
        this.view.deleteCompleted();
    }

    deleteAllItems() {
        this.model.clear();
        this.view.clearView();
        this.count = 0;
        this.countItems();
    }

    countItems() {
        const active = this.model.getActiveCount();
        this.view.updateCount(active);
    }
}

export default Controller;
