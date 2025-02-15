import { useTranslation } from "react-i18next";
import { showErrorNoti } from "../../utils/toastify";
import { memo } from "react";
import { getAvatar } from "../../api/user";
import noAvatar from "../../assets/ic_user.svg";

const UploadAndDisplayImage = ({ defaultImage, image, setImage }) => {
    const { t } = useTranslation("global");
    const handleChangeImage = (img) => {
        const imgSize = img.size / 1024 / 1024;
        if (imgSize > 2) {
            showErrorNoti(t("signup.img-err"));
            setImage(null);
        }
        else setImage(img);
    }
    return (
        <div className="h-[10rem] w-[10rem] border-2">
            <div className="flex absolute">
                <input type="file" name="productImage" className="w-[5.5rem] text-sm text-stone-500 font-bold file:mr-5 file:py-1 file:px-3 file:border-[1.5px] file:text-sm file:font-medium 
                    file:bg-stone-50 file:text-stone-700  hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
                    onChange={(event) => { handleChangeImage(event.target.files[0]); }} />
            </div>
            <img className={`w-10rem] h-[10rem] mx-auto object-contain object-center p-1`}
                src={image != null ? window.URL.createObjectURL(image) : (defaultImage ? getAvatar(defaultImage) : noAvatar)} alt=""
            />
        </div>
    );
};
export default memo(UploadAndDisplayImage);