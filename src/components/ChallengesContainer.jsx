import {Tab, Tabs} from "react-bootstrap";
import {useState} from "react";
import ChallengeRecords from "./ChallengeRecords";

export default function ChallengesContainer() {
  const [key, setKey] = useState("pullUp2min");

  return (
    <div id={"challenges-container"}>
      <Tabs
        id="challenges-container-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="pullUp2min" title="Max pull-ups in 2 minutes">
          <ChallengeRecords challengeKey={"pullUp2min"}/>
        </Tab>
        <Tab eventKey="pushUp2min" title="Max push-ups in 2 minutes">
          <ChallengeRecords challengeKey={"pushUp2min"}/>
        </Tab>
        <Tab eventKey="sitUp2min" title="Max sit-ups in 2 minutes">
          <ChallengeRecords challengeKey={"sitUp2min"}/>
        </Tab>
      </Tabs>
    </div>
  )
}