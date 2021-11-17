import {useEffect, useState} from "react";
import {read_cookie} from "sfcookies";
import ChallengeRecord from "../components/ChallengeRecord";
import axios from "axios";
import CustomLineChart from "../components/CustomLineChart";
import {v4 as uuidv4} from 'uuid';


const labels = {
    pushUp2min: "Max push-ups in 2 minutes",
    pullUp2min: "Max pull-ups in 2 minutes",
    sitUp2min: "Max sit-ups in 2 minutes"
}

export default function ChallengeContainer(props) {

    const api_url = process.env.REACT_APP_API_URL

    const [reps, setReps] = useState(0)
    const [date, setDate] = useState(new Date())
    const [records, setRecords] = useState([])
    const [graphKey, setGraphKey] = useState(uuidv4())

    useEffect(() => {
        const loadRecords = async () => {
            const response = await axios.get(api_url + "record/records", {
                params: {
                    challengeKey: props.challengeKey,
                    user: read_cookie("username")
                }, headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).catch(err => {
                console.error("Unknown error", err)
            })
            setRecords(response.data)
        }
        loadRecords().then()
    }, [api_url, props.challengeKey])

    const onDateChange = (event) => {
        event.preventDefault()
        setDate(event.target.value)
    }

    const onRepsChange = (event) => {
        event.preventDefault()
        setReps(event.target.value)
    }

    const recordPresent = (date) => {
        let rec = records && records.filter(r => r.date === new Date(date).toISOString())
        return rec.length > 0
    }

    const handleSubmit = (event) => {
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
            previousRecords.sort((a, b) => new Date(a.date) < new Date(b.date) ? -1 : 1);
            setRecords(previousRecords)
            setReps(0)
            setDate(new Date())
            setGraphKey(uuidv4())
        }
    }

    const onRecordRemove = (event) => {
        event.preventDefault();
        console.log(event.target.textContent)
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
        records.sort((a, b) => new Date(a.date) < new Date(b.date) ? -1 : 1);
        setRecords(records)
        setGraphKey(uuidv4())
    }

    function renderRecords() {
        return records && records.map((item, index) => <ChallengeRecord key={props.challengeKey + index} data={item}
                                                                        onClick={e => onRecordRemove(e)}/>)
    }

    return (
        <div className={"challenge-container"}>
            <h3>Records for "{labels[props.challengeKey]}" challenge</h3>
            <form className={"add-record-form"} noValidate onSubmit={e => handleSubmit(e)}
                  onChange={e => e.currentTarget.checkValidity()}>
                <input required type="number" min={0} placeholder="Enter number of reps" value={reps}
                       onChange={reps => onRepsChange(reps)}/>
                <input value={date} type={"date"} placeholder={"Select date"} onChange={date => onDateChange(date)}/>
                <button className={"add-record-btn"} type={"submit"}>Add record</button>
            </form>
            <div className={"records-wrapper"}>
                {renderRecords()}
            </div>
            <CustomLineChart key={graphKey} data={records} labels={[{label: "reps", color: "orange"}]}/>
        </div>
    )

}