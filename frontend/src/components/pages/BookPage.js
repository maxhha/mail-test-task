// @ts-ignore
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { Record } from "components/Record";
// @ts-ignore
import {
  BookStorageContext,
  BookStorageContextProvider,
} from "contexts/BookStorage";
import { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateRecordButton } from "components/CreateRecordButton";
import { CreateBookButton } from "components/CreateBookButton";
import { CreateShortLinkButton } from "components/CreateShortLinkButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { ErrorContext } from "contexts/error";

function BookPageInner() {
  const {
    loading,
    records,
    loadMore,
    hasMore,
    create,
    book: { id: bookId },
  } = useContext(BookStorageContext);

  const createRecordDisabled = loading;
  const copyLinkDisabled = loading;
  const loadMoreDisabled = loading;

  return (
    <Container>
      <Box>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <CreateRecordButton disabled={createRecordDisabled} create={create} />
          <CreateShortLinkButton disabled={copyLinkDisabled} bookId={bookId} />
          <CreateBookButton />
        </Stack>
      </Box>
      <Box mt={4}>
        <Grid container spacing={3}>
          {records.map((record) => (
            <Grid item xs={12} sm={6} md={4} key={record.id}>
              <Record record={record} />
            </Grid>
          ))}
        </Grid>
      </Box>
      {hasMore && (
        <Box mt={4} mb={10}>
          <Button
            variant="outlined"
            disabled={loadMoreDisabled}
            onClick={loadMore}
          >
            Показать больше
          </Button>
        </Box>
      )}
    </Container>
  );
}

export function BookPage() {
  // @ts-ignore
  const { id } = useParams();
  const [state, setState] = useState({
    error: null,
    snackbarOpen: false,
  });

  const handleError = useCallback((error) => {
    setState({ error, snackbarOpen: true });
  }, []);

  return (
    <>
      <ErrorContext.Provider value={{ onError: handleError }}>
        <BookStorageContextProvider value={{ bookId: id }}>
          <BookPageInner />
        </BookStorageContextProvider>
      </ErrorContext.Provider>
      <Snackbar
        open={state.snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setState({ ...state, snackbarOpen: false })}
      >
        <Alert
          onClose={() => setState({ ...state, snackbarOpen: false })}
          severity="error"
          sx={{ width: "100%" }}
        >
          {state.error?.response?.data || state.error?.message}
        </Alert>
      </Snackbar>
    </>
  );
}
