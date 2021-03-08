import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiSend } from "react-icons/fi";
import styled from "styled-components";
import { Todo } from "./Todo";

toast.configure();
const InputAndButton = styled.div`
  /* ... */
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
`;

const Button = styled.button`
  font-size: 20px;
  border: none;
  border-radius: 3px;
  margin-left: 10px;
  padding: 2px 10px;
  background: #1e90ff;
  color: #fff;
  text-align: center;
  cursor: pointer;
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: default;
    `}
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`;

function AddTodo(props) {
  const initialTodoState: Todo = {
    id: null,
    name: "",
    is_completed: false,
  };
  const [todo, setTodo] = useState<Todo>(initialTodoState);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTodo({ ...todo, [name]: value });
  };
  const notify = () => {
    toast.success("Todo successfully created!!!", {
      hideProgressBar: true,
    });
  };
  const saveTodo = () => {
    var data = {
      name: todo.name,
    };
    axios
      .post("/api/v1/todos", data)
      .then((res) => {
        setTodo({
          id: res.data.id,
          name: res.data.name,
          is_completed: res.data.is_completed,
        });
        notify();
        props.history.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const history = useHistory();
  return (
    <div>
      <h1>New Todo</h1>
      <InputAndButton>
        <InputName
          type="text"
          required
          value={todo.name}
          name="name"
          onChange={handleInputChange}
        />
        <Button
          onClick={saveTodo}
          disabled={!todo.name || /^\s*$/.test(todo.name)}
        >
          <Icon>
            <FiSend />
          </Icon>
        </Button>
      </InputAndButton>
    </div>
  );
}

export default AddTodo;
