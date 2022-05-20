import { APIContext } from "contexts/api";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

export function SharePage() {
  // @ts-ignore
  const { id } = useParams();
  const { api } = useContext(APIContext);
  const history = useHistory();
  const [state, setState] = useState({
    error: null,
  });
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
      (error) => setState({ error })
    );
  }, []);

  if (!state.error) {
    return null;
  }

  return <code>{state.error.message}</code>;
}
