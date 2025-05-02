import React, { useEffect, useState,useRef } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { Toast } from "primereact/toast";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type DecryptResult = any;

interface categories {
  refCategoryId: number;
  refCategoryName: string;
}

const Categories: React.FC = () => {
  const decrypt = (
    encryptedData: string,
    iv: string,
    key: string
  ): DecryptResult => {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  const [submitLoading, setSubmitLoading] = useState(false);
  const [inputs, setInputs]: any = useState({ refCategory: "" });
  const [categories, setCategories] = useState<categories[]>([]);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const toast = useRef<Toast>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const AddCategories = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/addCategories",
        {
          refCategory: inputs.refCategory,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      setSubmitLoading(false);
      console.log("data----------->categories");
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data----------->", data);
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
        setInputs({ refCategory: "" });
        fetchCategories();
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding Category",
          life: 3000,
        });
      }
    } catch (e: any) {
      console.log(e);
      setSubmitLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/settingRoutes/listCategories",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - list api - line 53", data);
        setCategories(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching categories:", e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const snoTemplate = (_rowData: categories, options: { rowIndex: number }) => {
    return options.rowIndex + 1;
  };

  const handleEditActivityClick = (rowData: categories) => {
    console.log("____>", rowData.refCategoryId);
    setEditCategoryId(rowData.refCategoryId); // Ensure correct ID is used
    setEditCategoryValue(rowData.refCategoryName);
  };

  const handleActivityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditCategoryValue(e.target.value);
  };

  const updateCategory = async () => {
    if (!editCategoryValue.trim()) {
      toast.current?.show({
        severity: "error",
        detail: "category name cannot be empty!",
        life: 3000,
      });
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/updateCategories",
        {
          refCategoryId: editCategoryId, // Ensure correct ID is sent
          refCategoryName: editCategoryValue, // Ensure correct field name
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("Update activity response:", data);

      setSubmitLoading(false);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setCategories(
          categories.map((activity) =>
            activity.refCategoryId === editCategoryId
              ? { ...activity, refCategoryName: editCategoryValue }
              : activity
          )
        );

        // Reset edit state
        setEditCategoryId(null);
        setEditCategoryValue("");
        fetchCategories();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Updated",
          life: 3000,
        });

      }
      else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Updating Category",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating activity:", e);
      setSubmitLoading(false);
      setEditCategoryId(null);
    }
  };

  const deleteCategory = async (refCategoryId: number) => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/settingRoutes/deleteCategories",
        { refCategoryId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("Delete activity response:", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setCategories(
          categories.filter(
            (activity) => activity.refCategoryId !== refCategoryId
          )
        );
      }
    } catch (e) {
      console.error("Error deleting activity:", e);
      setSubmitLoading(false);
    }
  };
  const actionTemplate = (rowData: categories) => (
    <div className="flex gap-2">
      {editCategoryId === rowData.refCategoryId ? (
        <Button
          label="Update"
          icon="pi pi-check"
          className="p-button-success p-button-sm"
          onClick={updateCategory}
        />
      ) : (
        <Button
          icon="pi pi-pencil"
          className="p-button-warning p-button-sm"
          onClick={() => handleEditActivityClick(rowData)}
        />
      )}
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => deleteCategory(rowData.refCategoryId)}
      />
    </div>
  );

  return (
    <>
      <div>
      <Toast ref={toast} />
        <h2 className="text-xl font-bold text-[#0a5c9c] mb-3">
          Add New Categories
        </h2>
        <div className="mb-3">
          <InputText
            name="refCategory"
            value={inputs.refCategory}
            onChange={handleInput}
            placeholder="Enter Categories"
            className="p-inputtext-sm w-full"
          />
        </div>
        <Button
          label={submitLoading ? "Adding..." : "Add Categories"}
          icon="pi pi-check"
          className="p-button-primary"
          onClick={AddCategories}
          disabled={submitLoading}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Added Categories</h3>
        <DataTable value={categories} className="p-datatable-sm mt-2">
          <Column
            body={snoTemplate}
            header="S.No"
            style={{ width: "10%", color: "#0a5c9c" }}
          />
          <Column
            field="refCategoryName"
            style={{ color: "#0a5c9c" }}
            header="Categories Name"
            body={(rowData) => (
              <>
                {editCategoryId === rowData.refCategoryId ? (
                  <InputText
                    value={editCategoryValue}
                    onChange={handleActivityInputChange}
                  />
                ) : (
                  <>{rowData.refCategoryName}</>
                )}
              </>
            )}
          />
          <Column body={actionTemplate} header="Actions" />
        </DataTable>
      </div>
    </>
  );
};

export default Categories;
