import {delete_cookie, read_cookie} from "sfcookies";
import ChallengeContainer from "./ChallengeContainer";

export default function Dashboard() {

    const logOut = () => {
        delete_cookie("username")
        window.location.reload()
    }

    return (
        <div id={"dashboard"}>
            <div id={"dashboard-header"}>
                <div>Welcome {read_cookie("username").toUpperCase()}</div>
                <button id={"logout-btn"} onClick={logOut}>Log out</button>
            </div>
            <ChallengeContainer challengeKey={"pushUp2min"}/>
            <ChallengeContainer challengeKey={"pullUp2min"}/>
            <ChallengeContainer challengeKey={"sitUp2min"}/>
        </div>
    )
}