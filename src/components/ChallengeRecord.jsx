import {Card} from "react-bootstrap";
import dateFormat from 'dateformat';

export default function ChallengeRecord(props) {

  return (
  <Card className={"record-card"} bg={"dark"} onClick={props.onClick}>
    <Card.Header>{dateFormat(new Date(props.data.date), "yyyy-mm-dd")}</Card.Header>
    <Card.Body>{props.data.reps} reps</Card.Body>
  </Card>
  )
}