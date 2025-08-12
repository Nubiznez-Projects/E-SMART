import axios from "axios";
import { fetchCustomers } from "../Redux/Slice/MasterModule/Customers/CustomerThunks";
import { fetchRoles } from "../Redux/Slice/MasterModule/Roles/RoleThunks"; // adjust imports as needed
import { toast } from "react-toastify";
import { fetchEmployee } from "../Redux/Slice/UserManagement/EmployeeThunk";
import { fetchSalesPo } from "../Redux/Slice/SalesModule/SalePOThunk";
import { fetchSalesReturn } from "../Redux/Slice/SalesModule/SaleRtrnThunk";
import { fetchPurchasePo } from "../Redux/Slice/PurchaseModule/PurchasePOThunk";
import { fetchReturnPO } from "../Redux/Slice/PurchaseModule/ReturnPurchaseThunk";
import { fetchSuppliers } from "../Redux/Slice/MasterModule/Suppliers/SupplierThunks";

export const Deleteall = async (
  api,
  dispatch,
  module,
  filter,
  setPermission,
  CurrentTab,
  listType
) => {
  try {
    const response = await axios.delete(api);

    switch (module) {
      case "customer":
        dispatch(fetchCustomers());
        break;
      case "roles":
        dispatch(fetchRoles());
        break;
      case "Employee":
        dispatch(fetchEmployee());
        break;
      case "clients":
        dispatch(fetchClient());
        break;
         case "SalePo":
        dispatch(fetchSalesPo());
        break;
         case "SalesReturn":
        dispatch(fetchSalesReturn());
        break;
         case "PurchasePO":
        dispatch(fetchPurchasePo());
        break;
         case "PurchaseReturn":
        dispatch(fetchReturnPO());
        break;
         case "supplier":
        dispatch(fetchSuppliers());
        break;
      default:
        break;
    }

    toast.success(response.data.message || "Deleted successfully");
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.error || // custom error message
      error.response?.data?.message || // fallback if backend uses 'message'
      "Failed to delete. Please try again."; // default message

    toast.error(errorMsg);
    throw error;
  }
};
