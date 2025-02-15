import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import UserInfoPage from "./UserInfoPage";
import { isAvailableEmail } from "../api/user";

const SignupPage = () => {
    const [data, setData] = useState({});
    const [validEmail, setValidEmail] = useState(true);
    const { t } = useTranslation("global");
    const [hiddenPassword, setHideenPassword] = useState(true);
    const [confirmButton, setConfirmButton] = useState(false);
    const [nextStepSigup, setNextStepSignup] = useState(false);
    const schema = z.object({
        email: z.string().trim().email(t("login.email-err")),
        password: z.string().min(8, t("login.password-err"))
            .regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'), { message: t("login.password-err") }),
        confirm: z.string(),
    }).refine(data => data.password == data.confirm, {
        message: t("signup.same"),
        path: ['password']
    })
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    const handleNextStepSignup = async (account) => {
        const response = await isAvailableEmail(account.email);
        if (response.status != 200) {
            setValidEmail(false);
            return;
        }
        data.account = { "email": account.email, "password": account.password };
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        setValidEmail(true);
        setNextStepSignup(true);
    }
    return (
        !nextStepSigup ?
            <div className="w-full h-full flex justify-center md:items-center 2xl:px-[5%]">
                <div className="w-full max-w-[40rem] flex flex-col md:space-y-6 space-y-3 justify-start my-[5rem]">
                    <h1 className="m-auto font-bold md:text-4xl text-xl">{t("signup.title")}</h1>
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">{t("login.email")} <span className="text-[red]">*</span></p>
                        <input type="text"
                            className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                            placeholder={t("login.email-ex")}
                            {...register("email")}
                            onChange={(e) => setValue("email", e.target.value)} />
                        {errors?.email && <p className="text-[red] md:text-lg">{errors?.email.message}</p>}
                        {validEmail || <p className="text-[red] md:text-lg">{t("signup.email-not-available")}</p>}
                    </div>
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">{t("login.password")} <span className="text-[red]">*</span></p>
                        <div className="flex flex-row items-center justify-between relative">
                            <input type={hiddenPassword ? "password" : "text"}
                                className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                                placeholder={t("login.password-ex")}
                                autoComplete="off"
                                {...register("password")}
                                onChange={(e) => setValue("password", e.target.value)} />
                            {hiddenPassword ?
                                (<FaRegEye className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] "
                                    onClick={() => setHideenPassword(!hiddenPassword)}
                                />) :
                                (<FaRegEyeSlash className="w-[1.5rem] h-[1.5rem] cursor-pointer absolute right-4 text-[rgb(62,24,0)] text-lg"
                                    onClick={() => setHideenPassword(!hiddenPassword)}
                                />)}
                        </div>
                        {errors?.password && <p className="text-[red] md:text-lg">{errors?.password.message}</p>}
                    </div>
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">{t("signup.confirm")} <span className="text-[red]">*</span></p>
                        <div className="flex flex-row items-center justify-between relative">
                            <input type={hiddenPassword ? "password" : "text"}
                                className="w-full md:h-[4rem] h-[3rem]  px-4 border-2 md:text-lg "
                                placeholder={t("login.password-ex")}
                                autoComplete="off"
                                {...register("confirm")}
                                onChange={(e) => setValue("confirm", e.target.value)} />
                        </div>
                        {errors?.confirm && <p className="text-[red] md:text-lg">{errors?.confirm.message}</p>}
                    </div>
                    <p className="text-[rgb(62,24,0)] md:text-lg text-sm font-bold w-full flex flex-row items-center space-x-1 flex-wrap">
                        <input type="checkbox" checked={confirmButton ? true : false} onChange={() => setConfirmButton(!confirmButton)} className="accent-[rgb(62,24,0)] h-4 w-6" />
                        {t("signup.agree")}
                        <span className="underline cursor-pointer md:text-lg text-[12px]">{t("signup.terms")}</span>
                        <span>{t("signup.and")}</span>
                        <span className="cursor-pointer underline md:text-lg text-[12px]">{t("signup.privacy")}</span>
                    </p>
                    <button className={`w-full ${confirmButton ? "bg-[rgb(62,24,0)]" : "bg-[rgba(62,24,0,0.3)] cursor-not-allowed"} md:py-4 py-2 text-white md:text-lg font-bold`}
                        onClick={handleSubmit(handleNextStepSignup)}>
                        {/* onClick={()=>handleNextStepSignup()}> */}
                        {t('signup.next')}
                    </button>
                    <p className="w-full text-center md:text-lg font-semibold">{t("signup.already")}
                        <Link className="underline cursor-pointer ml-2 text-[rgb(62,24,0)]" to={"/login"}>
                            {t("signup.login")}
                        </Link>
                    </p>
                </div>
            </div>
            : <UserInfoPage setNextStepSignup={setNextStepSignup} data={data} />
    )
}

export default SignupPage;