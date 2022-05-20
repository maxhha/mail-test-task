import "./App.css";
import { Route, Switch } from "react-router-dom";
import { SharePage } from "components/pages/SharePage";
import { BookPage } from "components/pages/BookPage";
import { NoMatchPage } from "components/pages/NoMatchPage";

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
