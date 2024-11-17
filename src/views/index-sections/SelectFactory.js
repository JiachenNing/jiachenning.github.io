import React, { useState } from "react";

const SelectFactory = ({ selectedOption, setSelectedOption }) => {
  const options = [
    "浙江杭州",
    "湖北仙桃",
    "浙江湖州"
  ];

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label htmlFor="select-bar">选择工厂:</label>
      <select
        id="select-bar"
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="" disabled>工厂地址</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFactory;
