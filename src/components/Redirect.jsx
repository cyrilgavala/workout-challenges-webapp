import {useHistory} from "react-router"

export default function Redirect() {
  let history = useHistory();
  history.push("/login");
  return null
}