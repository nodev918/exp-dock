import React from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Chat from "./components/views/chat/Chat";
import { names } from "./mock/data";
import Login from "./components/views/login/Login";
import { BrowserRouter, Switch, Route } from "react-router-dom";
export const NameContext = React.createContext();

function App() {
  return (
    <>
      <BrowserRouter>
        <NameContext.Provider value={names}>
          <Navbar />
          <Switch>
            <Route exact path="/">
              <Chat />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </NameContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
