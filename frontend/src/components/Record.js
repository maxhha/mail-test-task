import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import styled from "@emotion/styled";

const RecordCard = styled(Card)`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

// @ts-ignore
export function Record({ record }) {
  const opacity = record.done ? 0.4 : 1;

  return (
    <RecordCard>
      {record.image && (
        <CardMedia
          sx={{ opacity }}
          component="img"
          height="140"
          image={record.image}
          loading="lazy"
        />
      )}
      <CardContent sx={{ opacity, flex: 1 }}>
        <Typography>{record.descripton}</Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(record.created_at).toLocaleString()}
        </Typography>
        <Box mt={1}></Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        {record.done ? (
          <Button size="small" color="error" variant="outlined">
            Вернуть
          </Button>
        ) : (
          <Button size="small" color="success" variant="contained">
            Завершено
          </Button>
        )}

        <Chip
          icon={<LocalFireDepartmentIcon />}
          label={new Date(record.deadline_at).toLocaleString()}
          color={record.done ? "default" : "error"}
          variant="outlined"
          sx={{ opacity }}
        />
      </CardActions>
    </RecordCard>
  );
}
