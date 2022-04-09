import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function LoginForm(props) {
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .required('Password is required')

    });

    const formOptions = {resolver: yupResolver(validationSchema)};
    const {register, handleSubmit, reset, formState: {errors}} = useForm(formOptions)

    const onSubmit = async data => {
        props.login(data)
        reset()
    }

    return (
        <form id={"login-form"} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={"input-wrapper"}>
                <label className={"input-label"} htmlFor={"log-username"}>Username</label>
                <input className={`form-input ${errors.username ? 'invalid' : ''}`} disabled={props.loading}
                       id={"log-username"} type="text" {...register("username")}/>
                <div className={"validation"}>{errors.username?.message}</div>
            </div>
            <div className={"input-wrapper"}>
                <label className={"input-label"} htmlFor={"log-password"}>Password</label>
                <input className={`form-input ${errors.password ? 'invalid' : ''}`} disabled={props.loading}
                       id={"log-password"} type="password" {...register("password")}/>
                <div className={"validation"}>{errors.password?.message}</div>
            </div>
            <button id={"login-btn"} disabled={props.loading} type="submit">
                <span>{props.loading ? "Logging in..." : "Log in"}</span>
            </button>
        </form>
    )
}