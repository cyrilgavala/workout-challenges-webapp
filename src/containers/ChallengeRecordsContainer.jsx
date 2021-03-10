import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {read_cookie} from "sfcookies";
import ChallengeRecord from "../components/ChallengeRecord";
import axios from "axios";
import CustomLineChart from "../components/CustomLineChart";
import {v4 as uuidv4} from 'uuid';

const api_url = "https://workout-challenges-api.herokuapp.com/";
const labels = {
  pushUp2min: "Max push-ups in 2 minutes",
  pullUp2min: "Max pull-ups in 2 minutes",
  sitUp2min: "Max sit-ups in 2 minutes"
}

export default function ChallengeRecordsContainer(props) {

  const [validated, isValidated] = useState(false)
  const [reps, setReps] = useState(0)
  const [date, setDate] = useState(new Date())
  const [records, setRecords] = useState(props.data)
  const [graphKey, setGraphKey] = useState(uuidv4())

  function onDateChange(event) {
    setDate(event)
  }

  function onRepsChange(event) {
    event.preventDefault()
    setReps(event.target.value)
  }

  function recordPresent(date) {
    let rec = records.filter(r => r.date === new Date(date).toISOString())
    return rec.length > 0
  }

  function handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else if (recordPresent(event.target[1].value)) {
      form.reset()
      event.stopPropagation()
      window.alert("Record for this date already submitted")
    } else {
      form.reset()
      isValidated(true)
      let previousRecords = records
      let record = {
        reps: parseInt(event.target[0].value),
        date: new Date(event.target[1].value).toISOString(),
        challengeKey: props.challengeKey,
        user: read_cookie("username")
      }
      previousRecords.push(record)
      axios.put(api_url + "record/add-record", record, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then((res) => {
        if (res.status === 200) {
          console.log("Record saved to the database")
        }
      }).catch(err => {
        console.error("Unexpected error when saving record - %s", err)
      })
      previousRecords.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
      setRecords(previousRecords)
      setReps(0)
      setDate(new Date())
      setGraphKey(uuidv4())
    }
  }

  function onRecordRemove(event) {
    event.preventDefault();
    console.log(event.target)
    const current = new Date(event.target.textContent.substring(0, 10)).toISOString();
    axios.delete(api_url + "record/delete-record", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }, data: {
        user: read_cookie("username"),
        challengeKey: props.challengeKey,
        date: current
      }
    }).then().catch(err => console.log(err));
    let indexToRemove = 0
    for (let i = 0; i < records.length; i++) {
      if (records[i].date === current) {
        indexToRemove = i;
        break;
      }
    }
    records.splice(indexToRemove, 1);
    records.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1);
    setRecords(records)
    setGraphKey(uuidv4())
  }

  function renderRecords() {
    if (records === undefined || records.length === 0) {
      return <div/>
    } else {
      let recordItems = [];
      for (let i = 0; i < records.length; i++) {
        recordItems.push(<ChallengeRecord key={props.challengeKey + i} data={records[i]} onClick={e => onRecordRemove(e)}/>)
      }
      return recordItems
    }
  }

  function reorder(records) {
    return records.sort((a, b) => new Date(a.date) < new Date(b.date) ? -1 : 1);
  }

  return (
    <div id={"challenge-records-container"}>
      <h3>Records for "{labels[props.challengeKey]}" challenge</h3>
      <div id={"add-record-wrapper"}>
        <Form id={"addRecordForm"} noValidate validated={validated} onSubmit={e => handleSubmit(e)}
              onChange={e => e.currentTarget.checkValidity()}>
          <Form.Control required type="number" placeholder="Enter number of reps" value={reps}
                        onChange={reps => onRepsChange(reps)}/>
          <DatePicker selected={date} dateFormat={"yyyy-MM-dd"} onChange={date => onDateChange(date)}/>
          <Button id={"add-record-btn"} type={"submit"} size={"sm"} variant={"outline-light"}>
            Add record
          </Button>
        </Form>
      </div>
      <div id={"challenges-records"}>
        {renderRecords()}
      </div>
      <h3 className={"chart-title"}>Challenge progress</h3>
      <CustomLineChart key={graphKey} data={reorder(records)} labels={[{label: "reps", color: "orange"}]}/>
    </div>
  )

}