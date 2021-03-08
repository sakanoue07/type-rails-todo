import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Todo } from "./Todo";
import { useHistory } from "react-router-dom";

toast.configure();
const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
  margin: 12px 0;
`;

const CurrentStatus = styled.div`
  font-size: 19px;
  margin: 8px 0 12px 0;
  font-weight: bold;
`;

const IsCompeletedButton = styled.button`
  color: #fff;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  background: #f2a115;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const EditButton = styled.button`
  color: white;
  font-weight: 500;
  font-size: 17px;
  padding: 5px 10px;
  margin: 0 10px;
  background: #0ac620;
  border-radius: 3px;
  border: none;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  padding: 5px 10px;
  background: #f54242;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

function EditTodo(props) {
  const initialTodoState: Todo = {
    id: null,
    name: "",
    is_completed: false,
  };
  const [currentTodo, setCurrentTodo] = useState<Todo>(initialTodoState);
  const notify = () => {
    toast.success("Todo successfully updated!!!", {
      hideProgressBar: true,
    });
  };

  const getTodos = (id: number) => {
    axios
      .get(`/api/v1/todos/${id}`)
      .then((res) => setCurrentTodo(res.data))
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getTodos(props.match.params.id);
  }, [props.match.params.id]);

  const handleInptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentTodo({ ...currentTodo, [name]: value });
  };

  const updateIsCompleted = (val: Todo): void => {
    var data: Todo = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed,
    };
    axios.patch(`/api/v1/todos/${val.id}`, data).then((res) => {
      setCurrentTodo(res.data);
    });
  };

  const updateTodo = () => {
    axios
      .patch(`/api/v1/todos/${currentTodo.id}`, currentTodo)
      .then((res) => {
        notify();
        props.history.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteTodo = () => {
    const ok = window.confirm("Remove task?");
    if (ok) {
      axios
        .delete(`/api/v1/todos/${currentTodo.id}`)
        .then((res) => {
          props.history.push("/");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      <h1>Editing Todo</h1>
      <div>
        <div>
          <label htmlFor="name">Current Name</label>
          <InputName
            type="text"
            name="name"
            value={currentTodo.name}
            onChange={handleInptChange}
          />
          <div>
            <span>Current status</span>
            <CurrentStatus>
              {currentTodo.is_completed ? "Completed" : "Uncompleted"}
            </CurrentStatus>
          </div>
        </div>
        {currentTodo.is_completed ? (
          <IsCompeletedButton onClick={() => updateIsCompleted(currentTodo)}>
            Uncompleted
          </IsCompeletedButton>
        ) : (
          <IsCompeletedButton onClick={() => updateIsCompleted(currentTodo)}>
            Completed
          </IsCompeletedButton>
        )}
        <EditButton onClick={updateTodo}>Update</EditButton>
        <DeleteButton onClick={deleteTodo}>Delete</DeleteButton>
      </div>
    </div>
  );
}

export default EditTodo;
