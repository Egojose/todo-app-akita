import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { Observable } from "rxjs";
import { Todo } from "../intefaces/todo";
import { TodoState, TodoStore } from "./store";


@Injectable({
    providedIn: 'root'
})
export class TodoQuery extends Query<TodoState> {
    constructor(protected todoStore: TodoStore) {
        super(todoStore);
    }

    getTodos(): Observable<Todo[]> {
        return this.select(state => state.todos);
    }

    getLoaded(): Observable<boolean> {
        return this.select(state => state.isLoaded)
    }

    getLoading(): Observable<boolean> {
        return this.selectLoading();
    }


}