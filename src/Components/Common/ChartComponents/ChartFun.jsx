import React, { useState } from "react";
import paid from "../../../Assets/paid.png";
import paidSM from "../../../Assets/paid(sm).png";
import partially from "../../../Assets/partially.png";
import partiallySM from "../../../Assets/partially(sm).png";
import overdue from "../../../Assets/overdue.png";
import overdueSM from "../../../Assets/overdue(sm).png";
import { BiSolidUpArrow } from "react-icons/bi";
import { PieChart } from "react-minimal-pie-chart";

const staticStyles = [
  {
    bgColor: "#A2BE9A",
    textColor: "#384E30",
    color: "#A2BE9A",
    image: { large: paid, small: paidSM },
  },
  {
    bgColor: "#FFE58E",
    textColor: "#985C03",
    color: "#FFE58E",
    image: { large: partially, small: partiallySM },
  },
  {
    bgColor: "#FF8E8E",
    textColor: "#96190D",
    color: "#FF8E8E",
    image: { large: overdue, small: overdueSM },
  },
];

const moduleData = {
  1: [
    { title: "Paid Payments", count: 112, percentage: "13.4%" },
    { title: "Partially Paid Payments", count: 89, percentage: "35.5%" },
    { title: "Overdue Payments", count: 13, percentage: "12.2%" },
  ],
  2: [
    { title: "Active Vendors", count: 120, percentage: "50.6%" },
    { title: "Pending Vendors", count: 45, percentage: "23.2%" },
    { title: "Inactive Vendors", count: 10, percentage: "23.7%" },
  ],
  3: [
    { title: "In Stock Style", count: 150, percentage: "50.6%" },
    { title: "Low Stock Style", count: 20, percentage: "50.6%" },
    { title: "Out of Stock Style", count: 50, percentage: "50.6%" },
  ],
  4: [
    { title: "Best Seller Style", count: 112, percentage: "23.7%" },
    { title: "Average Seller Style", count: 89, percentage: "23.7%" },
    { title: "Low Seller Style", count: 13, percentage: "23.7%" },
  ],
  5: [
    { title: "Best Seller Style", count: 30, percentage: "13.4%" },
    { title: "Average Seller Style", count: 70, percentage: "13.4%" },
    { title: "Low Seller Style", count: 60, percentage: "13.4%" },
  ],
  6: [
    { title: "In Stock Style", count: 150, percentage: "12.2%" },
    { title: "Low Stock Style", count: 20, percentage: "12.2%" },
    { title: "Out of Stock Style", count: 50, percentage: "12.2%" },
  ],
  7: [
    { title: "Paid Payments", count: 112, percentage: "13.4%" },
    { title: "Partially Paid Payments", count: 89, percentage: "13.4%" },
    { title: "Overdue Payments", count: 13, percentage: "13.4%" },
  ],
  8: [
    { title: "In Stock Style", count: 150, percentage: "35.5%" },
    { title: "Low Stock Style", count: 20, percentage: "35.5%" },
    { title: "Out of Stock Style", count: 50, percentage: "35.5%" },
  ],
};

