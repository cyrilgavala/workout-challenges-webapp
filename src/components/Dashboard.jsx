import {Button} from "react-bootstrap";
import React from "react";
import {useHistory} from "react-router"
import { read_cookie, delete_cookie } from 'sfcookies';

function Dashboard() {
  let history = useHistory()

  function logOut() {
    delete_cookie("username")
    history.push("/login");
  }

  return (
    <div id={"dashboard"}>
      <h4>Welcome {read_cookie("username")}</h4>
      <Button variant="outline-danger" size={"sm"} onClick={logOut}>
        Log out
      </Button>
    </div>
  )
}

export default Dashboard;