import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showErrorNoti, showSuccessNoti } from "../../utils/toastify";
import { updateUser } from "../../api/user";
import UploadAndDisplayImage from "./UploadAndDisplayImage";

const AccountPersonal = ({ data }) => {
    const { t } = useTranslation("global");
    const [image, setImage] = useState(null);
    const schema = z.object({
        name: z.string().min(2, t("signup.name-err")),
        phoneNumber: z.string().min(10, t("profile.phone-err")).max(11, t("profile.phone-err")),
        gender: z.string().min(1, t("profile.gender-err")),
    })
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    useEffect(() => {
        setValue("name", data.name);
        setValue("gender", data.gender);
        setValue("phoneNumber", data.phoneNumber);
    }, [data]);
    const handleUpdate = async (user) => {
        user.avatar = data.avatar;
        user.id = data.id;
        const response = await updateUser(user, image);
        if (response.status == 200) {
            data.name = response.data.name;
            data.gender = response.data.gender;
            data.phoneNumber = response.data.phoneNumber;
            data.avatar = response.data.avatar;
            showSuccessNoti(t("infor-success"));
        }
        else showErrorNoti((t("infor-error")))
    }
    return (
        <div className="w-full space-y-6 px-[1rem]">
            <div className="flex flex-row">
                <div className="w-[75%] mr-[1rem]">
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">{t("login.email")}</p>
                        <input type="text" className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg cursor-not-allowed" disabled defaultValue={data?.email || ''} />
                    </div>
                    <div className="flex flex-col space-y-3">
                        <p className="md:text-xl space-x-2 font-bold">{t("signup.name")} <span className="text-[red]">*</span></p>
                        <input type="text" className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                            placeholder={t("signup.name-ex")}
                            {...register("name")}
                            onChange={(e) => setValue("name", e.target.value)} />
                        {errors?.name && <p className="text-[red] md:text-lg">{errors?.name.message}</p>}
                    </div>
                </div>
                <div className="m-auto">
                    <UploadAndDisplayImage defaultImage={data?.avatar} image={image} setImage={setImage} />
                </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between w-full md:space-x-6 space-x-0 md:space-y-0 space-y-6">
                <div className="flex flex-col space-y-3 md:w-1/2 w-full">
                    <p className="md:text-xl space-x-2 font-bold">{t("profile.phone")} <span className="text-[red]">*</span></p>
                    <input type="text" className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg"
                        placeholder={t("profile.phone-ex")}
                        {...register("phoneNumber")}
                        onChange={(e) => setValue("phoneNumber", e.target.value)} />
                    {errors?.phoneNumber && <p className="text-[red] md:text-lg">{errors?.phoneNumber.message}</p>}
                </div>
                <div className="flex flex-col space-y-3 md:w-1/2 w-full">
                    <p className="md:text-xl space-x-2 font-bold">{t("profile.gender")} <span className="text-[red]">*</span></p>
                    <select className="border-2 md:h-[4rem] h-[3rem] px-4 md:text-lg opacity-60"
                        {...register("gender")}
                        onChange={(e) => setValue("gender", e.target.value)}>
                        <option value="0">{t("profile.male")}</option>
                        <option value="1">{t("profile.female")}</option>
                    </select>
                    {errors?.gender && <p className="text-[red] md:text-lg">{errors?.gender.message}</p>}
                </div>
            </div>
            <div className="flex">
                <button className="md:w-[15rem] mx-auto w-full bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold"
                    onClick={handleSubmit(handleUpdate)}>
                    {t('account.personal-btn')}
                </button>
            </div>
        </div>
    )
}

export default AccountPersonal;