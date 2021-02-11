import {Card} from "react-bootstrap";

export default function ChallengeRecord(props) {

  return (
    <Card className={"record-card"} bg={"dark"}>
      <Card.Body>
        <Card.Title>{new Date(props.data.date).toLocaleDateString()}</Card.Title>
        <Card.Text>
          {props.data.reps} reps
        </Card.Text>
      </Card.Body>
    </Card>
  )
}