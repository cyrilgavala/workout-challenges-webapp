import React from "react";
import {Button, Form} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {read_cookie} from "sfcookies";
import ChallengeRecord from "./ChallengeRecord";
import axios from "axios";

const api_url = "https://workout-challenges-api.herokuapp.com/";

export default class ChallengeRecords extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      reps: 0,
      date: new Date(),
      records: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    await this.loadPreviousRecords()
  }

  async loadPreviousRecords() {
    await axios.get(api_url + "record/records", {
      params: {
        challengeKey: this.props.challengeKey,
        user: read_cookie("username")
      }, headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((res) => {
      this.setState({records: res.data})
    }).catch(err => {
      console.error("Unknown error", err)
    })
  }

  onDateChange(event) {
    this.setState({date: event})
  }

  onRepsChange(event) {
    event.preventDefault()
    this.setState({reps: event.target.value})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      form.reset()
      let records = this.state.records
      let record = {
        reps: event.target[0].value,
        date: event.target[1].value,
        challengeKey: this.props.challengeKey,
        user: read_cookie("username")
      }
      records.push(record)
      axios.put(api_url + "record/add-record", record, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }).then((res) => {
        if (res.status === 200) {
          console.log("Record  %s saved to the database", record)
        }
      }).catch(err => {
        console.error("Unexpected error when saving record - %s", err)
      })
      records.sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? -1 : 1;
      });
      this.setState({validated: true, date: new Date(), reps: 0, records: records})
    }
  }

  renderRecords(records) {
    let recordItems = records.length === 0 ? <div/> : [];
    for (let i = 0; i < records.length; i++) {
      recordItems.push(<ChallengeRecord key={i} data={records[i]}/>)
    }
    return recordItems
  }

  render() {
    return (
      <div id={"challenge-records-container"}>
        <div id={"add-record-wrapper"}>
          <Form id={"addRecordForm"} noValidate validated={this.state.validated} onSubmit={e => this.handleSubmit(e)}
                onChange={e => e.currentTarget.checkValidity()}>
            <Form.Group controlId="addRecord">
              <Form.Control required type="number" placeholder="Enter number of reps" value={this.state.reps}
                            onChange={reps => this.onRepsChange(reps)}/>
              <DatePicker selected={this.state.date} dateFormat={"yyyy/MM/dd"}
                          onChange={date => this.onDateChange(date)}/>
            </Form.Group>
            <Button className={"add-record-btn"} type={"submit"} size={"sm"} variant={"outline-light"}>
              Add record
            </Button>
          </Form>
        </div>
        <div id={"challenges-records"}>
          {this.renderRecords(this.state.records)}
        </div>
      </div>
    )
  }
}