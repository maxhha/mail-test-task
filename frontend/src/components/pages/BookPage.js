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
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { CreateRecordButton } from "components/CreateRecordButton";
import { CreateBookButton } from "components/CreateBookButton";
import { CreateShortLinkButton } from "components/CreateShortLinkButton";
import LinearProgress from "@mui/material/LinearProgress";

function BookPageInner() {
  const { loading, records, loadMore, hasMore, create, book } =
    useContext(BookStorageContext);

  const createRecordDisabled = loading;
  const copyLinkDisabled = loading;
  const loadMoreDisabled = loading;

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container>
      <Box>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <CreateRecordButton disabled={createRecordDisabled} create={create} />
          {book.is_owner && (
            <CreateShortLinkButton
              disabled={copyLinkDisabled}
              bookId={book.id}
            />
          )}
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

  return (
    <BookStorageContextProvider value={{ bookId: id }}>
      <BookPageInner />
    </BookStorageContextProvider>
  );
}
