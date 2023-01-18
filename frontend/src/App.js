import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots";
import CreateSpot from './components/CreateSpot'
import HeaderBar from './components/HeaderBar';
import "./index.css"
import SpotDetails from "./components/SpotDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <HeaderBar />
      {/* <Navigation isLoaded={isLoaded} /> */}
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route exact path="/spot/:id">
            <SpotDetails />
          </Route>
          <Route path="/spot/new">
            <CreateSpot />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
