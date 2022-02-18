import {useCallback, useEffect, useState} from "react";
import ChallengeRecord from "../components/ChallengeRecord";
import CustomLineChart from "../components/CustomLineChart";
import AddRecordForm from "../components/AddRecordForm";
import recordService from "../service/recordService";
import Modal from '@mui/material/Modal';

const labels = {
    pushUp2min: "Max push-ups in 2 minutes",
    pullUp2min: "Max pull-ups in 2 minutes",
    sitUp2min: "Max sit-ups in 2 minutes"
}

export default function ChallengeContainer(props) {

    const [openModal, setOpenModal] = useState(false)
    const [records, setRecords] = useState([])

    const loadRecords = useCallback(() => {
        recordService.getRecordsByChallengeKey(props.challengeKey, props.accessToken)
            .catch(err => {
                console.error("Unknown error", err)
            }).then(res => setRecords(res.data))
    }, [props.challengeKey, props.accessToken])

    useEffect(() => {
        loadRecords()
    }, [loadRecords])

    const onRecordRemove = (event, id) => {
        event.preventDefault()
        recordService.deleteRecord(id, props.accessToken).then(loadRecords).catch(err => console.log(err));
    }

    const renderRecords = () => {
        return records && records.map(item => <ChallengeRecord key={item["_id"]} data={item}
                                                               onClick={e => onRecordRemove(e, item["_id"])}/>)
    }

    const addRecordCallback = () => {
        loadRecords()
        setOpenModal(false)
    }

    return (
        <div className={"challenge-container"}>
            <h3>Records for "{labels[props.challengeKey]}" challenge</h3>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <AddRecordForm challengeKey={props.challengeKey} accessToken={props.accessToken}
                               callback={addRecordCallback}/>
            </Modal>
            <div id={"records-wrapper"}>
                <button id={"show-add-record-modal-btn"} onClick={() => setOpenModal(true)}>+</button>
                {renderRecords()}
            </div>
            <CustomLineChart key={Math.random().toString().substring(10, 15)} data={records}
                             labels={[{label: "reps", color: "#1bbce0"}]}/>
        </div>
    )

}