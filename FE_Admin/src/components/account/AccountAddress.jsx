import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { apiGetCity, apiGetDistrict, apiGetWards } from "../../api/location";
import { updateAddress } from "../../api/user";
import { showErrorNoti, showSuccessNoti } from "../../utils/toastify";

const AccountAddress = ({ data }) => {
    const { t } = useTranslation("global");
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [address, setAddress] = useState(data?.address);
    const schema = z.object({
        city: z.string().min(1, t("checkout.address.required-city")),
        district: z.string().min(1, t("checkout.address.required-district")),
        ward: z.string().min(1, t("checkout.address.required-ward")),
        street: z.string().min(1, t("checkout.address.required-deliver")),
    })
    const { register, handleSubmit, setValue, reset, getValues, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    const fetchAddress = async () => {
        var citiesData = await apiGetCity();
        var districtsData = [];
        var wardsData = [];
        if (address) {
            setValue("city", address.city);
            setValue("district", address.district);
            setValue("ward", address.ward);
            for (let i = 0; i < citiesData.length; i++) {
                const e1 = citiesData[i];
                if (e1.province_name == address.city) {
                    districtsData = await apiGetDistrict(e1.province_id);
                    for (let j = 0; j < districtsData.length; j++) {
                        const e2 = districtsData[j];
                        if (e2.district_name == address.district) {
                            wardsData = await apiGetWards(e2.district_id);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        setWards(wardsData);
        setDistricts(districtsData);
        setCities(citiesData);
    }
    useEffect(() => {
        fetchAddress();
    }, [])
    const handleChangeAddress = async (o) => {
        const response = await updateAddress(address?.id ? { ...o, "id": address?.id } : o);
        const newAddress = response.data;
        if (response?.status == 200) {
            setAddress(newAddress);
            data.address = newAddress;
            showSuccessNoti(t("infor-success"));
        }
        else showErrorNoti(t("infor-error"));
    }
    return (
        cities.length > 0 && <div className="flex justify-center mx-[5rem] ">
            <div className="max-w-screen-2xl w-full flex flex-col lg:px-0 sm:px-2 space-y-3">
                <div className='flex md:flex-row flex-col justify-between w-full md:space-y-0 space-y-3 md:space-x-4 space-x-0'>
                    <div className='md:w-1/3 w-full'>
                        <p className='sm:text-xl font-semibold '>
                            {t("checkout.address.city")}
                            <span className='text-[red] sm:text-2xl'> * </span>
                        </p>
                        <select className='border-2 w-full my-2 sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2'
                            {...register("city")}
                            onChange={async (e) => {
                                setValue("city", e.target.value);
                                const provinceId = e.target.options[e.target.selectedIndex].dataset.provinceId;
                                setDistricts(await apiGetDistrict(provinceId));
                                setWards(null);
                            }}>
                            <option value="">---{t("checkout.address.ex-city")}---</option>
                            {cities?.map((city, index) => (
                                <option key={index} value={city?.province_name} data-province-id={city?.province_id}>
                                    {city?.province_name}
                                </option>
                            ))}
                        </select>
                        {errors.city && <span className='text-[red] text-xl'>{errors?.city?.message}</span>}
                    </div>
                    <div className='md:w-1/3 w-full'>
                        <p className='sm:text-xl font-semibold '>
                            {t("checkout.address.district")}
                            <span className='text-[red] sm:text-2xl'> * </span>
                        </p>
                        <select className='border-2 w-full my-2 sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2'
                            {...register("district")}
                            onChange={async (e) => {
                                setValue("district", e.target.value);
                                const districtId = e.target.options[e.target.selectedIndex].dataset.districtId;
                                setWards(await apiGetWards(districtId));
                            }}>
                            <option value="">---{t("checkout.address.ex-district")}---</option>
                            {getValues("city") && districts?.map((item, index) => (
                                <option key={index} value={item?.district_name} data-district-id={item?.district_id}>{item?.district_name}</option>
                            ))}
                        </select>
                        {errors.district && <span className='text-[red] text-xl'>{errors?.district?.message}</span>}
                    </div>
                    <div className='md:w-1/3 w-full'>
                        <p className='sm:text-xl font-semibold '>
                            {t("checkout.address.ward")}
                            <span className='text-[red] sm:text-2xl'> * </span>
                        </p>
                        <select className='border-2 w-full my-2 sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2'
                            {...register("ward")}
                            onChange={(e) => {
                                setValue("ward", e.target.value)
                            }} >
                            <option value="">---{t("checkout.address.ex-ward")}---</option>
                            {getValues("city") && getValues("district") && wards?.map((item, index) => (
                                <option key={index} value={item?.ward_name}>{item?.ward_name}</option>
                            ))}
                        </select>
                        {errors.ward && <span className='text-[red] text-xl'>{errors?.ward?.message}</span>}
                    </div>
                </div>
                <div className='w-full'>
                    <p className='sm:text-xl font-semibold '>
                        {t("checkout.address.deliver")}
                        <span className='text-[red] sm:text-2xl'> * </span>
                    </p>
                    <input type="text" placeholder={t("checkout.address.ex-deliver")}
                        className='border-2 w-full sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2 my-2'
                        defaultValue={address?.street || ''}
                        {...register("street")}
                        onChange={(e) => {
                            setValue("street", e.target.value)
                        }}
                    />
                    {errors.street && <span className='text-[red] text-xl'>{errors?.street?.message}</span>}
                </div>
                <div className="flex">
                    <button className="md:w-[15rem] mx-auto w-full bg-[rgb(62,24,0)] sm:py-4 py-3 text-white md:text-lg font-bold"
                        onClick={handleSubmit(handleChangeAddress)}>
                        {t('account.personal-btn')}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default memo(AccountAddress);