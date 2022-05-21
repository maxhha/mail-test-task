import { Route, Switch } from "react-router-dom";
import { SharePage } from "components/pages/SharePage";
import { BookPage } from "components/pages/BookPage";
import { NoMatchPage } from "components/pages/NoMatchPage";
import { useCallback, useState } from "react";
import { ErrorContext } from "contexts/error";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function App() {
  const [state, setState] = useState({
    error: null,
    snackbarOpen: false,
  });

  const handleError = useCallback((error) => {
    setState({ error, snackbarOpen: true });
  }, []);
  return (
    <div className="App">
      <ErrorContext.Provider value={{ onError: handleError }}>
        <Switch>
          <Route path="/share/:id">
            <SharePage />
          </Route>
          <Route path="/books/:id">
            <BookPage />
          </Route>
          <Route path="*">
            <NoMatchPage />
          </Route>
        </Switch>
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
          {state.error?.response?.data?.detail ||
            state.error?.response?.data ||
            state.error?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
