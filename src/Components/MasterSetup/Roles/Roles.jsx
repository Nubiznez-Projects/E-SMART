import React, { useEffect, useState } from "react";
import { ConfigProvider, Table } from "antd";
import "../../../App.css";
import RoleCard from "./RoleCard";
import CreateRole from "./CreateRole";
import { HiOutlinePlusSm } from "react-icons/hi";
import { fetchRoles } from "../../../Redux/Slice/MasterModule/Roles/RoleThunks";
import { useDispatch, useSelector } from "react-redux";
import { getByIDRoles } from "../../../API/MasterModule/Roles";
import tickIcon from "../../../assets/tick.png";
import crossIcon from "../../../assets/cross.png";
import DeleteModal from "../../Common/Modal/Delete/DeleteModal";
import DeleteList from "../../Common/Delete/DeleteComponent";

export default function Roles() {
  const [cardName, setCardName] = useState();
  const [addRoleModal, setAddRoleModal] = useState(false);
  const { role } = useSelector((state) => state.roles || {});
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [roleID, setRoleID] = useState("R-001");
  const [deleteRoleModal, setDeleteRoleModal] = useState(false);
  const apiUrl = "http://192.168.6.77:8092/api";

  const ALL_MODULES = [
    "Purchase",
    "Sales",
    "Master",
    "DataAnalytics",
    "User Management",
  ];

  const columns = [
    {
      title: <span className="font-medium text-[1vw] ">Modules</span>,
      dataIndex: "module",
      width: "20vw",
      align: "center",
      //sorter: (a, b) => a.role?.localeCompare(b.module),
      render: (module) => <span className="text-[0.85vw]">{module}</span>,
    },
    {
      title: <span className="font-medium text-[1vw]">Sub Modules</span>,
      dataIndex: "submodules",
      width: "27vw",
      align: "center",
      //sorter: (a, b) => a.role?.localeCompare(b.module),
      render: (list) => (
        <span className="text-[0.85vw]">
          {Array.isArray(list) && list.length > 0 ? list.join(", ") : "—"}
        </span>
      ),
    },
    {
      title: <span className=" font-medium text-[1vw]">Create</span>,
      dataIndex: "create",
      width: "15vw",
      align: "center",
      render: (val) => (
        <span className="flex items-center justify-center">
          <img
            className="h-[1vw] w-[1vw]"
            src={val === "true" ? tickIcon : crossIcon}
          />
        </span>
      ),
    },
    {
      title: <span className=" font-medium text-[1vw]">Edit</span>,
      dataIndex: "edit",
      width: "15vw",
      align: "center",
      render: (val) => (
        <span className="flex items-center justify-center">
          <img
            className="h-[1vw] w-[1vw]"
            src={val === "true" ? tickIcon : crossIcon}
          />
        </span>
      ),
    },
    {
      title: <span className=" font-medium text-[1vw]">View</span>,
      dataIndex: "view",
      width: "15vw",
      align: "center",
      render: (val) => (
        <span className="flex items-center justify-center">
          <img
            className="h-[1vw] w-[1vw]"
            src={val === "true" ? tickIcon : crossIcon}
          />
        </span>
      ),
    },
    {
      title: <span className=" font-medium text-[1vw]">Delete</span>,
      dataIndex: "delete",
      width: "15vw",
      align: "center",
      render: (val) => (
        <span className="flex items-center justify-center">
          <img
            className="h-[1vw] w-[1vw]"
            src={val === "true" ? tickIcon : crossIcon}
          />
        </span>
      ),
    },
  ];

  const ChangeCardName = (card) => {
    const name = card;
    setCardName(name);
  };

  const transformBySubModules = (roleData) => {
    if (
      !roleData ||
      typeof roleData.SubModulePermissions !== "object" ||
      !Array.isArray(roleData.Permissions)
    ) {
      return [];
    }

    const submodules = roleData.SubModulePermissions;
    const permissions = roleData.Permissions.map((p) => p.toLowerCase().trim());

    return ALL_MODULES.map((moduleName) => {
      const hasModule = Object.hasOwn(submodules, moduleName);
      const moduleSubList = hasModule ? submodules[moduleName] : [];

      return {
        key: moduleName,
        module: moduleName,
        submodules: moduleSubList.length > 0 ? moduleSubList : "__",
        create: hasModule && permissions.includes("create") ? "true" : "false",
        edit: hasModule && permissions.includes("edit") ? "true" : "false",
        view: hasModule && permissions.includes("view") ? "true" : "false",
        delete: hasModule && permissions.includes("delete") ? "true" : "false",
      };
    });
  };

  const fetchRoleById = async (roleID) => {
    try {
      const response = await getByIDRoles(roleID);

      if (response) {
        const role = response;
        const rows = transformBySubModules(role); // 👈 from earlier answer
        setCardName(role?.RoleName);
        setTableData(rows); // ✅ Set the table data
      }
    } catch (error) {
      console.error("Error getting roles", error);
    }
  };

  const closeModal = () => {
    setAddRoleModal(false);
    setDeleteRoleModal(false);
  };

  useEffect(() => {
    if (roleID) {
      fetchRoleById(roleID);
    }
  }, [roleID]);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (selectedRole) {
      const transformed = transformBySubModules(selectedRole);
      setTableData(transformed);
    }
  }, [selectedRole]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && role && role?.length > 0) {
      setRoleID(role[0]?.RoleId);
      setInitialized(true);
    }
  }, [role, initialized]);

  console.log("Render: list =", tableData?.RoleName);

  return (
    <>
      <div className="text-[1vw] font-semibold mt-[1vh]">ROLES</div>

      <RoleCard
        ChangeCardName={ChangeCardName}
        setSelectedRole={setSelectedRole}
        setRoleID={setRoleID}
        setTableData={setTableData}
        list={role}
        setAddModal={setAddRoleModal}
        setDeleteRoleModal={setDeleteRoleModal}
      />

      <p className="mt-[2vw] text-[1vw] font-semibold ">
        PERMISSIONS - {cardName?.toUpperCase()}
      </p>
      <div className="relative flex ">
        <div className="mt-[0.4vw]">
          <ConfigProvider
            theme={{
              components: {
                Table: {
                  rowHoverBg: "rgb(255, 255, 255, 0)",
                  rowSelectedBg: "rgb(255, 255, 255, 0)",
                  rowSelectedHoverBg: "rgb(255, 255, 255, 0)",
                  borderRadius: "2vw",
                  shadowHover: "0 0.5vw 1vw rgba(0, 0, 0, 0.15)",
                },
              },
            }}
          >
            <Table
              columns={columns}
              pagination={false}
              dataSource={tableData}
              rowClassName={(record, index) => `custom-row-${index}`}
            />
          </ConfigProvider>
        </div>
      </div>

      <DeleteModal
        show={addRoleModal}
        width={"45vw"}
        height="auto"
        onClose={() => setAddRoleModal(false)}
        closeicon={false}
      >
        <div className="flex px-[0.5vw] py-[1vw]">
          <CreateRole roleID={roleID} closeModal={closeModal} />
        </div>
      </DeleteModal>

      <DeleteModal
        show={deleteRoleModal}
        width={"29vw"}
        height={"20vw"}
        onClose={() => setDeleteRoleModal(false)}
        closeicon={false}
      >
        <DeleteList
          setDeleteModalIsOpen={setDeleteRoleModal}
          title={`Want to delete this ${roleID}`}
          api={`${apiUrl}/roles/${roleID}`}
          module={"roles"}
          // filter={filter}
          // setPermission={setPermission}
        />
      </DeleteModal>
    </>
  );
}
