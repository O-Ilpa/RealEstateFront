import React from "react";

const Filter = ({ handleSearch, setPropertyId, properties }) => {
  return (
    <div
      id="filter"
      className="relative z-10 -mt-16 mx-auto w-[90%] max-w-3xl bg-[#00000080] p-5 rounded-2xl backdrop-blur shadow-xl"
    >
      <h2 className="text-white font-bold text-2xl mb-3 text-center">
        {properties.length} عقار للبيع و للايجار
      </h2>
      <form className="w-full mx-auto">
        <div>
          <input
            onChange={(e) => setPropertyId(e.target.value)}
            type="text"
            className="rounded-2xl p-2 w-full mb-4 bg-white"
            placeholder="الكود"
          />
        </div>


        <button
          onClick={handleSearch}
          className="hover:bg-[#375963] bg-[var(--bg-main)] transition-all cursor-pointer w-full text-white px-4 py-2 rounded-full mt-2"
        >
          بحث
        </button>
      </form>
    </div>
  );
};

export default Filter;
