import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import styled from "styled-components";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { Todo } from "./Todo";

const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`;

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`;

const TodoName = styled.span`
  font-size: 27px;
  ${({ is_completed }) =>
    is_completed &&
    `
  opacity: 0.4;
  `}
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size: 25px;
`;

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`;
const UncheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`;

const EditButton = styled.span`
  display: flex;
  float: left;
  align-items: center;
  margin: 0 7px;
`;

interface ErrorResponse {
  error: string;
}
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  useEffect(() => {
    axios
      .get<Todo[]>("/api/v1/todos.json")
      .then((res) => {
        console.log(res.data);
        setTodos(res.data);
      })
      .catch((e: AxiosError<ErrorResponse>) => {
        console.log(e);
      });
  }, []);

  const removeAllTodos = () => {
    const sure = window.confirm("Are you sure?");
    if (sure) {
      axios
        .delete("/api/v1/todos/destroy_all")
        .then((res) => {
          setTodos([]);
        })
        .catch((e: AxiosError<ErrorResponse>) => {
          console.log(e);
        });
    }
  };
  const updateIsCompleted = (index: number, val: Todo): void => {
    var data: Todo = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed,
    };
    axios.patch(`/api/v1/todos/${val.id}`, data).then((res) => {
      const newTodos: Todo[] = [...todos];
      newTodos[index].is_completed = res.data.is_completed;
      setTodos(newTodos);
    });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };
  return (
    <div>
      <h1>Todo List</h1>
      <SearchAndButton>
        <SearchForm
          type="text"
          placeholder="Search todo..."
          onChange={handleChange}
        />
        <RemoveAllButton onClick={removeAllTodos}>Remove All</RemoveAllButton>
      </SearchAndButton>
      <div>
        {todos
          .filter((val) => {
            if (searchName === "") {
              return val;
            } else if (
              val.name.toLowerCase().includes(searchName.toLowerCase())
            ) {
              return val;
            }
          })
          .map((val, key) => {
            return (
              <Row key={key}>
                {val.is_completed ? (
                  <CheckedBox>
                    <ImCheckboxChecked
                      onClick={() => updateIsCompleted(key, val)}
                    />
                  </CheckedBox>
                ) : (
                  <UncheckedBox>
                    <ImCheckboxUnchecked
                      onClick={() => updateIsCompleted(key, val)}
                    />
                  </UncheckedBox>
                )}
                <TodoName is_completed={val.is_completed}>{val.name}</TodoName>

                <Link to={val.id + "/edit"}>
                  <EditButton>
                    <AiFillEdit style={{ margin: "20px" }} />
                  </EditButton>
                </Link>
              </Row>
            );
          })}
      </div>
    </div>
  );
}

export default TodoList;
