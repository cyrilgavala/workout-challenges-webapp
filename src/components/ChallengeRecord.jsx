export default function ChallengeRecord(props) {

    return (
        <div className={"record-card"}>
            <button className={"remove-record-btn"} onClick={props.onClick}>
                <span id={new Date(props.data.date).toISOString().slice(0, 10)}>X</span>
            </button>
            <div className={"record-card-header"}>{new Date(props.data.date).toISOString().slice(0, 10)}</div>
            <div className={"record-card-body"}>{props.data.reps} reps</div>
        </div>
    )
}