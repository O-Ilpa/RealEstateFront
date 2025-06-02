import React, { useEffect, useState } from "react";
import Header from "./header";
import Landing from "./landing";
import Filter from "./filter";
import axios from "axios";
import PropertyCard from "./propertyCard";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");

  let BACKAPI;
  if (import.meta.env.MODE === "development") {
    BACKAPI = import.meta.env.VITE_DEVELOPMENT_API;
  } else {
    BACKAPI = import.meta.env.VITE_PRODUCTION_API;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!propertyId.trim()) {
      setFilteredProperties(properties);
      console.log(propertyId)
    } else {
      const filtered = properties.filter(
        (property) => property.propertyId.trim() === propertyId.trim().toUpperCase()
      );
      setFilteredProperties(filtered);
      console.log(filteredProperties)
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${BACKAPI}/api/properties/get`);
      if (res.data.success) {
        setProperties(res.data.properties);
        setFilteredProperties(res.data.properties); 
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <>
      <Header />
      <main>
        <Landing />
        <Filter handleSearch={handleSearch} setPropertyId={setPropertyId} properties={properties}/>
      </main>

      <div className="flex flex-wrap w-full justify-center gap-4 p-5">
        {filteredProperties.map((property) => (
          <div key={property.area + " " + property.propertyId} className="w-[320px] ml-2">
            <PropertyCard
              onPropertyClick={() => {}}
              property={property}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
