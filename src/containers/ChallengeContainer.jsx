import {useEffect, useState} from "react";
import ChallengeRecord from "../components/ChallengeRecord";
import axios from "axios";
import CustomLineChart from "../components/CustomLineChart";
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const labels = {
    pushUp2min: "Max push-ups in 2 minutes",
    pullUp2min: "Max pull-ups in 2 minutes",
    sitUp2min: "Max sit-ups in 2 minutes"
}

export default function ChallengeContainer(props) {

    const api_url = process.env.REACT_APP_API_URL + "record"
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + props.accessToken,
    }

    const validationSchema = Yup.object().shape({
        reps: Yup.number()
            .required('Reps are required')
            .positive('Insert valid amount of reps'),
        date: Yup.date()
            .required('Date is required')

    });

    const formOptions = {resolver: yupResolver(validationSchema)};
    const {register, handleSubmit, reset, formState: {errors}} = useForm(formOptions)
    const [records, setRecords] = useState([])

    useEffect(() => {
        reset()
        const loadRecords = async () => {
            const response = await axios.get(api_url, {
                params: {
                    challengeKey: props.challengeKey,
                }, headers: headers
            }).catch(err => {
                console.error("Unknown error", err)
            })
            setRecords(response.data)
        }
        loadRecords().then()
    }, [api_url, props.challengeKey, props.accessToken, reset])

    const recordPresent = date => {
        let rec = records && records.filter(r => r.date === new Date(date).toISOString())
        return rec.length > 0
    }

    const onSubmit = async data => {
        const date = new Date(Date.UTC(data.date.getFullYear(), data.date.getMonth(), data.date.getDate()))
        if (recordPresent(data.date)) {
            window.alert("Record for this date already submitted")
        } else {
            await axios.put(api_url, {
                reps: data.reps,
                date: date.toISOString(),
                challengeKey: props.challengeKey,
            }, {
                headers: headers
            }).then((res) => {
                if (res.status === 200) {
                    let previousRecords = records
                    previousRecords.push(res.data)
                    previousRecords.sort((a, b) => new Date(a.date) < new Date(b.date) ? -1 : 1);
                    setRecords(previousRecords)
                }
            }).catch(err => {
                console.error("Unexpected error when saving record - %s", err)
            })
        }
        reset()
    }

    const onRecordRemove = (event, id) => {
        event.preventDefault()
        axios.delete(api_url, {
            headers: headers, params: {
                id: id,
            }
        }).then().catch(err => console.log(err));
        setRecords(records.filter(item => item["_id"] !== id))
    }

    function renderRecords() {
        return records && records.map(item => <ChallengeRecord key={item["_id"]} data={item}
                                                               onClick={e => onRecordRemove(e, item["_id"])}/>)
    }

    return (
        <div className={"challenge-container"}>
            <h3>Records for "{labels[props.challengeKey]}" challenge</h3>
            <form className={"add-record-form"} noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className={"input-wrapper"}>
                    <label className={"input-label"} htmlFor={"reps"}>Reps</label>
                    <input className={`form-input ${errors.reps ? 'invalid' : ''}`}
                           id={"reps"} type="number" {...register("reps")}/>
                    <div className={"validation"}>{errors.reps?.message}</div>
                </div>
                <div className={"input-wrapper"}>
                    <label className={"input-label"} htmlFor={"date"}>Date</label>
                    <input className={`form-input ${errors.date ? 'invalid' : ''}`}
                           id={"date"} type="date" {...register("date")}/>
                    <div className={"validation"}>{errors.date?.message}</div>
                </div>
                <button className={"add-record-btn"} type={"submit"}>Add record</button>
            </form>
            <div className={"records-wrapper"}>
                {renderRecords()}
            </div>
            <CustomLineChart key={Math.random().toString().substring(10, 15)} data={records}
                             labels={[{label: "reps", color: "#1bbce0"}]}/>
        </div>
    )

}