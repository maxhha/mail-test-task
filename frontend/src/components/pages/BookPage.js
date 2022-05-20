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
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateRecord } from "components/CreateRecord";

// @ts-ignore
function BookPageInner() {
  const { loading, records, loadMore, hasMore } =
    useContext(BookStorageContext);
  const [state, setState] = useState({});

  const createRecordDisabled = loading;
  const copyLinkDisabled = loading;
  const loadMoreDisabled = loading;

  return (
    <Container>
      <Box>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <CreateRecord disabled={createRecordDisabled} />
          <Button variant="outlined" disabled={copyLinkDisabled}>
            Скопировать ссылку на книгу
          </Button>
          <Button variant="outlined" color="secondary">
            Создать новую книгу
          </Button>
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
