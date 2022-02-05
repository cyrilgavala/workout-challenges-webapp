import ChallengeContainer from "./ChallengeContainer";
import {useState} from "react";

export default function Dashboard(props) {

    const keys = ["pushUp2min", "pullUp2min", "sitUp2min"]
    const [current, setCurrent] = useState(0)

    const logOut = () => {
        props.logout()
    }

    return (
        <div id={"dashboard"}>
            <div id={"dashboard-header"}>
                <div>Welcome {props.user.toUpperCase()}</div>
                <button id={"logout-btn"} onClick={logOut}><span>Log out</span></button>
            </div>
            <div id={"challenge-content"}>
                <button id={"previous-btn"} onClick={() => setCurrent((current + 1) % keys.length)}>
                    <span>&#8678;</span>
                </button>
                <ChallengeContainer challengeKey={keys[current]} user={props.user}/>
                <button id={"next-btn"} onClick={() => setCurrent((current + keys.length - 1) % keys.length)}>
                    <span>&#8680;</span>
                </button>
            </div>
        </div>
    )
}