import {delete_cookie, read_cookie} from "sfcookies";
import {Button} from "react-bootstrap";
import {useHistory} from "react-router";

export default function DashboardHeader() {
  let history = useHistory()

  function logOut() {
    delete_cookie("username")
    history.push("/login");
  }

  return (
    <div id={"dashboard-header"}>
      <div id={"welcome"}>Welcome {read_cookie("username")}</div>
      <Button id={"logout-btn"} variant="outline-dark" size={"sm"} onClick={logOut}>
        Log out
      </Button>
    </div>
  )
}