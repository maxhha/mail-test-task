import Button from "@mui/material/Button";
import { APIContext } from "contexts/api";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { ErrorContext } from "contexts/error";

export function CreateBookButton() {
  const { api } = useContext(APIContext);
  const { onError } = useContext(ErrorContext);
  const [state, setState] = useState({
    disabled: false,
  });

  const history = useHistory();

  const createNewBook = () => {
    setState((state) => ({ ...state, disabled: true }));
    api.post("books/").then(
      ({ data }) => {
        setState((state) => ({ ...state, disabled: false }));
        history.push(`/books/${data.id}`);
      },
      (error) => {
        setState((state) => ({ ...state, disabled: false }));
        onError(error);
      }
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        disabled={state.disabled}
        onClick={createNewBook}
      >
        Создать новую книгу
      </Button>
    </>
  );
}
