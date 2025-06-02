import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";

const ShowProperty = () => {
  const [property, setProperty] = useState();
  const [mainImage, setMainImage] = useState();
  const [message, setMessage] = useState("");
  const navigator = useNavigate();
  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  useEffect(() => {
    const getPropertyWithId = async () => {
      try {
        const propertyId = window.location.pathname.split("/")[2];
        console.log(propertyId);
        const res = await axios.get(
          `${BACKAPI}/api/properties/show/${propertyId}`
        );
        console.log(res);
        if (res.data.success) {
          if (res.data.property.images[0]) {
            setMainImage(res.data.property.images[0].url);
          }
          setProperty(res.data.property);
        } else {
          setMessage(res.data.message);
        }
      } catch (err) {
        setMessage(err.message);
      }
    };
    getPropertyWithId();
  }, []);

  if (message !== "") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-800 mb-4">
            404 - Property Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-6">{message}</p>
          <div
            onClick={() => navigator("/")}
            className="px-8 py-3 bg-[var(--bg-main)] hover:bg-[#375963] transition-all duration-200 rounded-full text-white font-semibold cursor-pointer"
          >
            Go Back to Home
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#ccc]">
        <div className="loader w-12 h-12 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-screen-lg mx-auto p-6 pt-20 space-y-8">
        <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
          {mainImage && (
            <img
              src={mainImage}
              className="w-full h-full object-cover rounded-xl"
              alt="Main property"
            />
          )}
        </div>

        <div className="flex gap-3 overflow-hidden">
          {property.images.map((image, index) => (
            <div
              key={index}
              className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => setMainImage(image.url)}
            >
              <img
                src={image.url}
                alt={`Property ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="bg-white shadow-md rounded-xl p-6 space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {property.price} EGP
              </h2>
              <p className="text-gray-600">النوع: {property.type}</p>
              <p className="text-gray-600">التصنيف: {property.category}</p>
              <p className="text-gray-600">المنطقة: {property.area}</p>
              <p className="text-gray-600">المساحة: {property.size} متر مربع</p>
              <p className="text-gray-600">
                الدور: {property.floor} {property.isLastFloor && "(آخر دور)"}
              </p>
              <p className="text-gray-600">
                الغرف: {property.rooms} | الحمامات: {property.bathrooms} |
                الريسيبشن: {property.reception}
              </p>
              <p className="text-gray-600">التشطيب: {property.finishing}</p>
              <p className="text-gray-600">
                عدادات:{" "}
                {property.meters.map((meter, index) => {
                  let arabicLabel = "";

                  if (meter === "ك") {
                    arabicLabel = "كهرباء"; 
                  } else if (meter === "م") {
                    arabicLabel = "مياه"; 
                  } else if (meter === "غ") {
                    arabicLabel = "غاز";
                  }

                  return (
                    <span key={index}>
                      {arabicLabel}
                      {index !== property.meters.length - 1 && ", "}{" "}
                    </span>
                  );
                })}
              </p>

              <p className="text-gray-600">مصاعد: {property.elevators}</p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-2">ملاحظات</h3>
              <p className="text-gray-600">{property.notes}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                الوكيل العقاري
              </h3>
              <p className="text-gray-600">{property.agent}</p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                سنة البناء
              </h3>
              <p className="text-gray-600">{property.yearBuilt}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div
            onClick={() => navigator("/")}
            className="inline-block px-9 py-3 bg-[var(--bg-main)] hover:bg-[#375963] transition-all duration-200 rounded-full text-white font-semibold cursor-pointer"
          >
            الرجوع
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowProperty;
