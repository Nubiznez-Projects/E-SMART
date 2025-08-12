import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSaleReturn = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/salesReturn`);
    console.log("Response from get SalesReturn", response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting Sale Return", error);
    throw error;
  }
};


export const getSalesReturnById = async (returnID) => {
  try {
    const response = await axios.get(`${BASE_URL}/salesReturn/${returnID}`);
    console.log("Sales Return By ID :", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in Getting Sales Return :", error);
  }
};

export const searchReturnSales = async (term) => {
  try {
    const url =
      term?.length === 0
        ? `${BASE_URL}/salesReturn`
        : `${BASE_URL}/salesReturn/search?term=${term}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error in searched sales return:", error);
    throw error;
  }
};

export const SubmitSalesRtnExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const excelEndpoint = `${BASE_URL}/salesReturn/import-excel`;

  try {
    const response = await axios.post(excelEndpoint, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const submitSalesReturn = async (rtnItems, salesReturnId) => {
  const ReturnItems = rtnItems.returnItems.map((rtnitm) => ({
    ItemName: rtnitm?.ItemName,
    ItemCode: rtnitm?.ItemCode,
    hsnCode: rtnitm?.hsnCode,
    ReturnQty: rtnitm?.ReturnQty,
    Rate: rtnitm?.unitPrice,
    Total: rtnitm?.itemTotal,
  }));

  const formData = new FormData();

  formData.append("InvoiceNo", rtnItems?.invoiceNo);
  formData.append("Items", JSON.stringify(ReturnItems));
  formData.append("Comments", rtnItems?.additionalNotes);
  formData.append("CustomerName", rtnItems?.customerName);
  formData.append("ContactPersonName", rtnItems?.contactPerson);
  formData.append("Email", rtnItems?.email);
  formData.append("MobileNumber", rtnItems?.phone);
  formData.append("ReturnDate", rtnItems?.returnDate);
  formData.append("ReturnType", "Purchase Return");
  formData.append("TotalQuantity", rtnItems?.totalQuantity);
  formData.append("TotalItems", rtnItems?.totalItems);
  formData.append("TotalAmount", rtnItems?.totalAmount);
  formData.append("Image", "Vector.png");

  try {
    if (salesReturnId) {
      const response = await axios.put(
        `${BASE_URL}/salesReturn/${salesReturnId}`,
        formData
      );
      toast.success(
        response.data.message || "Return Sales Entry updated successfully!"
      );
    } else {
      const response = await axios.post(`${BASE_URL}/salesReturn`, formData);
      toast.success(
        response.data.message || "Return sales Entry created successfully!"
      );
    }
  } catch (error) {
    console.error("Error in Submitting Return Items(API) :", error);
  }
};

export const filterSalesReturn = async ({ fromDate, toDate }) => {
  try {
    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    console.log("Final params sent to API:", params);
    const response = await axios.get(`${BASE_URL}/salesReturn/search`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering Sales Return", error);
    return [];
  }
};
