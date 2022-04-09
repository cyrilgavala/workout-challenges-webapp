import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function RegistrationForm(props) {
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Username is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password')], 'Passwords must match')

    });

    const formOptions = {resolver: yupResolver(validationSchema)};
    const {register, handleSubmit, reset, formState: {errors}} = useForm(formOptions)

    const onSubmit = async data => {
        props.register(data)
        reset()
    }

    return (
        <form id={"registration-form"} noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={"input-wrapper"}>
                <label className={"input-label"} htmlFor={"reg-username"}>Username</label>
                <input className={`form-input ${errors.username ? 'invalid' : ''}`} disabled={props.loading}
                       id={"reg-username"} type="text" {...register("username")}/>
                <div className={"validation"}>{errors.username?.message}</div>
            </div>
            <div className={"input-wrapper"}>
                <label className={"input-label"} htmlFor={"reg-password"}>Password</label>
                <input className={`form-input ${errors.password ? 'invalid' : ''}`} disabled={props.loading}
                       id={"reg-password"} type="password" {...register("password")}/>
                <div className={"validation"}>{errors.password?.message}</div>
            </div>
            <div className={"input-wrapper"}>
                <label className={"input-label"} htmlFor={"confirm-password"}>Confirm password</label>
                <input className={`form-input ${errors.confirmPassword ? 'invalid' : ''}`} disabled={props.loading}
                       id={"confirm-password"} type="password" {...register("confirmPassword")}/>
                <div className={"validation"}>{errors.confirmPassword?.message}</div>
            </div>
            <button id={"registration-btn"} disabled={props.loading} type="submit">
                <span>{props.loading ? "Loading..." : "Register"}</span>
            </button>
            <p className="input-description">
                We'll never share your personal information with anyone else.
            </p>
        </form>
    )
}