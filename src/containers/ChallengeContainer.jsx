import {useState} from "react";
import ChallengeRecordsContainer from "./ChallengeRecordsContainer";
import axios from "axios";
import {read_cookie} from "sfcookies";
import {DropdownButton, Dropdown} from "react-bootstrap";

const api_url = "https://workout-challenges-api.herokuapp.com/";

export default function ChallengeContainer() {

  const [records, setRecords] = useState(<div/>)

  function loadPreviousRecords(key) {
    axios.get(api_url + "record/records", {
      params: {
        challengeKey: key,
        user: read_cookie("username")
      }, headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((res) => {
      setRecords(<ChallengeRecordsContainer key={key} challengeKey={key} data={res.data}/>)
    }).catch(err => {
      console.error("Unknown error", err)
    })
  }

  function onClick(event) {
    loadPreviousRecords(event)
  }

  return (
    <div id={"challenges-container"}>
      <div id={"navbar"}>
        <DropdownButton key={"right"} id={`dropdown-challenges`} drop={"right"} variant="dark"
                        title={"Select a challenge"} onSelect={e => onClick(e)}>
          <Dropdown.Item eventKey="pullUp2min">Max pull-ups in 2 minutes</Dropdown.Item>
          <Dropdown.Item eventKey="pushUp2min">Max push-ups in 2 minutes</Dropdown.Item>
          <Dropdown.Item eventKey="sitUp2min">Max sit-ups in 2 minutes</Dropdown.Item>
        </DropdownButton>
      </div>
      {records}
    </div>
  )
}