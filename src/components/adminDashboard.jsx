import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Backpack } from "lucide-react";
import { Trash2, Edit2 } from "lucide-react";
import * as XLSX from "xlsx";

import AddForm from "./addForm.jsx";
import Header from "./header.jsx";
import PropertyCard from "./propertyCard.jsx";
import { useAuth } from "./contextApi.jsx";
import axios from "axios";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [formOpen, openForm] = useState(false);
  const [properties, setProperties] = useState([]);
  const [editedProperty, setEditedProperty] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${BACKAPI}/api/properties/download`);
      if (res.data.success) {
        const filteredProperties = res.data.properties.map((property) => {
          const { _id, __v, ...rest } = property;

          const formatDate = (date) => {
            const d = new Date(date);
            return `${d.getFullYear()}-${(d.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
          };

          rest.isLastFloor = property.isLastFloor ? "نعم" : "لا";

          return {
            ...rest,
            createdAt: formatDate(property.createdAt),
            updatedAt: formatDate(property.updatedAt),
          };
        });

        const worksheet = XLSX.utils.json_to_sheet(filteredProperties);

        const fieldToHeader = {
          propertyId: "كود",
          yearBuilt: "عام البناء",
          category: "التصنيف",
          type: "النوع",
          agent: "الوكيل",
          area: "المنطقة",
          size: "المساحة",
          floor: "الدور",
          isLastFloor: "الاخير",
          price: "السعر",
          finishing: "التشطيب",
          rooms: "الغرف",
          reception: "الريسبشن",
          bathrooms: "الحمامات",
          meters: "العدادات",
          notes: "الملاحظات",
          images: "الصور",
          createdAt: "تاريخ",
          updatedAt: "تاريخ التحديث",
        };

        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const colLetter = XLSX.utils.encode_col(col);
          const field = Object.keys(filteredProperties[0])[col];
          worksheet[colLetter + "1"] = { v: fieldToHeader[field], t: "s" };
        }

        for (let col = range.s.c; col <= range.e.c; col++) {
          const colLetter = XLSX.utils.encode_col(col);
          worksheet[colLetter + "1"].s = { alignment: { horizontal: "right" } };
          for (let row = range.s.r; row <= range.e.r; row++) {
            worksheet[colLetter + (row + 1)].s = {
              alignment: { horizontal: "right" },
            };
          }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

        XLSX.writeFile(workbook, "properties.xlsx");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${BACKAPI}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data.success) {
          navigate("/");
        }
      } catch (err) {
        console.log(err);
      }
    };
    verifyUser();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${BACKAPI}/api/properties/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProperties(res.data.properties);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const ConfirmationModal = ({ onConfirm, onCancel, message }) => {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <p className="text-xl text-center mb-4">{message}</p>
          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="bg-gray-400 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    );
  };

  const openDeleteForm = (property) => {
    setPropertyToDelete(property);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPropertyToDelete(null);
  };

  const handleDelete = async (property) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `${BACKAPI}/api/properties/del/${property._id}`,
        {
          data: {
            deletedImages: property.images?.map((img) => img.public_id) || [],
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        console.log("Property deleted successfully");
        fetchProperties();
      } else {
        console.log("Error deleting this property: " + res.data.message);
      }
    } catch (err) {
      console.log("Error deleting: " + err);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const handleEdit = async (property) => {
    try {
      const res = await axios.get(`${BACKAPI}/api/properties/show/${property}`);
      if (res.data.success) {
        setEditedProperty(res.data.property);
      }
    } catch (err) {
      console.log(err);
    }
    openForm(true);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-6 font-arabic text-right">
        <header className="text-2xl font-semibold mb-6">
          {user ? <h2>مرحباً, {user} 👋</h2> : null}
        </header>

        <div className="flex justify-start mb-4">
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 transition-all bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            <Download className="w-5 h-5" />
            تحميل كملف Excel
          </button>
        </div>

        <div className="flex flex-wrap justify-evenly mt-5 transition-opacity duration-1000 ease-in">
          {properties.map((property) => (
            <div
              key={property.propertyId + property.area}
              className="w-[320px] ml-2 relative"
            >
              <div className="absolute flex   w-20 justify-evenly right-2 top-15 z-10">
                <div
                  onClick={() => openDeleteForm(property)}
                  className="h-9 grid place-content-center bg-red-800 hover:bg-red-600 transition-all w-9 rounded-full cursor-pointer"
                >
                  <Trash2 className="text-white" />
                </div>

                <div
                  onClick={() => handleEdit(property.propertyId)}
                  className="h-9 grid place-content-center bg-orange-400 hover:bg-orange-300 transition-all w-9 rounded-full cursor-pointer"
                >
                  <Edit2 className="text-white" />
                </div>
              </div>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {formOpen && (
          <AddForm
            fetchProperties={fetchProperties}
            openForm={openForm}
            editedProperty={editedProperty}
          />
        )}

        <button
          onClick={() => {
            openForm(!formOpen);
            setEditedProperty({});
          }}
          className="fixed bottom-6 left-6 bg-[var(--bg-main)] hover:bg-[#375963] cursor-pointer transition-all text-white p-4 rounded-full shadow-lg hover:shadow-sm shadow-gray-900"
          aria-label="إضافة عقار جديد"
        >
          <Plus size={24} />
        </button>
      </div>

      {showModal && (
        <ConfirmationModal
          onConfirm={() => handleDelete(propertyToDelete)}
          onCancel={closeModal}
          message="هل أنت متأكد من حذف هذا العقار؟"
        />
      )}
    </>
  );
}
