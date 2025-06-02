import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Img } from "react-image";
import { XMarkIcon } from "@heroicons/react/24/solid";

const AddForm = ({ openForm, fetchProperties, editedProperty }) => {
  const [propertyId, setPropertyId] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [agent, setAgent] = useState("");
  const [area, setArea] = useState("");
  const [size, setSize] = useState("");
  const [floor, setFloor] = useState("");
  const [isLastFloor, setIsLastFloor] = useState(false);
  const [price, setPrice] = useState("");
  const [finishing, setFinishing] = useState("");
  const [rooms, setRooms] = useState("");
  const [reception, setReception] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [meters, setMeters] = useState([]);
  const [elevators, setElevators] = useState("");
  const [notes, setNotes] = useState("");
  const [imagesUrl, setImagesUrl] = useState([]);
  const [deletedCloudinaryIds, setDeletedCloudinaryIds] = useState([]);
  const [loading, setLoading] = useState(false);

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }
  useEffect(() => {
    if (Object.keys(editedProperty).length !== 0) {
      setPropertyId(editedProperty.propertyId || "");
      setYearBuilt(editedProperty.yearBuilt || 0);
      setCategory(editedProperty.category || "");
      setType(editedProperty.type || "");
      setAgent(editedProperty.agent || "");
      setArea(editedProperty.area || "");
      setSize(editedProperty.size || "");
      setFloor(editedProperty.floor || 0);
      setIsLastFloor(editedProperty.isLastFloor || false);
      setPrice(editedProperty.price || "");
      setFinishing(editedProperty.finishing || "");
      setRooms(editedProperty.rooms || "");
      setReception(editedProperty.reception || "");
      setBathrooms(editedProperty.bathrooms || "");
      setMeters(editedProperty.meters || []);
      setElevators(editedProperty.elevators || "");
      setNotes(editedProperty.notes || "");

      const existingImages = (editedProperty.images || []).map((img) => ({
        url: img.url,
        preview: img.url,
        public_id: img.public_id,
        fromCloudinary: true,
      }));

      setFiles(existingImages);
    }
  }, [editedProperty]);

  const token = localStorage.getItem("token");

  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      console.log("New files with previews:", newFiles);
      setFiles((previousFiles) => [...previousFiles, ...newFiles]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 10000,
    onDrop,
  });

  const handleMetersChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setMeters(selectedValues);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const API = import.meta.env.VITE_CLOUDINARY_API;
    const uploadedUrls = [];

    try {
      const untouchedCloudinaryImages = files
        .filter(
          (file) =>
            file.public_id && !deletedCloudinaryIds.includes(file.public_id)
        )
        .map((file) => ({
          url: file.url,
          public_id: file.public_id,
          preview: file.preview || file.url,
        }));

      for (const file of files) {
        if (!file.public_id) {
          const formData = new FormData();
          formData.append("upload_preset", "real-state-test");
          formData.append("file", file);
          const imageRes = await axios.post(API, formData);
          uploadedUrls.push({
            url: imageRes.data.secure_url,
            public_id: imageRes.data.public_id,
          });
        }
      }
      const finalImages = [...untouchedCloudinaryImages, ...uploadedUrls];
      setImagesUrl(finalImages);
      if (Object.keys(editedProperty).length === 0) {
        const res = await axios.post(
          `${BACKAPI}/api/properties/add`,
          {
            propertyId: propertyId.toLowerCase(),
            yearBuilt,
            category,
            type,
            agent,
            area,
            size,
            floor,
            isLastFloor,
            price,
            finishing,
            rooms,
            reception,
            bathrooms,
            meters,
            elevators,
            notes,
            images: finalImages,
            deletedImages: deletedCloudinaryIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        if (res.data.success) {
          fetchProperties();
          openForm(false);
          console.log(res.data.message);
        }
      } else {
        const res = await axios.put(
          `${BACKAPI}/api/properties/edit/${editedProperty._id}`,
          {
            propertyId: propertyId.toLowerCase(),
            yearBuilt,
            category,
            type,
            agent,
            area,
            size,
            floor,
            isLastFloor,
            price,
            finishing,
            rooms,
            reception,
            bathrooms,
            meters,
            elevators,
            notes,
            images: finalImages,
            deletedImages: deletedCloudinaryIds,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);
        if (res.data.success) {
          fetchProperties();
          openForm(false);
          console.log(res);
        }
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          openForm(false);
        }}
        className="fixed inset-0 bg-black opacity-15 z-40"
      ></div>

      <form className="fixed flex flex-col justify-between text-right inset-0 m-auto h-[70%] w-[75%] rounded-2xl z-50 bg-white shadow p-6 overflow-y-scroll no-scrollbar ">
        <div className="grid sm:grid-cols-4 gap-10">
          <div>
            <label htmlFor="propertyId" className="block text-right">
              كود العقار
            </label>
            <input
              onChange={(e) => setPropertyId(e.target.value)}
              name="propertyId"
              type="text"
              placeholder="كود العقار"
              className="p-2 border rounded m-2 w-[70%]"
              value={propertyId}
              required
            />
          </div>

          <div>
            <label htmlFor="yearBuilt" className="block text-right">
              سنة البناء
            </label>
            <select
              onChange={(e) => setYearBuilt(e.target.value)}
              name="yearBuilt"
              className="p-2 border rounded m-2 w-[70%]"
              value={yearBuilt}
              required
            >
              {Array.from({ length: 50 }, (_, index) => {
                const currentYear = new Date().getFullYear();
                const year = currentYear - index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-right">
              التصنيف
            </label>
            <input
              onChange={(e) => setCategory(e.target.value)}
              name="category"
              type="text"
              placeholder="التصنيف"
              className="p-2 border rounded m-2 w-[70%]"
              value={category}
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-right">
              إيجار / تمليك
            </label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 border rounded m-2 w-[70%]"
              required
            >
              <option value="">اختر التصنيف</option>
              <option value="إيجار">إيجار</option>
              <option value="تمليك">تمليك</option>
            </select>
          </div>

          <div>
            <label htmlFor="agent" className="block text-right">
              الوكيل
            </label>
            <input
              onChange={(e) => setAgent(e.target.value)}
              name="agent"
              type="text"
              placeholder="الوكيل"
              className="p-2 border rounded m-2 w-[70%]"
              value={agent}
              required
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-right">
              المنطقة
            </label>
            <input
              onChange={(e) => setArea(e.target.value)}
              name="area"
              type="text"
              placeholder="المنطقة"
              className="p-2 border rounded m-2 w-[70%]"
              value={area}
              required
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-right">
              المساحة
            </label>
            <input
              onChange={(e) => setSize(e.target.value)}
              name="size"
              type="number"
              placeholder="المساحة"
              className="p-2 border rounded m-2 w-[70%]"
              value={size}
              required
            />
          </div>

          <div>
            <label htmlFor="floor" className="block text-right">
              الطابق
            </label>
            <input
              onChange={(e) => setFloor(e.target.value)}
              name="floor"
              type="number"
              placeholder="الطابق"
              className="p-2 border rounded m-2 w-[70%]"
              value={floor}
              required
            />
          </div>

          <div>
            <label htmlFor="isLastFloor" className="block text-right">
              هل هو آخر طابق؟
            </label>
            <select
              onChange={(e) => setIsLastFloor(e.target.value === "true")}
              name="isLastFloor"
              className="p-2 border rounded m-2 w-[70%]"
              value={isLastFloor}
              required
            >
              <option value="true">نعم</option>
              <option value="false">لا</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-right">
              السعر
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              name="price"
              type="number"
              placeholder="السعر"
              className="p-2 border rounded m-2 w-[70%]"
              value={price}
              required
            />
          </div>

          <div>
            <label htmlFor="finishing" className="block text-right">
              التشطيب
            </label>
            <input
              onChange={(e) => setFinishing(e.target.value)}
              name="finishing"
              type="text"
              placeholder="التشطيب"
              className="p-2 border rounded m-2 w-[70%]"
              value={finishing}
              required
            />
          </div>

          <div>
            <label htmlFor="rooms" className="block text-right">
              عدد الغرف
            </label>
            <input
              onChange={(e) => setRooms(e.target.value)}
              name="rooms"
              type="number"
              placeholder="عدد الغرف"
              className="p-2 border rounded m-2 w-[70%]"
              value={rooms}
              required
            />
          </div>

          <div>
            <label htmlFor="reception" className="block text-right">
              عدد الصالات
            </label>
            <input
              onChange={(e) => setReception(e.target.value)}
              name="reception"
              type="number"
              placeholder="عدد الصالات"
              className="p-2 border rounded m-2 w-[70%]"
              value={reception}
              required
            />
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-right">
              عدد الحمامات
            </label>
            <input
              onChange={(e) => setBathrooms(e.target.value)}
              name="bathrooms"
              type="number"
              placeholder="عدد الحمامات"
              className="p-2 border rounded m-2 w-[70%]"
              value={bathrooms}
              required
            />
          </div>

          <div>
            <label htmlFor="meters" className="block text-right">
              العدادات
            </label>
            <select
              onChange={handleMetersChange}
              name="meters"
              className="p-2 border rounded m-2 w-[70%]"
              value={meters}
              multiple
              required
            >
              <option value="الكهرباء">الكهرباء</option>
              <option value="الغاز">الغاز</option>
              <option value="المياه">المياه</option>
            </select>
          </div>
          <div>
            <label htmlFor="elevators" className="block">
              عدد المصاعد
            </label>
            <input
              name="elevators"
              type="number"
              placeholder="عدد المصاعد"
              className="p-2 border rounded m-2 w-[70%]"
              value={elevators}
              onChange={(e) => setElevators(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block">
            ملاحظات
          </label>
          <textarea
            name="notes"
            placeholder="ملاحظات"
            className="p-2 border rounded m-2 w-full resize-none h-48"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
          />
        </div>
        <div
          className="w-full bg-gray-200 text-center h-[100px] rounded-2xl my-2 border-dashed border-2 border-black"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="p-5">إسحب الصورة هنا ...</p>
          ) : (
            <p className="p-5">إسحب أو انقر لتحميل الصور 📸</p>
          )}
        </div>

        <h1 className="text-2xl mt-4 mb-5 text-center">الصور المقبولة</h1>
        <div className="min-h-[200px] overflow-y-scroll pr-1 no-scrollbar">
          <ul className="flex flex-wrap gap-3 items-center justify-center">
            {files.map((file, i) => (
              <li key={file.public_id || file.name || i} className="relative">
                <div className="relative h-[120px] w-[120px] shadow-gray-200 shadow-xl hover:shadow-md transition-all">
                  <Img
                    src={file.preview || file.url}
                    onLoad={() => {
                      if (file.preview) URL.revokeObjectURL(file.preview);
                    }}
                    className="rounded-md h-full w-full object-cover"
                    alt="Preview"
                    width={120}
                    height={120}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (file.public_id) {
                        setDeletedCloudinaryIds((prev) => [
                          ...prev,
                          file.public_id,
                        ]);
                      }
                      setFiles((prev) =>
                        prev.filter((f) => {
                          if (file.public_id) {
                            return f.public_id !== file.public_id;
                          }
                          return f.name !== file.name;
                        })
                      );
                    }}
                    className="w-6 h-6 flex items-center justify-center absolute top-1 right-1 rounded-full bg-red-700 hover:bg-red-500 text-white transition-all"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
  onClick={(e) => {
    handleSubmit(e);
    setLoading(true);
  }}
  type="submit"
  className="bg-[var(--bg-main)] cursor-pointer mb-0 text-white py-2 rounded-full hover:bg-[#375963] m-auto w-[70%] flex justify-center items-center"
>
  {loading ? (
    <div className="loader w-9 h-9 border-t-transparent"></div> 
  ) : Object.keys(editedProperty).length === 0 ? (
    "إضافة العقار"
  ) : (
    "تعديل"
  )}
</button>

      </form>
    </>
  );
};

export default AddForm;
