import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSalesDC = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/DC`);
    console.log("Response from SAles DC", response.data);
    return response.data;
  } catch (error) {
    console.log("Error Fetching Sales DC", error);
    throw error;
  }
};

export const CreateSalesDC = async (
  DcId,
  poData,
  values,
  tableData,
  salesDCData
) => {
  try {
    const payload = {
      SPoDate: salesDCData?.SPoDate || poData?.SPoDate,
      SPoNum: salesDCData?.SPoNum || poData?.SPoNum,
      RefernceInvoiceNo: "INV123456",
      CustomerID: salesDCData?.CustomerID || poData?.CustomerID,
      CustomerName: salesDCData?.CustomerName || poData?.CustomerName,
      DCDeliveryState: salesDCData?.CustomerState || poData?.CustomerState,
      DispatchFrom: salesDCData?.BillFrom || poData?.BillFrom,
      ShipTo: salesDCData?.DeliveryAddress || poData?.DeliveryAddress,
      TransporterName: values?.transporterName,
      VehicleNum: values?.vehicleNum,
      ModeOfTransport: values?.modeOfTransport,
      NoOfPackage: values?.package,
      TotalQty: values?.totalQty,
      TotalWgt: values?.totalWgt,
      CreatedBy: values?.createdBy,
      TaxPer: values?.taxPer,
      TaxValue: values?.taxValue,
      TaxableValue: values?.taxableValue,
      TotalValue: values?.totalValue,
      UpdatedBy: values?.updatedBy || "",
      Items: Array.isArray(tableData)
        ? tableData.map((item) => ({
            ItemCode: item.itemCode || "",
            ItemName: item.itemName || "",
            Quantity: item.quantity || "",
            Rate: item.rate || "",
            Amount: item.netAmount || "",
            HSN: item.hsn || "",
          }))
        : [],
        Status: values?.status,
        StatusId: values?.status === "Partially" ? 1 : 2
    };

    let response;

    if (DcId) {
      response = await axios.put(`${BASE_URL}/DC/${DcId}`, payload);
    } else {
      response = await axios.post(`${BASE_URL}/DC`, payload);
    }
    console.log(payload, "Response from Create Sales DC", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Creating Sales Dc", error);
    throw error;
  }
};

export const getSalesDCByID = async (DcId) => {
  try {
    const response = await axios.get(`${BASE_URL}/DC/${DcId}`);
    console.log("Response from Sales DC By ID", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Fetching DC By ID", error);
    throw error;
  }
};

export const getDcByPoNum = async (poID, setDCData) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/DC/${poID}`
    );
    setDCData(response.data)
    console.log("Getting DC Data :", response);
  } catch (err) {
    console.error("Error in Getting DC Data", err);
    throw err;
  }
};

export const filterSalesDC = async ({ fromDate, toDate, Status }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    if (Status === "Shipped") params.Status = "Shipped";
    else if (Status === "Pending") params.Status = "Pending";
    else if (Status === "Delivered") params.Status = "Delivered";
    else if (Status === "Cancelled") params.Status = "Cancelled";

    console.log("Final params sent to API:", params);

    const response = await axios.get(`${BASE_URL}/DC`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error filtering customers", error);
    return [];
  }
};

export const UpdateStatus = async (rowId, status) => {
  console.log(rowId, "PoId");
  const statusId =
    status === "Shipped"
      ? 2
      : status === "Pending"
      ? 3
      : status === "Delivered"
      ? 1
      : 4;
  try {
    const payload = {
      Status: status,
      StatusId: statusId,
    };

    const response = await axios.put(`${BASE_URL}/DC/status/${rowId}`, payload);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error updating PO status", error);
    throw error;
  }
};

export const searchSalesDC = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/DC` // fallback to full list
        : `${BASE_URL}/DC?term=${term}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in search DC:", error);
    throw error; // Optional: let the calling thunk handle rejection
  }
};
