// @ts-ignore
import { Typography } from "@mui/material";
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

// @ts-ignore
function BookPageInner() {
  const { loading, records } = useContext(BookStorageContext);
  const createRecordDisabled = loading;
  const copyLinkDisabled = loading;
  const loadMoreDisabled = loading;
  return (
    <Container>
      <Box>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <Button variant="contained" disabled={createRecordDisabled}>
            Добавить запись
          </Button>
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
            <Grid item>
              <Record record={record} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={4}>
        <Button variant="outlined" disabled={loadMoreDisabled}>
          Показать больше
        </Button>
      </Box>
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
