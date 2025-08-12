// ExportButton.js

import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExportIcon from "../../../assets/SVG/ExportIcon";
const ExportButton = ({ dataArray }) => {
  const exportToExcel = () => {
    console.log(dataArray,"dataarrardataarray")
    if (dataArray?.length <= 0) {
      alert("No data to export!");
      return;
    }

    const workbook = XLSX?.utils?.book_new();
    const worksheet = XLSX?.utils?.json_to_sheet(dataArray);
    XLSX?.utils?.book_append_sheet(workbook, worksheet, "Sheet 1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(excelBlob, "exported_data.xlsx");
  };

  return (
    <button
       className="bg-[#ffffff] border border-[#ebebeb] shadow-md flex px-[0.75vw] h-[2.25vw] w-[9vw] 
                 justify-center gap-[0.5vw] items-center rounded-[0.6vw] 
                  outline-[2px] outline-transparent
                 hover:outline-[#4096ff] cursor-pointer transition-all duration-200"
      onClick={exportToExcel}
    >
      <ExportIcon size={"1vw"} color="#323232" />
                  <span className="font-bold text-[#323232] text-[0.9vw]">
                    Export
                  </span>
    </button>
  );
};

export default ExportButton;
