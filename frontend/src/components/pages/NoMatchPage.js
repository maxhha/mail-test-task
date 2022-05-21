import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export function NoMatchPage() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Typography variant="h1" gutterBottom component="div">
        404
      </Typography>
      <Typography variant="h2" gutterBottom component="div">
        Это приватный сервис записной книги.
      </Typography>
      <Typography gutterBottom component="div">
        Спросить доступ можно у{" "}
        <a href="https://t.me/max_hha" target="_blank">
          max_hha
        </a>
      </Typography>
    </Grid>
  );
}
