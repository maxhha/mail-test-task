import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { APIContext } from "contexts/api";
import { ErrorContext } from "contexts/error";

export function CreateShortLinkButton({ disabled, bookId }) {
  const { api } = useContext(APIContext);
  const { onError } = useContext(ErrorContext);
  const [state, setState] = useState({
    open: false,
    link: "",
    loading: false,
    copySnackbarOpen: false,
  });

  const handleClose = () => setState({ ...state, open: false });
  const handleCreate = () => {
    setState({ ...state, loading: true });
    api.post(`books/${bookId}/share`).then(
      ({ data }) => {
        setState((state) => ({
          ...state,
          open: true,
          link: data.link,
          loading: false,
        }));
      },
      (error) => {
        setState((state) => ({
          ...state,
          loading: false,
        }));
        onError(error);
      }
    );
  };

  const handleCopyClipboard = () => {
    const data = [
      new window.ClipboardItem({
        "text/plain": new Blob([state.link], { type: "text/plain" }),
      }),
    ];
    navigator.clipboard.write(data).then(() => {
      setState((state) => ({
        ...state,
        copySnackbarOpen: true,
      }));
    }, onError);
  };

  const buttonDisabled = disabled || state.loading;

  return (
    <>
      <Button
        variant="outlined"
        disabled={buttonDisabled}
        onClick={handleCreate}
      >
        Скопировать ссылку на книгу
      </Button>
      <Dialog
        open={state.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Одноразовая ссылка на книгу
        </DialogTitle>
        <DialogContent>
          <code style={{ fontSize: 24 }}>{state.link}</code>

          <Button
            sx={{ marginTop: 4 }}
            onClick={handleCopyClipboard}
            variant="outlined"
          >
            Скопировать
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={state.copySnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setState({ ...state, copySnackbarOpen: false })}
      >
        <Alert
          onClose={() => setState({ ...state, copySnackbarOpen: false })}
          severity="success"
          sx={{ width: "100%" }}
        >
          Скопировано
        </Alert>
      </Snackbar>
    </>
  );
}
