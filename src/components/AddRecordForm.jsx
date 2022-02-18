import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import recordService from "../service/recordService"

export default function AddRecordForm(props) {

    const validationSchema = Yup.object().shape({
        reps: Yup.number()
            .required('Reps are required')
            .positive('Insert valid amount of reps'),
        date: Yup.date()
            .required('Date is required')

    });

    const formOptions = {resolver: yupResolver(validationSchema)};
    const {register, handleSubmit, reset, formState: {errors}} = useForm(formOptions)

    const onSubmit = data => {
        recordService.addRecord(data, props.challengeKey, props.accessToken)
            .then(() => console.log("Record added successfully"))
            .catch(() => console.error("Adding of record failed"))
        props.callback()
        reset()
    }

    return <form className={"add-record-form"} noValidate onSubmit={handleSubmit(onSubmit)}>
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
}