import Controller from "./controller";
import Model from "./model";
import View from "./view";

let todo;

function startApp() {
    this.model = new Model();
    this.view = new View();
    this.control = new Controller(this.model, this.view);
}

const onLoad = () => {
    todo = new startApp();
    changePage();
}

const changePage = () => {
    todo.control.setView(document.location.hash);
}

window.addEventListener("load", onLoad);
window.addEventListener("hashchange", changePage);
