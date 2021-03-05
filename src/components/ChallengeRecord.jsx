import {Toast} from "react-bootstrap";
import dateFormat from 'dateformat';

export default function ChallengeRecord(props) {

  return (
  <Toast className={"record-card"} bg={"dark"} onClose={props.onClick}>
    <Toast.Header>{dateFormat(new Date(props.data.date), "yyyy-mm-dd")}</Toast.Header>
    <Toast.Body>{props.data.reps} reps</Toast.Body>
  </Toast>
  )
}