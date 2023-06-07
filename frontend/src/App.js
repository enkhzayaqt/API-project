import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Spots from "./components/Spots";
import CreateSpot from './components/CreateSpot'
import HeaderBar from './components/HeaderBar';
import SpotDetails from "./components/SpotDetails";
import EditSpot from "./components/EditSpot";
import Footer from "./components/Footer"
import "./index.css"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <HeaderBar />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route exact path="/spot/new">
            <CreateSpot />
          </Route>
          <Route exact path="/spot/:spotId/edit">
            <EditSpot />
          </Route>
          <Route exact path="/spot/:id">
            <SpotDetails />
          </Route>
        </Switch>
      )}
      <Footer/>
    </>
  );
}

export default App;
