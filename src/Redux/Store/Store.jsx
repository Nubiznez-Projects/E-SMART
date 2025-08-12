// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "../Slice/MasterModule/Customers/CustomerSlice";
import supplierReducer from "../Slice/MasterModule/Suppliers/SupplierSlice";
import rolesReducer from "../Slice/MasterModule/Roles/RoleSlice";
import purhcasePoReducer from "../Slice/PurchaseModule/PurchasePOSlice";
import purchaseGrnReducer from "../Slice/PurchaseModule/PurchaseGRNSlice";
import salesPoReducer from "../Slice/SalesModule/SalePOSlice";
import salesDcReducer from "../Slice/SalesModule/SalesDCSlice";
import SalesInvoiceReducer  from "../Slice/SalesModule/InvoiceSlice";
import purchaseBillEntry from "../Slice/PurchaseModule/PurchaseBillEntrySlice";
import salesReceipt from "../Slice/SalesModule/ReceiptSlice";
import employee from "../Slice/UserManagement/EmployeeSlice";
import ClientReducer from "../Slice/UserManagement/ClientSlice";
import salesReturn from "../Slice/SalesModule/SaleRtrnSlice";
import authReducer from "../Slice/Login/LoginSlice";
import purchaseReturnReducer from "../Slice/PurchaseModule/ReturnPurchaseSlice";
import requestList from "../Slice/RequestManagement/RequestSlice";
import subscriptionList from "../Slice/Subscription/SubscriptionSlice";


export const store = configureStore({
  reducer: {
    customers: customersReducer,
    supplier: supplierReducer,
    roles: rolesReducer,
    purchasingPo: purhcasePoReducer,
    purchaseingGRN: purchaseGrnReducer,
    salesPo: salesPoReducer,
    salesDC: salesDcReducer,
    salesInvoice: SalesInvoiceReducer,
    purchasingBillEntry: purchaseBillEntry,
    salesReceipt: salesReceipt,
    employee: employee,
    clients: ClientReducer,
    salesReturn: salesReturn,
    auth: authReducer,    
    purchaseReturn: purchaseReturnReducer,
    request: requestList,
    subscription: subscriptionList
  },
});
