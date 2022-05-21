import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import { ErrorContext } from "contexts/error";

export function CreateRecordButton({ disabled, create }) {
  const { onError } = useContext(ErrorContext);
  const [state, setState] = useState({
    createDialogOpen: false,
    loading: false,
  });

  const openCreateDialog = () => setState({ ...state, createDialogOpen: true });
  const closeCreateDialog = (event) => {
    event.preventDefault();
    setState({ ...state, createDialogOpen: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (state.loading) {
      return;
    }
    setState((state) => ({ ...state, loading: true }));
    create(new FormData(event.target)).then(
      () => {
        setState((state) => ({
          ...state,
          createDialogOpen: false,
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

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled}
        onClick={openCreateDialog}
      >
        Добавить запись
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={state.createDialogOpen}
        onClose={closeCreateDialog}
      >
        <DialogTitle>Создать запись</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <TextField
                  required
                  label="Описание"
                  name="descripton"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid sm={6} item>
                <TextField
                  required
                  label="Дедлайн"
                  type="datetime-local"
                  name="deadline_at"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid sm={6} item>
                <TextField
                  label="Картинка"
                  type="file"
                  name="image"
                  fullWidth
                  inputProps={{
                    accept: "image/*",
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" disabled={state.loading}>
              Сохранить
            </Button>
            <Button onClick={closeCreateDialog} disabled={state.loading}>
              Отменить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
