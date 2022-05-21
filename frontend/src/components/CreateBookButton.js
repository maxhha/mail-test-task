import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { APIContext } from "contexts/api";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

export function CreateBookButton() {
  const { api } = useContext(APIContext);
  const [state, setState] = useState({
    snackbarOpen: false,
    error: null,
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
        setState((state) => ({ ...state, error, disabled: false }));
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
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setState({ ...state, snackbarOpen: true })}
      >
        <Alert
          onClose={() => setState({ ...state, snackbarOpen: false })}
          severity="error"
          sx={{ width: "100%" }}
        >
          {state.error?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
