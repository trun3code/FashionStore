import React, { useEffect, useState } from "react";
import { getImage } from "../api/product";

const UploadAndDisplayImage = ({ originalImage, curImage, setImage, canEdit = true, size = 10 }) => {
  const [resetBtn, setResetBtn] = useState(false);
  const handleChangeImage = (img) => {
    const imgSize = img.size / 1024 / 1024;
    if (imgSize > 2) {
      showErrorNoti("Ảnh quá lớn, vui lòng chọn ảnh khác");
      setImage(null);
    }
    else setImage(img);
  }
  useEffect(() => {
    setResetBtn(curImage != null)
  }, [curImage])
  return (
    <div className="border border-2 w-full h-full">
      {
        canEdit &&
        <div className="flex p-1 mx-auto w-full justify-center">
          <input type="file" name="productImage"
            className="w-full h-full text-sm text-stone-500 font-bold file:mr-5  file:border-[1.5px] file:text-sm file:font-medium 
            file:bg-stone-50 file:text-stone-700  hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
            onChange={(event) => { handleChangeImage(event.target.files[0]); }} />
          {
            resetBtn &&
            <>
              <button className='bg-[rgb(255,43,54)] text-sm text-white w-[50%] font-bold rounded-md '
                onClick={() => handleChangeImage(null)}>
                Hủy
              </button>
            </>
          }
        </div>
      }
      <img className={`m-auto w-[${size}rem] h-[${size}rem] object-scale-down`}
        src={curImage != null ? window.URL.createObjectURL(curImage) : getImage(originalImage)} alt="" />
    </div>
  );
};

export default UploadAndDisplayImage;
