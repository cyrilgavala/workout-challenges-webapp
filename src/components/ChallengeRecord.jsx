export default function ChallengeRecord(props) {

  return (
      <div className={"record-card"} onClick={props.onClick}>
        <div className={"record-card-header"}>{new Date(props.data.date).toISOString().slice(0, 10)}</div>
          <div className={"record-card-body"}>{props.data.reps} reps</div>
      </div>
  )
}