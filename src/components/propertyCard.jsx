import React from "react";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const PropertyCard = ({ property }) => {
  const navigator = useNavigate();
  const showProperty = (property) => {
    navigator(`/show/${property.propertyId.toLowerCase()}`);
  };
  return (
    <div className="flex w-full mt-5">
      <div className="w-[320px] mt-5 bg-white rounded-lg shadow-lg hover:shadow-2xl overflow-hidden transition-all cursor-pointer">
        {property.images[0] ? (
          <img
            className="w-full h-48 object-cover"
            src={property.images[0].url}
            alt="صورة العقار"
          />
        ) : (
          <div className="grid place-content-center bg-gray-200 h-48">
            <span className="text-black w-full h-full mx-auto">No Image</span>
          </div>
        )}

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {property.category} - {property.area}
          </h2>
          <p className="text-lg text-gray-600 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" /> السعر:{" "}
            {property.price} جنيه
          </p>
          <div className="flex flex-wrap justify-between text-gray-600 mt-4">
            <div className="flex items-center gap-2">
              <FaBed className="text-[var(--bg-main)]" />
              <span>غرف: {property.rooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBath className="text-[var(--bg-main)]" />
              <span>حمام: {property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaRulerCombined className="text-[var(--bg-main)]" />
              <span>م²: {property.size}</span>
            </div>
          </div>
          <button
            onClick={() => {
              showProperty(property);
            }}
            className="w-full cursor-pointer mt-4 py-2 bg-[var(--bg-main)] text-white rounded-lg hover:bg-[#375963] transition"
          >
            تفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
