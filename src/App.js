import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Redirect from "./components/Redirect";

export default function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/register"}>
          <RegistrationForm/>
        </Route>
        <Route path={"/login"}>
          <LoginForm/>
        </Route>
        <Route path={"/dashboard"}>
          <Dashboard/>
        </Route>
        <Route path={"/"}>
          <Redirect/>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}