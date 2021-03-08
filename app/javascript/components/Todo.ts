export type Todos = {
  todos: Todo[];
};
export type Todo = {
  id: number;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  is_completed: boolean;
};
