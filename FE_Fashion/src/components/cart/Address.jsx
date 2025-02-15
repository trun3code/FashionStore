import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { apiGetCity, apiGetDistrict, apiGetWards } from "../../api/location";
import { getUser } from "../../api/user";

const Address = ({ handleCheckout }) => {
    const { t } = useTranslation("global");
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isUseDefaultAddress, setIsUseDefaultAddress] = useState(false);
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addressId, setAddressId] = useState(null);
    async function fetchUser() {
        const data = await getUser();
        setValue("phoneNumber", data.phoneNumber);
        setValue("user", data.name);
        if (!data?.address) return;
        setDefaultAddress(data.address.name);
        setIsUseDefaultAddress(true);
        setAddressId(data.address.id);
    }
    async function fetchCity() {
        setCities(await apiGetCity());
    }
    async function fetchDistrict(cityId) {
        setDistricts(await apiGetDistrict(cityId));
    }
    async function fetchWard(districtId) {
        setWards(await apiGetWards(districtId));
    }
    useEffect(() => {
        fetchCity();
        fetchUser();
    }, [])
    const schema = z.object({
        user: z.string().min(1, t("checkout.address.required-name")),
        phoneNumber: z.string().min(1, t("checkout.address.required-phone")),
        city: z.string().min(1, t("checkout.address.required-city")),
        district: z.string().min(1, t("checkout.address.required-district")),
        ward: z.string().min(1, t("checkout.address.required-ward")),
        address: z.string().min(1, t("checkout.address.required-deliver")),
    })
    const { register, handleSubmit, setValue, reset, getValues, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
    const handleUserDefaultAddress = () => {
        const data = {
            "user": getValues("user"),
            "phoneNumber": getValues("phoneNumber"),
            "id": addressId,
        };
        handleCheckout(data);
    }
    return (
        <div className="flex justify-center ">
            <div className="max-w-screen-2xl w-full flex flex-col lg:px-0 sm:px-2 space-y-3">
                <p className="sm:text-2xl text-lg font-bold">{t("account.address-title")}</p>
                <div className='flex sm:flex-row flex-col justify-between w-full sm:space-y-0 space-y-3'>
                    <div className='sm:w-[45%] w-full'>
                        <p className='sm:text-xl font-semibold '>
                            {t("checkout.address.name")}
                            <span className='text-[red] sm:text-2xl'> * </span>
                        </p>
                        <input type="text" placeholder={t("checkout.address.ex-name")}
                            defaultValue={getValues("user")}
                            className='border-2 w-full sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2 my-2'
                            {...register("user")}
                            onChange={(e) => {
                                setValue("user", e.target.value)
                            }}
                        />
                        {errors.user && <span className='text-[red] text-xl'>{errors?.user?.message}</span>}
                    </div>
                    <div className='sm:w-[45%] w-full'>
                        <p className='sm:text-xl font-semibold '>
                            {t("checkout.address.phone")}
                            <span className='text-[red] sm:text-2xl'> * </span>
                        </p>
                        <input type="text" placeholder={t("checkout.address.ex-phone")}
                            className='border-2 w-full sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2 my-2'
                            defaultValue={getValues("phoneNumber")}
                            {...register("phoneNumber")}
                            onChange={(e) => {
                                setValue("phoneNumber", e.target.value)
                            }}
                        />
                        {errors.phoneNumber && <span className='text-[red] text-xl'>{errors?.phoneNumber?.message}</span>}
                    </div>
                </div>
                {defaultAddress &&
                    <ul className="w-full text-sm font-medium bg-white  rounded-lg">
                        <li className="w-full mt-2">
                            <div className="flex items-center">
                                <input id="address1" type="radio" value="" name="list-radio" defaultChecked
                                    onChange={() => setIsUseDefaultAddress(true)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100  focus:ring-blue-500 " />
                                <label className='sm:text-xl font-semibold mx-2 ' htmlFor="address1">
                                    {t("checkout.address.default-address")}
                                </label>
                            </div>
                            {isUseDefaultAddress &&
                                <>
                                    <div className='w-full'>
                                        <input type="text" placeholder={t("checkout.address.ex-deliver")} disabled
                                            defaultValue={defaultAddress}
                                            className='border-2 w-full sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2 my-2'
                                        />
                                    </div>
                                    <button className="w-full my-5 text-xl py-3 bg-[rgb(62,24,0)] text-white font-semibold"
                                        onClick={handleUserDefaultAddress}>
                                        {t("checkout.confirm.button")}
                                    </button>
                                </>
                            }
                        </li>
                        <li className="w-full mt-2">
                            <div className="flex items-center">
                                <input id="address2" type="radio" value="" name="list-radio"
                                    onChange={() => setIsUseDefaultAddress(false)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-500 " />
                                <label className='sm:text-xl font-semibold mx-2 ' htmlFor="address1">
                                    {t("checkout.address.other-address")}
                                </label>
                            </div>
                        </li>
                    </ul>
                }
                {(!defaultAddress || !isUseDefaultAddress) && <>
                    <div className='flex md:flex-row flex-col justify-between w-full md:space-y-0 space-y-3 md:space-x-4 space-x-0'>
                        <div className='md:w-1/3 w-full'>
                            <p className='sm:text-xl font-semibold '>
                                {t("checkout.address.city")}
                                <span className='text-[red] sm:text-2xl'> * </span>
                            </p>
                            <select className='border-2 w-full my-2 sm:text-xl sm:h-[4rem] h-[3rem] border-[rgb(230,230,230)] px-2'
                                {...register("city")}
                                onChange={(e) => {
                                    setValue("city", e.target.value)
                                    const provinceId = e.target.options[e.target.selectedIndex].dataset.provinceId;
                                    fetchDistrict(provinceId)
                                }}>
                                <option value="">{t("checkout.address.ex-city")}</option>
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
                                onChange={(e) => {
                                    setValue("district", e.target.value)
                                    const districtId = e.target.options[e.target.selectedIndex].dataset.districtId;
                                    fetchWard(districtId)
                                }}>
                                <option value="">{t("checkout.address.ex-district")}</option>
                                {getValues("city") && districts.map((item, index) => (
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
                                <option value="">{t("checkout.address.ex-ward")}</option>
                                {getValues("district") && getValues("city") && wards.map((item, index) => (
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
                            {...register("address")}
                            onChange={(e) => {
                                setValue("address", e.target.value)
                            }}
                        />
                        {errors.address && <span className='text-[red] text-xl'>{errors?.address?.message}</span>}
                    </div>
                    <button className="w-full my-5 text-xl py-3 bg-[rgb(62,24,0)] text-white font-semibold"
                        onClick={handleSubmit(handleCheckout)}>
                        {t("checkout.confirm.button")}
                    </button>
                </>}
            </div>
        </div>
    )
}
export default Address;