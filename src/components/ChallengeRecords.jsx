import React from "react";
import {Button, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {read_cookie} from "sfcookies";
import ChallengeRecord from "./ChallengeRecord";
import axios from "axios";
import CustomLineChart from "./CustomLineChart";
import {v4 as uuidv4} from 'uuid';

const api_url = "https://workout-challenges-api.herokuapp.com/";
const labels = {
  pushUp2min: "Max push-ups in 2 minutes",
  pullUp2min: "Max pull-ups in 2 minutes",
  sitUp2min: "Max sit-ups in 2 minutes"
}

export default class ChallengeRecords extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      reps: 0,
      date: new Date(),
      records: props.data,
      chartKey: uuidv4(),
      visible: true
    }
  }

  onDateChange(event) {
    this.setState({date: event})
  }

  onRepsChange(event) {
    event.preventDefault()
    this.setState({reps: event.target.value})
  }

  recordPresent(date) {
    let rec = this.state.records.filter(r => r.date === new Date(date).toISOString())
    console.log(rec)
    return rec.length > 0
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else if (this.recordPresent(event.target[1].value)) {
      form.reset()
      event.stopPropagation()
      window.alert("Record for this date already submitted")
    } else {
      form.reset()
      let previousRecords = this.state.records
      let record = {
        reps: event.target[0].value,
        date: event.target[1].value,
        challengeKey: this.props.challengeKey,
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
      previousRecords.sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? -1 : 1;
      });
      this.setState({validated: true, date: new Date(), reps: 0, records: previousRecords, chartKey: uuidv4()})
    }
  }

  onRecordRemove(event) {
    event.preventDefault();
    const current = new Date(event.target.parentElement.parentElement.textContent.substring(0, 10)).toISOString();
    axios.delete(api_url + "record/delete-record", {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }, data: {
        user: read_cookie("username"),
        challengeKey: this.props.challengeKey,
        date: current
      }
    }).then().catch(err => console.log(err));
    let indexToRemove = 0
    for (let i = 0; i < this.state.records.length; i++) {
      if (this.state.records[i].date === current) {
        indexToRemove = i;
        break;
      }
    }
    this.state.records.splice(indexToRemove, 1);
    this.state.records.sort((a, b) => {
      return new Date(a.date) > new Date(b.date) ? -1 : 1;
    });
    this.setState({records: this.state.records, chartKey: uuidv4()})
  }

  renderRecords() {
    if (this.state.records === undefined || this.state.records.length === 0) {
      return <div/>
    } else {
      let recordItems = [];
      for (let i = 0; i < this.state.records.length; i++) {
        recordItems.push(<ChallengeRecord key={this.props.challengeKey + i} data={this.state.records[i]}
                                          onClick={e => this.onRecordRemove(e)}/>)
      }
      return recordItems
    }
  }

  render() {
    return (
      <div id={"challenge-records-container"}>
        <h3>Records for "{labels[this.props.challengeKey]}" challenge</h3>
        <div id={"add-record-wrapper"}>
          <Form id={"addRecordForm"} noValidate validated={this.state.validated} onSubmit={e => this.handleSubmit(e)}
                onChange={e => e.currentTarget.checkValidity()}>
            <Form.Control required type="number" placeholder="Enter number of reps" value={this.state.reps}
                          onChange={reps => this.onRepsChange(reps)}/>
            <DatePicker selected={this.state.date} dateFormat={"yyyy-MM-dd"}
                        onChange={date => this.onDateChange(date)}/>
            <Button id={"add-record-btn"} type={"submit"} size={"sm"} variant={"outline-light"}>
              Add record
            </Button>
          </Form>
        </div>
        <div id={"challenges-records"}>
          {this.renderRecords()}
        </div>
        <h3 className={"chart-title"}>Challenge progress</h3>
        <CustomLineChart key={this.state.chartKey} data={this.reorder(this.state.records)}
                         labels={[{label: "reps", color: "orange"}]}/>
      </div>
    )
  }

  reorder(records) {
    return records.sort((a, b) => {
      return new Date(a.date) < new Date(b.date) ? -1 : 1;
    });
  }
}