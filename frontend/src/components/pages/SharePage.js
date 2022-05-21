import LinearProgress from "@mui/material/LinearProgress";
import { APIContext } from "contexts/api";
import { ErrorContext } from "contexts/error";
import { useContext, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";

export function SharePage() {
  // @ts-ignore
  const { id } = useParams();
  const { api } = useContext(APIContext);
  const { onError } = useContext(ErrorContext);
  const history = useHistory();
  const loading = useRef(false);

  useEffect(() => {
    if (loading.current) {
      return;
    }
    loading.current = true;

    api.post(`/shortlinks/${id}/share`).then(
      ({ data }) => {
        history.replace(`/books/${data.id}`);
      },
      (error) => {
        history.replace(`/`);
        onError(error);
      }
    );
  }, []);

  return <LinearProgress />;
}