export default function ChartFun({ isSidebarOpen, selectedModule }) {
  const [selectedSlice, setSelectedSlice] = useState(null); // Track the selected slice
  const cardData = moduleData[selectedModule] || [];
  const labelColors = ["#384E30", "#985C03", "#96190D"];

  const chartData = moduleData[selectedModule]?.map((item, index) => {
    // Calculate the total count for the selected module
    const totalCount = moduleData[selectedModule].reduce(
      (total, currentItem) => total + currentItem.count,
      0
    );
    // Calculate the percentage for each slice based on count
    const percentage = (item.count / totalCount) * 100;
    // Get the style based on the slice index (1st slice gets 1st style, etc.)
    const style = staticStyles[index % staticStyles?.length]; // Loop through staticStyles if more than 3 slices

    return {
      title: item.title,
      value: Math.round(percentage), // Use the calculated percentage as value
      color: style.bgColor, // Apply background color
      image: style.image, // Image for the slice
    };
  });

  // Handle slice click
  const handleSliceClick = (index) => {
    setSelectedSlice(selectedSlice === index ? null : index); // Toggle slice selection
  };

  // Calculate slice offset for animation
  const calculateOffset = (dataIndex) => {
    if (selectedSlice !== dataIndex) return { dx: 0, dy: 0 }; // No offset if not selected

    const totalValue = chartData.reduce((sum, entry) => sum + entry.value, 0);
    const startAngle = chartData
      .slice(0, dataIndex)
      .reduce((sum, entry) => sum + (entry.value / totalValue) * 360, 0);
    const endAngle =
      startAngle + (chartData[dataIndex].value / totalValue) * 360;
    const midAngle = (startAngle + endAngle) / 2;

    // Convert angle to radians
    const radian = (midAngle * Math.PI) / 180;

    // Calculate offsets
    const dx = Math.cos(radian) * 10;
    const dy = Math.sin(radian) * 10;

    return { dx, dy };
  };

  return (
    <div
      className={`flex flex-col justify-center items-center pt-[5.5vh] ${
        isSidebarOpen ? "gap-[3vw]" : "gap-[0.9vw]"
      }`}
    >
      <div className="flex flex-col gap-[1.5vw]">
        {cardData.map((data, index) => {
          const styles = staticStyles[index] || staticStyles[0]; // Use static styles
          const isSecondCard = index === 1; // Check if it's the second card
          const imagePadding = isSecondCard
            ? isSidebarOpen
              ? "top-[3.85vh]" // Sidebar open padding for second card
              : "top-[6.1vh]" // Sidebar closed padding for second card
            : isSidebarOpen
            ? "top-[4.4vh]"
            : "top-[7.2vh]";

          return (
            <div
              key={index}
              className={`relative rounded-[0.8vw] ${
                isSidebarOpen
                  ? "h-[7.9vh] w-[5vw]"
                  : "h-[13vh] w-[14vw] gap-y-[0.5vw]"
              }`}
              style={{ backgroundColor: styles.bgColor }}
            >
              <span
                className={`absolute ${
                  isSidebarOpen ? "w-[5vw] h-[2vh]" : "w-[14vw] h-[5vh]"
                } ${imagePadding}`}
              >
                <img
                  src={isSidebarOpen ? styles.image.small : styles.image.large}
                  alt={data.title}
                />
              </span>
              {!isSidebarOpen && (
                <p
                  className="absolute text-[1.1vw] pl-[0.95vw]"
                  style={{ color: styles.textColor }}
                >
                  {data.title}
                </p>
              )}
              <p
                className={`absolute flex h-[3.9vw] w-[5vw] text-[1.7vw] font-bold ${
                  isSidebarOpen
                    ? "pl-[1vw] justyfy-center items-center"
                    : "pl-[0.95vw] top-[4vh]"
                }`}
                style={{ color: styles.textColor }}
              >
                {data.count}
              </p>
              {!isSidebarOpen && (
                <div className="flex flex-row">
                  <span
                    className="absolute text-[0.8vw] pl-[0.95vw] top-[10vh]"
                    style={{ color: styles.textColor }}
                  >
                    Since last week
                  </span>
                  <span className="absolute flex flex-row gap-[0.2vw] h-[2.1vh] p-[0.1vw] w-[2.7vw] bg-white top-[10.2vh] left-[14vh] rounded-[0.1vw]">
                    <span className="text-[0.6vw]">{data.percentage}</span>
                    <span className="pt-[0.3vh]">
                      <BiSolidUpArrow size={"0.5vw"} />
                    </span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          perspective: "-12px", // Creates a 3D perspective
          transform: "rotateX(-1deg)", // Tilts the chart for a 3D effect
        }}
        className={`flex ${isSidebarOpen ? "pl-[1vw] w-[8vw]" : ""}`}
      >
        
        <PieChart
          data={chartData?.map((entry, index) => {
            const { dx, dy } = calculateOffset(index);

            return {
              ...entry,
              key: index, // Unique key for each slice
              shiftX: dx, // Apply X offset
              shiftY: dy, // Apply Y offset
              style: {
                fill: entry.color, // Slice fill color
                stroke: "#fff",
                strokeWidth: "1",
              },
            };
          })}
          radius={50}
          lineWidth={100}
          label={({ dataEntry }) => { return `${dataEntry.value}%` }}
          labelStyle={({ dataIndex }) => {
            return {
              fontSize: "0.45vw",
              fill: labelColors[dataIndex],
              fontWeight: "normal",
            };
          }}
          
          labelPosition={60}
          style={{
            width: "15vw",
            height: "29vh",
            padding: "1vw",
            textColor:"#384E30",
            overflow: "visible", // Prevent clipping
            filter: "drop-shadow(-5px 7px 6px rgba(0, 0, 0, 0.5))", // Add shadow to the pie chart
          }}
          animate
          segmentsShift={(index) => (selectedSlice === index ? 10 : 0)} // Shift selected slice outward
          onClick={(_, index) => handleSliceClick(index)} // Handle slice click
        />
  
      </div>
    </div>
  );
}
