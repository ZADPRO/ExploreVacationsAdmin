import { useState, useEffect, useRef, type FormEvent } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { TabView, TabPanel } from "primereact/tabview";
import axios from "axios";
import { Toast } from "primereact/toast";
import CryptoJS from "crypto-js";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DropdownChangeEvent } from "primereact/dropdown";
// import { RadioButton } from "primereact/radiobutton";
import AddForm from "../05-CarServices/AddForm";
import { addItemBaseOnKey } from "../../services/carservice";
// import { addNewcarpackage } from "../../services/NewCarService";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

import { FileUpload } from "primereact/fileupload";
import { fetchNewcarservices } from "../../services/NewServices";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";

import CarUpdate from "../../Pages/07-CarUpdate/CarUpdate";
import AddExtra from "./AddExtra";
interface Carname {
  createdAt: string;
  createdBy: string;
  refDummy1: null;
  refDummy2: null;
  refDummy3: null;
  refDummy4: null;
  refDummy5: null;
  refVehicleTypeId: number;
  refVehicleTypeName: string;
  updatedAt: null;
  updatedBy: null;
}

interface CarType {
  refCarTypeId: number;
  refCarTypeName: string;
}

interface Driverdetails {
  refDriverName: "";
  refDriverAge: "";
  refDriverMail: "";
  refDriverMobile: "";
  refDriverLocation: "";
  isVerified: true;
  refBenifitsName: "";
}
interface Benefits {
  refBenifitsName: string;
}

interface Includes {
  refIncludeName: string;
}
interface Excludes {
  refExcludeName: string;
}
interface Form {
  refFormDetails: string;
  refPrice: string;
}

type DecryptResult = any;

function transformArrayToObject(array: string[], key: string) {
  return {
    [key]: array.map((val) => ({ [key]: val })),
  };
}

const CarServices: React.FC = () => {
  const { t } = useTranslation("global");
  const [inputs, setInputs] = useState({
    refVehicleTypeName: "",
    refCarTypeId: "",
    refDriverName: "",
    refDriverAge: "",
    refDriverMail: "",
    refDriverMobile: "",
    refDriverLocation: "",
    isVerified: true,
    refBenifitsName: "",
    refAnswer: "",
    refIncludeName: "",
    refExcludeName: "",
    refVehicleTypeId: "",
    refPersonCount: "",
    refBag: "",
    refFuelType: "",
    refcarManufactureYear: "",
    refMileage: "",
    refTrasmissionType: "",
    refFuleLimit: "",
    refOtherRequirements: "",
    refTermsAndConditionsId: "",
    refrefRentalAgreement: "",
    refFuelPolicy: "",
    refCarPrice: "",
    refDriverRequirements: "",
    refPaymentTerms: "",
    refCarGroupName: "",
    refExtraKMcharges: "",
  });
  const [visible, setVisible] = useState(false);
  const [car, setCar] = useState<Carname[]>([]);
  const [group, setGroup] = useState<Carname[]>([]);
  const [carType, setCarType] = useState<CarType[]>([]);
  const [_driver, setDriver] = useState<Driverdetails[]>([]);
  const [benefit, setBenefit] = useState<Benefits[]>([]);
  const [include, setInclude] = useState<Includes[]>([]);
  const [exclude, setExclude] = useState<Excludes[]>([]);
  const [extra, setExtra] = useState<Form[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const isFormSubmitting = false;
  const [vechiletype, setVechileType] = useState<any[]>([]);
  const [selectesvechile, setSelectedvechile] = useState<any[]>([]);
  const [selectedCarType, setSelectedCarType] = useState<CarType | null>(null);
  const [selectedCarGroup, setSelectedCarGroup] = useState<any[]>([]);
  const [selectedbenefits, setSelectedbenefits] = useState<any[]>([]);
  const [selectedinclude, setSelectedinclude] = useState<any[]>([]);
  const [selectedexclude, setSelectedexclude] = useState<any[]>([]);
  const [selectedform, setSelectedform] = useState<any[]>([]);
  const [cabDetils, setCabDetails] = useState<any[]>([]);
  const [carupdatesidebar, setCarupdatesidebar] = useState(false);
  const [carupdateID, setCarupdateID] = useState("");

  const closeCarupdatesidebar = () => {
    setCarupdatesidebar(false);
  };

  const [visibleDialog, setVisibleDialog] = useState(false);

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  const showupdatemodel = false;
  const [editingRowGroup, setEditingRowGroup] = useState(null);
  const [editedValueGroup, setEditedValueGroup] = useState("");

  const [editingRowCars, setEditingRowCars] = useState(null);
  const [editedValueCars, setEditedValue] = useState("");
  const [_editDriverId, setEditDriverId] = useState<number | null>(null);
  // const [editDriverData, _setEditDriverData] = useState({
  //   refDriverDetailsId: "",
  //   refDriverName: "",
  //   refDriverAge: "",
  //   refDriverMail: "",
  //   refDriverMobile: "",
  //   refDriverLocation: "",
  //   isVerified: false,
  // });
  const [editBenefitId, setEditBenefitId] = useState<number | null>(null);
  const [editBenefitValue, setEditBenefitValue] = useState({
    refBenifitsId: "",
    refBenifitsName: "",
  });
  const [editIncludeId, setEditIncludeId] = useState<number | null>(null);
  const [editIncludeValue, setEditIncludeValue] = useState({
    refIncludeId: "",
    refIncludeName: "",
  });
  const [editExcludeId, setEditExcludeId] = useState<number | null>(null);
  const [editExcludeValue, setEditExcludeValue] = useState({
    refExcludeId: "",
    refExcludeName: "",
  });
  const [editExtraId, setEditExtraId] = useState<number | null>(null);
  const [editExtraValue, setEditExtraValue] = useState({
    refFormDetailsId: "",
    refFormDetails: "",
    refPrice: "",
  });
  const [formData, setFormData] = useState<any>([]);
  const toast = useRef<Toast>(null);

  // const [person, setPerson] = useState<any>([]);
  // const [bag, setBag] = useState<any>([]);
  // const [fuel, setFuel] = useState<any>([]);
  // const [manufacture, setManufacture] = useState<any>([]);
  // const [mileage, setMileage] = useState<any>([]);
  // const [transmisson, setTransmisson] = useState<any>([]);
  // const [fuellimit, setfuelLimit] = useState<any>([]);
  // const [driverId, setDriverId] = useState<any>([]);
  // const [otherrequirement, setotherrequirement] = useState<any>([]);
  // const [terms, setTerms] = useState<any>([]);
  // const [benefits, setBenefits] = useState<any>([]);
  // const [includes, setIncludes] = useState<any>([]);
  // const [excludes, setExcludes] = useState<any>([]);
  // const [formDats, setFormDatas] = useState<any>([]);
  // const [carsImg, setCarsImg] = useState<any>([]);

  console.log(vechiletype, formData, showupdatemodel);

  // const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputs((prevState) => ({
  //     ...prevState,
  //     [e.target.name]: e.target.value,
  //   }));
  // };

  const handleInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { value: number | null; originalEvent: Event }
  ) => {
    const { name, value } =
      "target" in e
        ? e.target
        : { name: "refPersonCount", value: e.value ?? 0 };

    setInputs((prevState) => ({
      ...prevState,
      [name]: value ?? 0,
    }));
  };

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

  // Car Type
  const fetchCarType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/getCarType",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("fetchCarType--------->", data);
        setCarType(data.Data);
        // setVechileType(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  const AddCarname = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/addVehicle",
        { refVehicleTypeName: inputs.refVehicleTypeName },
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

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchCarname(); // Refresh list
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
        // **Clear only the input field**
        setInputs((prevState) => ({
          ...prevState,
          refVehicleTypeName: "", // Reset this field only
        }));
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding car:", e);
      setSubmitLoading(false);
    }
  };

  //cargroup

  const AddCargrop = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/addCarGroup",
        { refCarGroupName: inputs.refCarGroupName },
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

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchCarname(); // Refresh list
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Added",
          life: 3000,
        });
        // **Clear only the input field**
        setInputs((prevState) => ({
          ...prevState,
          refCarGroupName: "", // Reset this field only
        }));
        fetchCargroup();
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Adding",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding car:", e);
      setSubmitLoading(false);
    }
  };

  const fetchCarname = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/listVehicle",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - list api - line 53", data);
        setCar(data.result);
        setVechileType(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  //cargroup

  const fetchCargroup = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/listCarGroup",
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
      console.log("data car details", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - setGroup", data);

        setGroup(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching setGroup:", e);
    }
  };

  //delete Car Name

  const deleteCarname = async (refVehicleTypeId: number) => {
    if (!refVehicleTypeId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteVehicle",
        { refVehicleTypeId }, // Correct payload
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
      console.log("Deleted -->", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchCarname(); // Refresh the list after deletion
        setVisibleDialog(false);
        setSelectedCarId(null);
      }
    } catch (e) {
      console.error("Error deleting car:", e);
      setSubmitLoading(false);
    }
  };
  //  const confirmDelete = (id: number) => {
  //     setSelectedCarId(id);
  //     setVisibleDialog(true);
  //   };
  // delete car group

  const deleteCargroup = async (refCarGroupId: number) => {
    if (!refCarGroupId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/deleteCarGroup",
        { refCarGroupId }, // Correct payload
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
      console.log("Deleted -->", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchCargroup(); // Refresh the list after deletion
        setVisibleDialog(false);
        setSelectedCarId(null);
      }
    } catch (e) {
      console.error("Error deleting car:", e);
      setSubmitLoading(false);
    }
  };

  const CarnameactionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editingRowCars === rowData.refVehicleTypeId ? (
          // Update Button (Visible when editing)
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => updateCarname()}
          />
        ) : (
          // Edit Button (Visible when not editing)
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditClick(rowData)}
          />
        )}

        {/* Delete Button (Always visible) */}
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          // onClick={() => deleteCarname(rowData.refVehicleTypeId)}
          onClick={() => {
            setSelectedCarId(rowData.refVehicleTypeId);
            setVisibleDialog(true);
          }}
        />
      </div>
    );
  };

  // cargroup

  const CarnameactionTemplateGroup = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editingRowGroup === rowData.refCarGroupId ? (
          // Update Button (Visible when editing)
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => updateCargroup()}
          />
        ) : (
          // Edit Button (Visible when not editing)
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditClickGroup(rowData)}
          />
        )}

        {/* Delete Button (Always visible) */}
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          // onClick={() => deleteCargroup(rowData.refCarGroupId)}
          onClick={() => {
            setSelectedCarId(rowData.refCarGroupId);
            setVisibleDialog(true);
          }}
        />
      </div>
    );
  };

  const fetchDriver = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/listDriverDetails",
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
      console.log("data-------------->Driver name", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        console.log("data - list api - line 53", data);
        setDriver(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };

  // delete Driver
  // const deleteDriver = async (refDriverDetailsId: number) => {
  //   if (!refDriverDetailsId) {
  //     console.error("Invalid data: Missing ID");
  //     return;
  //   }

  //   setSubmitLoading(true);

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/carsRoutes/deleteDriverDetails",
  //       { refDriverDetailsId }, // Correct payload
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("Deleted -->", data);

  //     setSubmitLoading(false);
  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       fetchDriver(); // Refresh the list after deletion
  //     }
  //   } catch (e) {
  //     console.error("Error deleting car:", e);
  //     setSubmitLoading(false);
  //   }
  // };
  // const driverActionTemplate = (rowData: any) => {
  //   return (
  //     <div className="flex gap-2">
  //       {editDriverId === rowData.refDriverDetailsId ? (
  //         // Update Button (Visible when editing)
  //         <Button
  //           label="Update"
  //           icon="pi pi-check"
  //           className="p-button-success p-button-sm"
  //           onClick={() => updateDriver()}
  //         />
  //       ) : (
  //         // Edit Button (Visible when not editing)
  //         <Button
  //           icon="pi pi-pencil"
  //           className="p-button-warning p-button-sm"
  //           onClick={() => handleEditDriverClick(rowData)}
  //         />
  //       )}

  //       {/* Delete Button (Always visible) */}
  //       <Button
  //         icon="pi pi-trash"
  //         className="p-button-danger p-button-sm"
  //         onClick={() => deleteDriver(rowData.refDriverDetailsId)}
  //       />
  //     </div>
  //   );
  // };

  // const driverActionTemplate = (rowData: any) => {
  //   return (
  //     <div className="flex gap-2">
  //       {editDriverId === rowData.refDriverDetailsId ? (
  //         // Update Button (Visible when editing)
  //         <Button
  //           label="Update"
  //           icon="pi pi-check"
  //           className="p-button-success p-button-sm"
  //           onClick={updateDriver}
  //         />
  //       ) : (
  //         // Edit Button (Visible when not editing)
  //         <Button
  //           icon="pi pi-pencil"
  //           className="p-button-warning p-button-sm"
  //           onClick={() => handleEditClick(rowData)}
  //         />
  //       )}

  //       {/* Delete Button (Always visible) */}
  //       <Button
  //         icon="pi pi-trash"
  //         className="p-button-danger p-button-sm"
  //         onClick={() => deleteDriver(rowData.refDriverDetailsId)}
  //       />
  //     </div>
  //   );
  // };

  const fetchBenefits = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/listBenifits",
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
      console.log("data-------------->benefits", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setBenefit(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };
  const fetchInclude = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/listInclude",
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
      console.log("data-------------->include$$$$$$$$$$$$$$$$", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setInclude(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching Includes:", e);
    }
  };
  const fetchExclude = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/listExclude",
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
      console.log("data-------------->exclude", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setExclude(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching exclude:", e);
    }
  };
  const fetchExtra = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/carsRoutes/listFormDetails",
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
      console.log("data-------------->carsRoutes/listFormDetails", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setExtra(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching extras:", e);
    }
  };

  const updateCarname = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/updateVehicle",
        {
          refVehicleTypeId: editingRowCars,
          refVehicleTypeName: editedValueCars,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      console.log("hloooooooooooooooooooooooooooo");

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      setSubmitLoading(false);
      console.log("updatecarname---------->", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditingRowCars(null);
        fetchCarname();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating Vechile",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding car:", e);
      setSubmitLoading(false);
    }
  };

  //updatr group

  const updateCargroup = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/newCarsRoutes/updateCarGroup",
        {
          refCarGroupId: editingRowGroup,
          refCarGroupName: editedValueGroup,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
      console.log("hloooooooooooooooooooooooooooo");

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      setSubmitLoading(false);
      console.log("updatecarname---------->", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditingRowGroup(null);
        fetchCargroup();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating Vechile",
          life: 3000,
        });
      }
    } catch (e) {
      console.log("Error adding car:", e);
      setSubmitLoading(false);
    }
  };

  // const handleEditDriverClick = (rowData: any) => {
  //   setEditDriverId(rowData.refDriverDetailsId);
  //   setEditDriverData({ ...rowData });
  // };

  // Handle input change
  // const handleDriverInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: string
  // ) => {
  //   setEditDriverData((prevData) => ({ ...prevData, [field]: e.target.value }));
  // };

  // Update driver details
  // const updateDriver = async () => {
  //   setSubmitLoading(true);

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/carsRoutes/updateDriverDetails",
  //       editDriverData,
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );

  //     setSubmitLoading(false);
  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       setEditDriverId(null);
  //       fetchDriver();
  //     }
  //   } catch (e) {
  //     console.error("Error updating driver:", e);
  //     setSubmitLoading(false);
  //     setEditDriverId(null);
  //   }
  // };

  // Action column template

  // const handleUpdate = (carData: any) => {
  //   setInputs((prevInputs) => ({
  //     ...prevInputs, // Keep existing properties
  //     refVehicleTypeId: carData.refVehicleTypeId,
  //     refVehicleTypeName: carData.refVehicleTypeName,
  //   }));
  //   setShowUpdateModal(true);
  // };

  useEffect(() => {
    fetchCarname();
    fetchDriver();
    fetchBenefits();
    fetchInclude();
    fetchExclude();
    fetchExtra();
    fetchCarType();
    fetchCargroup();
    fetchNewcarservices().then((result) => {
      setCabDetails(result);
    });
  }, []);

  const snoTemplate = (_rowData: Carname, options: { rowIndex: number }) => {
    return options.rowIndex + 1;
  };
  // function handleItem(values: string[], key: string) {
  //   if (values.length < 1) {
  //     return;
  //   }
  // }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setIsFormSubmitting(true);
    const formDataobject = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    console.log("formDataobject------------>handleform-------", formDataobject);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/addCars",
        {
          refVehicleTypeId: +selectesvechile,
          refCarTypeId: selectedCarType,
          refCarGroupId: selectedCarGroup,
          refPersonCount: formDataobject.refPersonCount,
          refBag: formDataobject.refBag,
          refExtraKMcharges: formDataobject.refExtraKMcharges,
          refFuelType: formDataobject.refFuelType,
          refcarManufactureYear: formDataobject.refcarManufactureYear,
          refMileage: formDataobject.refMileage,
          refTrasmissionType: formDataobject.refTrasmissionType,
          refFuleLimit: formDataobject.refFuleLimit,
          // refDriverDetailsId: +selectedDriver,
          refOtherRequirements: formDataobject.refOtherRequirements,
          refrefRentalAgreement: formDataobject.refrefRentalAgreement,
          refFuelPolicy: formDataobject.refFuelPolicy,
          // refDriverRequirements: formDataobject.refDriverRequirements,
          refPaymentTerms: formDataobject.refPaymentTerms,
          refCarPrice: formDataobject.refCarPrice,
          refBenifits: selectedbenefits.map((act) => act.refBenifitsId),
          refInclude: selectedinclude.map((act) => act.refIncludeId),
          refExclude: selectedexclude.map((act) => act.refExcludeId),
          refFormDetails: selectedform.map((act) => act.refFormDetailsId),
          carImagePath: formData.productImage,
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

      console.log("+++++++++++++++++++++=", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditDriverId(null);
        fetchNewcarservices().then((result) => {
          setCabDetails(result);
        });
        setVisible(false);
      }
    } catch (e) {
      console.error("Error updating driver:", e);
      setSubmitLoading(false);
      setEditDriverId(null);
    }

    // await addNewcarpackage(payload);
    // setIsFormSubmitting(false);
  };
  const handleEditClick = (rowData: any) => {
    setEditingRowCars(rowData.refVehicleTypeId);
    setEditedValue(rowData.refVehicleTypeName);
  };

  //car group

  const handleEditClickGroup = (rowData: any) => {
    setEditingRowGroup(rowData.refCarGroupId);
    setEditedValueGroup(rowData.refCarGroupName);
  };

  const carNameTemplate = (rowData: any) => {
    return editingRowCars === rowData.refVehicleTypeId ? (
      <InputText
        value={editedValueCars}
        onChange={(e) => setEditedValue(e.target.value)}
      />
    ) : (
      rowData.refVehicleTypeName
    );
  };

  // cargroup

  const carGroupTemplate = (rowData: any) => {
    return editingRowGroup === rowData.refCarGroupId ? (
      <InputText
        value={editedValueGroup}
        onChange={(e) => setEditedValueGroup(e.target.value)}
      />
    ) : (
      rowData.refCarGroupName
    );
  };

  // Handle edit button click
  const handleEditBenefitClick = (rowData: any) => {
    setEditBenefitId(rowData.refBenifitsId);
    setEditBenefitValue({ ...rowData });
  };

  // Handle input change
  const handleBenefitInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditBenefitValue((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  // Update benefit details
  const updateBenefit = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/updateBenifits",
        editBenefitValue,
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
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditBenefitId(null);
        fetchBenefits();
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating activity",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating benefit:", e);
      setSubmitLoading(false);
      setEditBenefitId(null);
    }
  };

  //Update Include

  // Handle Edit Button Click
  const handleEditIncludeClick = (rowData: any) => {
    setEditIncludeId(rowData.refIncludeId);
    setEditIncludeValue({ ...rowData });
  };

  // Handle Input Change
  const handleIncludeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditIncludeValue((prevData) => ({
      ...prevData,
      refIncludeName: e.target.value,
    }));
  };

  // Update API Call
  const updateInclude = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/updateInclude",
        editIncludeValue,
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
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditIncludeId(null);
        fetchInclude(); // Refresh list
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating Include",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating include:", e);
      setSubmitLoading(false);
      setEditIncludeId(null);
    }
  };

  // Update Exclude

  // Handle Edit Button Click
  const handleEditExcludeClick = (rowData: any) => {
    setEditExcludeId(rowData.refExcludeId);
    setEditExcludeValue({ ...rowData });
  };

  // Handle Input Change
  const handleExcludeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditExcludeValue((prevData) => ({
      ...prevData,
      refExcludeName: e.target.value, // Update the name in state
    }));
  };

  // Update Exclude API Call
  const updateExclude = async () => {
    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/UpdateExclude",
        editExcludeValue,
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
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setEditExcludeId(null); // Exit edit mode
        fetchExclude(); // Refresh the list
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Updated",
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While updating exclude",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating exclude:", e);
      setSubmitLoading(false);
      setEditExcludeId(null);
    }
  };

  // Update Extra

  // Handle Edit Button Click
  const handleEditExtraClick = (rowData: any) => {
    setEditExtraId(rowData.refFormDetailsId);
    setEditExtraValue({ ...rowData });
  };

  const handleExtraInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "refFormDetails" | "refPrice"
  ) => {
    const newValue = e.target.value;
    setEditExtraValue((prevData) => ({
      ...prevData,
      [field]: newValue,
    }));
  };

  const updateExtra = async () => {
    console.log("Updating with:", editExtraValue); // Debugging log

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/updateFormDetails",
        editExtraValue,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data); // Debugging line

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      setSubmitLoading(false);
      if (data.success) {
        console.log("Update successful");
        localStorage.setItem("token", "Bearer " + data.token);
        setEditExtraId(null); // Exit edit mode
        fetchExtra(); // Refresh the list
      } else {
        console.error("API update failed:", data);
      }
    } catch (e) {
      console.error("Error updating exclude:", e);
      setSubmitLoading(false);
      setEditExtraId(null);
    }
  };

  //delete Benefit

  const deleteBenefit = async (refBenifitsId: number) => {
    if (!refBenifitsId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteBenifits",
        { refBenifitsId }, // Correct payload
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
      console.log("Deleted -->", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchBenefits(); // Refresh the list after deletion
        setVisibleDialog(false);
        setSelectedCarId(null);
      }
    } catch (e) {
      console.error("Error deleting car:", e);
      setSubmitLoading(false);
    }
  };

  const benefitActionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editBenefitId === rowData.refBenifitsId ? (
          // Update Button (Visible when editing)
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => updateBenefit()}
          />
        ) : (
          // Edit Button (Visible when not editing)
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditBenefitClick(rowData)}
          />
        )}

        {/* Delete Button (Always visible) */}
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          // onClick={() => deleteBenefit(rowData.refBenifitsId)}
          onClick={() => {
            setSelectedCarId(rowData.refBenifitsId);
            setVisibleDialog(true);
          }}
        />
      </div>
    );
  };
  //delete include

  const deleteInclude = async (refIncludeId: number) => {
    if (!refIncludeId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteInclude",
        { refIncludeId }, // Correct payload
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
      console.log("Deleted -->", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchInclude(); // Refresh the list after deletion
      }
    } catch (e) {
      console.error("Error deleting car:", e);
      setSubmitLoading(false);
      setVisibleDialog(false);
      setSelectedCarId(null);
    }
  };

  const includeActionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editIncludeId === rowData.refIncludeId ? (
          // Update Button (Visible when editing)
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => updateInclude()}
          />
        ) : (
          // Edit Button (Visible when not editing)
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditIncludeClick(rowData)}
          />
        )}

        {/* Delete Button (Always visible) */}
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          // onClick={() => deleteInclude(rowData.refIncludeId)}
          onClick={() => {
            setSelectedCarId(rowData.refIncludeId);
            setVisibleDialog(true);
          }}
        />
      </div>
    );
  };

  //delete Exclude

  const deleteExclude = async (refExcludeId: number) => {
    if (!refExcludeId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteExclude",
        { refExcludeId }, // Correct payload
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
      console.log("Deleted -->", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchExclude(); // Refresh the list after deletion
        setVisibleDialog(false);
        setSelectedCarId(null);
      }
    } catch (e) {
      console.error("Error deleting car:", e);
      setSubmitLoading(false);
    }
  };

  const excludeActionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editExcludeId === rowData.refExcludeId ? (
          // Update Button (Visible when editing)
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => updateExclude()}
          />
        ) : (
          // Edit Button (Visible when not editing)
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditExcludeClick(rowData)}
          />
        )}

        {/* Delete Button (Always visible) */}
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          // onClick={() => deleteExclude(rowData.refExcludeId)}
          onClick={() => {
            setSelectedCarId(rowData.refExcludeId);
            setVisibleDialog(true);
          }}
        />
      </div>
    );
  };

  //delete Extra

  const deleteExtra = async (refFormDetailsId: number) => {
    if (!refFormDetailsId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteFormDetails",
        { refFormDetailsId }, // Correct payload
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
      console.log("Deleted -->", data);

      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchExtra(); // Refresh the list after deletion
        setVisibleDialog(false);
        setSelectedCarId(null);
      }
    } catch (e) {
      console.error("Error deleting car:", e);
      setSubmitLoading(false);
    }
  };
  const extraActionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editExtraId === rowData.refFormDetailsId ? (
          // Update Button (Visible when editing)
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={() => updateExtra()}
          />
        ) : (
          // Edit Button (Visible when not editing)
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditExtraClick(rowData)}
          />
        )}

        {/* Delete Button (Always visible) */}
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          // onClick={() => deleteExtra(rowData.refFormDetailsId)}
          onClick={() => {
            setSelectedCarId(rowData.refFormDetailsId);
            setVisibleDialog(true);
          }}
        />
      </div>
    );
  };

  // upload galary

  const customUploader = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }
    console.log("formData------------>", formData);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/uploadCars",

        formData,

        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("token", "Bearer " + data.token);
      console.log("data==============", data);

      if (data.success) {
        console.log("data+", data);
        handleUploadSuccess(data);
      } else {
        console.log("data-", data);
        handleUploadFailure(data);
      }
    } catch (error) {
      handleUploadFailure(error);
    }
  };

  const handleUploadSuccess = (response: any) => {
    console.log("Upload Successful:", response);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      productImage: response.filePath,
    }));
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  // const handleUpdateCar = async (editCarId: number, updatedCarDetails: any) => {
  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/carsRoutes/updateCars",
  //       {
  //         refCarsId: editCarId, // Ensure the correct ID is sent
  //         refVehicleTypeId: updatedCarDetails.refVehicleTypeId,
  //         refPersonCount: updatedCarDetails.refPersonCount,
  //         refBag: updatedCarDetails.refBag,
  //         refFuelType: updatedCarDetails.refFuelType,
  //         refcarManufactureYear: updatedCarDetails.refcarManufactureYear,
  //         refMileage: updatedCarDetails.refMileage,
  //         refTrasmissionType: updatedCarDetails.refTrasmissionType,
  //         refFuleLimit: updatedCarDetails.refFuleLimit,
  //         refBenifits: updatedCarDetails.refBenifits,
  //         refInclude: updatedCarDetails.refInclude,
  //         refExclude: updatedCarDetails.refExclude,
  //         refDriverDetailsId: updatedCarDetails.refDriverDetailsId,
  //         refTermsAndConditionsId: updatedCarDetails.refTermsAndConditionsId,
  //         refFormDetails: updatedCarDetails.refFormDetails,
  //         refOtherRequirements: updatedCarDetails.refOtherRequirements,
  //         carImage: updatedCarDetails.carImage, // Optional: Can be Base64 or File
  //       },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("token"),
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );
  //     console.log("Update car response:", data);

  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       // Update car list without re-fetching
  //       setCabDetails(
  //         cabDetils.map((car) =>
  //           car.refCarsId === editCarId ? { ...car, ...updatedCarDetails } : car
  //         )
  //       );

  //       // toast.success("Car details updated successfully!", {
  //       //   position: "top-right",
  //       //   autoClose: 3000,
  //       // });
  //     }
  //   } catch (error) {
  //     console.error("Error updating car:", error);
  //     // toast.error("Failed to update car details.");
  //   }
  // };

  const handleDeleteCar = async (refCarsId: any) => {
    console.log("id------->",refCarsId);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteCars",
        { refCarsId:refCarsId }, // Send the car ID to delete
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

      console.log("Delete car response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setVisibleDialog(false);
        setSelectedCarId(null);
        fetchNewcarservices().then((result) => {
          setCabDetails(result);
        });

        // toast.success("Car deleted successfully!", {
        //   position: "top-right",
        //   autoClose: 3000,
        // });
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      setVisibleDialog(false);
      setSelectedCarId(null);

      // toast.error("Failed to delete car.");
    }
  };

  const actionDelete = (rowData: any) => {
    console.log(rowData);

    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        onClick={() => {
          console.log(rowData.refCarsId);
          setSelectedCarId(rowData.refCarsId);
          setVisibleDialog(true);
        }}
      />
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{t("dashboard.Cab Rental")}</h2>
        <Button
          label={t("dashboard.Add Cab Rental")}
          severity="success"
          onClick={() => setVisible(true)}
        />
      </div>
      <div className="mt-3 p-2">
        <h3 className="text-lg font-bold">
          {t("dashboard.Added Car Package")}
        </h3>
        <DataTable
          value={cabDetils}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          scrollable
          scrollHeight="500px"
          rows={4}
        >
          <Column
            header={t("dashboard.SNo")}
            headerStyle={{ width: "3rem" }}
            body={(_, options) => options.rowIndex + 1}
          ></Column>

          <Column
            className="  text-[#0a5c9c] underline cursor-pointer  "
            header={t("dashboard.Car Name")}
            field="refVehicleTypeName"
            style={{ minWidth: "200px" }}
            body={(rowData) => (
              <div
                onClick={() => {
                  setCarupdateID(rowData.refCarsId);
                  setCarupdatesidebar(true);
                }}
              >
                {rowData.refVehicleTypeName}
              </div>
            )}
          ></Column>
          <Column
            field="refTrasmissionType"
            header={t("dashboard.Transmission Type")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refcarManufactureYear"
            header={t("dashboard.Manufacture Year")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refPersonCount"
            header={t("dashboard.Person Count")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refMileage"
            header={t("dashboard.Mileage")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refCarPrice"
            header={t("dashboard.Car Price")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refFuleLimit"
            header={t("dashboard.Fuel Limit")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refFuelType"
            header={t("dashboard.Fuel Type")}
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refBagCount"
            header={t("dashboard.Bag Count")}
            style={{ minWidth: "200px" }}
          ></Column>
          {/* Action Buttons Column */}
          <Column
            header={t("dashboard.Actions")}
            body={actionDelete}
            // body={(rowData) => (
            //   <div style={{ display: "flex", gap: "8px" }}>
                
            //     <button
            //       // onClick={() => actionDelete(rowData.refCarsId)}
            //       style={{
            //         background: "#dc3545",
            //         color: "#fff",
            //         border: "none",
            //         padding: "5px 10px",
            //         cursor: "pointer",
            //         borderRadius: "4px",
            //       }}

            //     >
            //       Delete
            //     </button>
            //   </div>
            // )}
            style={{ minWidth: "150px" }}
          />
        </DataTable>
        <Dialog
          header="Confirm Deletion"
          visible={visibleDialog}
          style={{ width: "350px" }}
          modal
          onHide={() => setVisibleDialog(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button
                label="No"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setVisibleDialog(false)}
              />
              <Button
                label="Yes"
                icon="pi pi-check"
                className="p-button-danger"
                // loading={submitLoading}
                onClick={() => {
                  if (selectedCarId !== null) {
                    console.log(selectedCarId);
                    handleDeleteCar(selectedCarId);
                  }
                  setVisibleDialog(false);
                }}
              />
            </div>
          }
        >
          <p>Are you sure you want to delete this item?</p>
        </Dialog>
      </div>

      <Sidebar
        visible={visible}
        style={{ width: "70%" }}
        onHide={() => setVisible(false)}
        position="right"
      >
        <Toast ref={toast} />
        <h2 className="text-xl font-bold mb-4">
          {t("dashboard.Add Cab Rental")}
        </h2>
        <p className="text-sm text-[#f60000] mt-3">{t("dashboard.warning")}</p>
        <TabView>
          <TabPanel header={t("dashboard.Car Details")}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 items-center">
                <h2 className="text-lg font-bold">
                  {t("dashboard.Add Car Name")}:
                </h2>
                <div className=" flex flex-row gap-5 justify-between">
                  <InputText
                    name="refVehicleTypeName"
                    value={inputs.refVehicleTypeName}
                    onChange={handleInput}
                    placeholder={t("dashboard.Enter Car Name")}
                    className="p-inputtext-sm w-[50%]"
                  />
                  <div>
                    <Button
                      label={
                        submitLoading
                          ? t("dashboard.Adding")
                          : t("dashboard.Add Car Name")
                      }
                      icon="pi pi-check"
                      className="p-button-primary"
                      onClick={AddCarname}
                      disabled={submitLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-lg font-bold">
                  {t("dashboard.Added Cars")}
                </h3>
                <DataTable value={car} className="p-datatable-sm mt-2">
                  <Column
                    field="refVehicleTypeId"
                    header={t("dashboard.SNo")}
                    body={(_rowData, { rowIndex }) => rowIndex + 1}
                    style={{ width: "10%", color: "#0a5c9c" }}
                  />
                  <Column
                    field="refVehicleTypeName"
                    header={t("dashboard.Car Name")}
                    body={carNameTemplate}
                    style={{ color: "#0a5c9c" }}
                  />
                  <Column
                    body={CarnameactionTemplate}
                    header={t("dashboard.Actions")}
                  />
                </DataTable>
                <Dialog
                  header="Confirm Deletion"
                  visible={visibleDialog}
                  style={{ width: "350px" }}
                  onHide={() => setVisibleDialog(false)}
                  footer={
                    <div className="flex justify-end gap-2">
                      <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={() => setVisibleDialog(false)}
                      />
                      <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-danger"
                        loading={submitLoading}
                        onClick={() => {
                          if (selectedCarId !== null) {
                            deleteCarname(selectedCarId);
                          }
                          setVisibleDialog(false);
                        }}
                      />
                    </div>
                  }
                >
                  <p>Are you sure you want to delete this banner?</p>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-5">
              <div className="flex flex-col gap-3 items-center">
                <h2 className="text-lg font-bold">
                  {t("dashboard.Add Car Group")}:
                </h2>
                <div className=" flex flex-row gap-3 justify-between">
                  <InputText
                    name="refCarGroupName"
                    value={inputs.refCarGroupName}
                    onChange={handleInput}
                    placeholder={t("dashboard.Enter Car Group Name")}
                    className="p-inputtext-sm w-[50%]"
                  />
                  <div>
                    <Button
                      label={
                        submitLoading
                          ? t("dashboard.Adding")
                          : t("dashboard.Add Car Group")
                      }
                      icon="pi pi-check"
                      className="p-button-primary"
                      onClick={AddCargrop}
                      disabled={submitLoading}
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-lg font-bold">
                  {t("dashboard.Added Cars Group")}
                </h3>
                <DataTable value={group} className="p-datatable-sm mt-2">
                  <Column
                    field="refCarGroupId"
                    header="S.No"
                    body={(_rowData, { rowIndex }) => rowIndex + 1}
                    style={{ width: "10%", color: "#0a5c9c" }}
                  />
                  <Column
                    field="refCarGroupName"
                    header={t("dashboard.Car Group Name")}
                    body={carGroupTemplate}
                    style={{ color: "#0a5c9c" }}
                  />
                  <Column
                    body={CarnameactionTemplateGroup}
                    header={t("dashboard.Actions")}
                  />
                </DataTable>
                <Dialog
                  header="Confirm Deletion"
                  visible={visibleDialog}
                  style={{ width: "350px" }}
                  onHide={() => setVisibleDialog(false)}
                  footer={
                    <div className="flex justify-end gap-2">
                      <Button
                        label="No"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={() => setVisibleDialog(false)}
                      />
                      <Button
                        label="Yes"
                        icon="pi pi-check"
                        className="p-button-danger"
                        loading={submitLoading}
                        onClick={() => {
                          if (selectedCarId !== null) {
                            deleteCargroup(selectedCarId);
                          }
                          setVisibleDialog(false);
                        }}
                      />
                    </div>
                  }
                >
                  <p>Are you sure you want to delete this banner?</p>
                </Dialog>
              </div>
            </div>
          </TabPanel>

          {/* <TabPanel header="Driver Details">
            <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center justify-center gap-4 w-[60%] sm:w-full p-4 ">
                <h3 className="font-bold text-lg">Add Driver Details:</h3>

               
                <div className="flex flex-row w-[70%] gap-4 sm:w-full">
                  <InputText
                    name="refDriverName"
                    value={inputs.refDriverName}
                    onChange={handleInput}
                    placeholder="Enter Driver Name"
                    className="p-inputtext-sm w-full"
                    required
                  />
                  <InputText
                    name="refDriverAge"
                    value={inputs.refDriverAge}
                    onChange={handleInput}
                    placeholder="Enter Age"
                    className="p-inputtext-sm w-full"
                    required
                  />
                </div>

            
                <div className="flex flex-row w-[70%] gap-4 sm:w-full">
                  <InputText
                    name="refDriverMail"
                    value={inputs.refDriverMail}
                    onChange={handleInput}
                    placeholder="Enter Mail ID"
                    className="p-inputtext-sm w-full"
                    required
                  />
                  <InputText
                    name="refDriverMobile"
                    value={inputs.refDriverMobile}
                    onChange={handleInput}
                    placeholder="Enter Mobile number"
                    className="p-inputtext-sm w-full"
                    required
                  />
                </div>

             
                <div className="w-[70%] sm:w-full">
                  <InputText
                    name="refDriverLocation"
                    value={inputs.refDriverLocation}
                    onChange={handleInput}
                    placeholder="Enter Location"
                    required
                    className="p-inputtext-sm w-full"
                  />
                </div>

                
                <div className="flex flex-row items-center gap-4 w-[70%] sm:w-full mt-3">
                  <h3 className="font-semibold">Verification:</h3>
                  <div className="flex items-center">
                    <RadioButton
                      inputId="verifiedYes"
                      name="isVerified"
                      value={true}
                      onChange={(e) =>
                        setInputs({ ...inputs, isVerified: e.value })
                      }
                      checked={inputs.isVerified === true}
                    />
                    <label htmlFor="verifiedYes" className="ml-2">
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center">
                    <RadioButton
                      inputId="verifiedNo"
                      name="isVerified"
                      value={false}
                      onChange={(e) =>
                        setInputs({ ...inputs, isVerified: e.value })
                      }
                      checked={inputs.isVerified === false}
                    />
                    <label htmlFor="verifiedNo" className="ml-2">
                      No
                    </label>
                  </div>
                </div>

            
                <div className="mt-4">
                  <Button
                    label={submitLoading ? "Adding..." : "Add Details"}
                    icon="pi pi-check"
                    className="p-button-primary w-full"
                    onClick={AddDriver}
                    disabled={submitLoading}
                  />
                </div>
              </div>

              <div className="">
                <h3 className="text-lg font-bold">Added Driver Details</h3>
                <DataTable value={driver} className="p-datatable-sm mt-2">
                  <Column
                    body={snoTemplate}
                    header="S.No"
                    style={{ width: "10%", color: "#0a5c9c" }}
                  />
                  <Column
                    field="refDriverName"
                    header="Driver Name"
                    body={(rowData) =>
                      editDriverId === rowData.refDriverDetailsId ? (
                        <InputText
                          value={editDriverData.refDriverName}
                          onChange={(e) =>
                            handleDriverInputChange(e, "refDriverName")
                          }
                        />
                      ) : (
                        rowData.refDriverName
                      )
                    }
                  />

                  <Column
                    field="refDriverAge"
                    header="Age"
                    body={(rowData) =>
                      editDriverId === rowData.refDriverDetailsId ? (
                        <InputText
                          value={editDriverData.refDriverAge}
                          onChange={(e) =>
                            handleDriverInputChange(e, "refDriverAge")
                          }
                        />
                      ) : (
                        rowData.refDriverAge
                      )
                    }
                  />

                  <Column
                    field="refDriverMail"
                    header="Email"
                    body={(rowData) =>
                      editDriverId === rowData.refDriverDetailsId ? (
                        <InputText
                          value={editDriverData.refDriverMail}
                          onChange={(e) =>
                            handleDriverInputChange(e, "refDriverMail")
                          }
                        />
                      ) : (
                        rowData.refDriverMail
                      )
                    }
                  />

                  <Column
                    field="refDriverMobile"
                    header="Mobile"
                    body={(rowData) =>
                      editDriverId === rowData.refDriverDetailsId ? (
                        <InputText
                          value={editDriverData.refDriverMobile}
                          onChange={(e) =>
                            handleDriverInputChange(e, "refDriverMobile")
                          }
                        />
                      ) : (
                        rowData.refDriverMobile
                      )
                    }
                  />

                  <Column
                    field="refDriverLocation"
                    header="Location"
                    body={(rowData) =>
                      editDriverId === rowData.refDriverDetailsId ? (
                        <InputText
                          value={editDriverData.refDriverLocation}
                          onChange={(e) =>
                            handleDriverInputChange(e, "refDriverLocation")
                          }
                        />
                      ) : (
                        rowData.refDriverLocation
                      )
                    }
                  />

                  <Column body={driverActionTemplate} header="Actions" />
                </DataTable>
              </div>
            </div>
          </TabPanel> */}
          <TabPanel header={t("dashboard.Other Details")}>
            <div className="flex flex-col gap-4">
              <h3>{t("dashboard.Additional Details")}:</h3>
              <div className="flex flex-col gap-4">
                {/* Card 1 */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">{t("dashboard.Benefits")}</h4>
                  <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) {
                        return;
                      }
                      addItemBaseOnKey(
                        transformArrayToObject(values, "refBenifitsName"),
                        "benefits"
                      ).then((result) => {
                        fetchBenefits();
                        console.log(result);
                      });
                    }}
                  />

                  <DataTable value={benefit} className="p-datatable-sm mt-2">
                    <Column
                      body={snoTemplate}
                      header="S.No"
                      style={{ width: "10%", color: "#0a5c9c" }}
                    />

                    <Column
                      field="refBenifitsName"
                      header={t("dashboard.Benefits")}
                      body={(rowData) =>
                        editBenefitId === rowData.refBenifitsId ? (
                          <InputText
                            value={editBenefitValue.refBenifitsName}
                            onChange={(e) =>
                              handleBenefitInputChange(e, "refBenifitsName")
                            }
                          />
                        ) : (
                          rowData.refBenifitsName
                        )
                      }
                    />

                    <Column
                      body={benefitActionTemplate}
                      header={t("dashboard.Actions")}
                    />
                  </DataTable>
                  <Dialog
                    header="Confirm Deletion"
                    visible={visibleDialog}
                    style={{ width: "350px" }}
                    modal
                    onHide={() => setVisibleDialog(false)}
                    footer={
                      <div className="flex justify-end gap-2">
                        <Button
                          label="No"
                          icon="pi pi-times"
                          className="p-button-text"
                          onClick={() => setVisibleDialog(false)}
                        />
                        <Button
                          label="Yes"
                          icon="pi pi-check"
                          className="p-button-danger"
                          loading={submitLoading}
                          onClick={() => {
                            if (selectedCarId) {
                              deleteBenefit(selectedCarId);
                            }
                            setVisibleDialog(false);
                          }}
                        />
                      </div>
                    }
                  >
                    <p>Are you sure you want to delete this item?</p>
                  </Dialog>
                </div>

                {/* Card 2 */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">{t("dashboard.Include")}</h4>

                  <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) {
                        return;
                      }
                      addItemBaseOnKey(
                        transformArrayToObject(values, "refIncludeName"),
                        "includes"
                      ).then((result) => {
                        fetchInclude();
                        console.log(result);
                        {
                          /* Display fetch call */
                        }
                      });
                    }}
                  />
                  <DataTable value={include} className="p-datatable-sm mt-2">
                    <Column
                      body={snoTemplate}
                      header="S.No"
                      style={{ width: "10%", color: "#0a5c9c" }}
                    />

                    <Column
                      field="refIncludeName"
                      header={t("dashboard.Include")}
                      body={(rowData) =>
                        editIncludeId === rowData.refIncludeId ? (
                          <InputText
                            value={editIncludeValue.refIncludeName}
                            onChange={handleIncludeInputChange}
                          />
                        ) : (
                          rowData.refIncludeName
                        )
                      }
                    />

                    <Column
                      body={includeActionTemplate}
                      header={t("dashboard.Actions")}
                    />
                  </DataTable>
                  <Dialog
                    header="Confirm Deletion"
                    visible={visibleDialog}
                    style={{ width: "350px" }}
                    modal
                    onHide={() => setVisibleDialog(false)}
                    footer={
                      <div className="flex justify-end gap-2">
                        <Button
                          label="No"
                          icon="pi pi-times"
                          className="p-button-text"
                          onClick={() => setVisibleDialog(false)}
                        />
                        <Button
                          label="Yes"
                          icon="pi pi-check"
                          className="p-button-danger"
                          loading={submitLoading}
                          onClick={() => {
                            if (selectedCarId) {
                              deleteInclude(selectedCarId);
                            }
                            setVisibleDialog(false);
                          }}
                        />
                      </div>
                    }
                  >
                    <p>Are you sure you want to delete this item?</p>
                  </Dialog>
                </div>

                {/* Card 3 */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">{t("dashboard.Exclude")}</h4>

                  <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) {
                        return;
                      }
                      addItemBaseOnKey(
                        transformArrayToObject(values, "refExcludeName"),
                        "excludes"
                      ).then((result) => {
                        fetchExclude();
                        console.log(result);
                      });
                    }}
                  />
                  <DataTable value={exclude} className="p-datatable-sm mt-2">
                    <Column
                      body={snoTemplate}
                      header="S.No"
                      style={{ width: "10%", color: "#0a5c9c" }}
                    />

                    <Column
                      field="refExcludeName"
                      header={t("dashboard.Exclude")}
                      body={(rowData) =>
                        editExcludeId === rowData.refExcludeId ? (
                          <InputText
                            value={editExcludeValue.refExcludeName}
                            onChange={handleExcludeInputChange}
                          />
                        ) : (
                          rowData.refExcludeName
                        )
                      }
                    />

                    <Column
                      body={excludeActionTemplate}
                      header={t("dashboard.Actions")}
                    />
                  </DataTable>
                  <Dialog
                    header="Confirm Deletion"
                    visible={visibleDialog}
                    style={{ width: "350px" }}
                    modal
                    onHide={() => setVisibleDialog(false)}
                    footer={
                      <div className="flex justify-end gap-2">
                        <Button
                          label="No"
                          icon="pi pi-times"
                          className="p-button-text"
                          onClick={() => setVisibleDialog(false)}
                        />
                        <Button
                          label="Yes"
                          icon="pi pi-check"
                          className="p-button-danger"
                          loading={submitLoading}
                          onClick={() => {
                            if (selectedCarId) {
                              deleteExclude(selectedCarId);
                            }
                            setVisibleDialog(false);
                          }}
                        />
                      </div>
                    }
                  >
                    <p>Are you sure you want to delete this item?</p>
                  </Dialog>
                </div>

                {/* Card 4 */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">
                    {t("dashboard.Extra Charges")}
                  </h4>

                  {/* <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) {
                        return;
                      }
                      addItemBaseOnKey(
                        transformArrayToObject(values, "refFormDetails"),
                        "form"
                      ).then((result) => {
                        fetchExtra();
                        console.log(result);
                      });
                    }}
                  /> */}
                  <AddExtra
                    submitCallback={(values) => {
                      if (values.length < 1) return;

                      values.forEach((entry) => {
                        addItemBaseOnKey(entry, "form").then((result) => {
                          fetchExtra();
                          console.log(result);
                        });
                      });
                    }}
                  />

                  <DataTable value={extra} className="p-datatable-sm mt-2">
                    <Column
                      body={snoTemplate}
                      header="S.No"
                      style={{ width: "10%", color: "#0a5c9c" }}
                    />

                    <Column
                      field="refFormDetails"
                      header={t("dashboard.Extra Charges")}
                      body={(rowData) =>
                        editExtraId === rowData.refFormDetailsId ? (
                          <InputText
                            value={editExtraValue.refFormDetails}
                            onChange={(e) =>
                              handleExtraInputChange(e, "refFormDetails")
                            }
                          />
                        ) : (
                          rowData.refFormDetails
                        )
                      }
                    />

                    <Column
                      field="refPrice"
                      header={t("dashboard.Price")}
                      body={(rowData) =>
                        editExtraId === rowData.refFormDetailsId ? (
                          <InputText
                            value={editExtraValue.refPrice}
                            onChange={(e) =>
                              handleExtraInputChange(e, "refPrice")
                            }
                          />
                        ) : (
                          rowData.refPrice
                        )
                      }
                    />

                    <Column
                      body={extraActionTemplate}
                      header={t("dashboard.Actions")}
                    />
                  </DataTable>
                  <Dialog
                    header="Confirm Deletion"
                    visible={visibleDialog}
                    style={{ width: "350px" }}
                    modal
                    onHide={() => setVisibleDialog(false)}
                    footer={
                      <div className="flex justify-end gap-2">
                        <Button
                          label="No"
                          icon="pi pi-times"
                          className="p-button-text"
                          onClick={() => setVisibleDialog(false)}
                        />
                        <Button
                          label="Yes"
                          icon="pi pi-check"
                          className="p-button-danger"
                          loading={submitLoading}
                          onClick={() => {
                            if (selectedCarId) {
                              deleteExtra(selectedCarId);
                            }
                            setVisibleDialog(false);
                          }}
                        />
                      </div>
                    }
                  >
                    <p>Are you sure you want to delete this item?</p>
                  </Dialog>
                </div>

                {/* Card 5 
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">Terms and Condition</h4>

                  <DataTable value={benefit} className="p-datatable-sm mt-2">
                    <Column
                      body={snoTemplate}
                      header="S.No"
                      style={{ width: "10%", color: "#0a5c9c" }}
                    />

                    <Column field="refBenifitsName" header="Benefits" />

                    <Column body={extraActionTemplate} header="Actions" />
                  </DataTable>
                </div>*/}
              </div>
            </div>
          </TabPanel>

          <TabPanel header={t("dashboard.Add New Services")}>
            <div>
              <h2 className="text-xl font-bold">
                {t("dashboard.Add New Car Package")}
              </h2>
              <form onSubmit={handleSubmit} method="post">
                <div className="flex flex-row gap-3 mt-3">
                  <Dropdown
                    value={selectesvechile}
                    onChange={(e: DropdownChangeEvent) => {
                      setSelectedvechile(e.value);
                      fetchCarname();
                    }}
                    options={car}
                    optionValue="refVehicleTypeId"
                    optionLabel="refVehicleTypeName"
                    placeholder="Choose a Car Name"
                    className="w-full"
                    required
                  />
                  <Dropdown
                    value={selectedCarType}
                    onChange={(e: DropdownChangeEvent) => {
                      setSelectedCarType(e.value);
                      fetchCarType();
                    }}
                    options={carType}
                    optionValue="refCarTypeId"
                    optionLabel="refCarTypeName"
                    placeholder="Choose Car Type"
                    className="w-full"
                    required
                  />
                  <Dropdown
                    value={selectedCarGroup}
                    onChange={(e: DropdownChangeEvent) => {
                      setSelectedCarGroup(e.value);
                      fetchCargroup();
                    }}
                    options={group}
                    optionValue="refCarGroupId"
                    optionLabel="refCarGroupName"
                    placeholder="Choose Car Group"
                    className="w-full"
                    required
                  />
                  {/* <Dropdown
                    value={selectedCarType}
                    onChange={(e: DropdownChangeEvent) =>
                      setSelectedCarType(e.value)
                    }
                    options={carType}
                    optionLabel="refCarTypeName"
                     optionValue="refCarTypeId"
                    placeholder="Choose Car Type"
                    className="w-full"
                  /> */}
                </div>
                {/* Noof bage  and FuelType */}
                <div className="flex flex-row gap-3 mt-3">
                  <InputText
                    name="refPersonCount"
                    placeholder="Enter Person Count"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />

                  <InputText
                    name="refFuelType"
                    placeholder="Enter Fuel Type"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                </div>
                {/* ManufactureYear  and Mileage */}
                <div className="flex flex-row gap-3 mt-3">
                  <InputText
                    name="refcarManufactureYear"
                    placeholder="Enter Manufacture Year"
                    className="w-full"
                    // useGrouping={false}
                    onChange={handleInput}
                    required
                  />
                  <InputText
                    name="refMileage"
                    placeholder="Enter Mileage"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                  <InputText
                    name="refExtraKMcharges"
                    placeholder="Enter Extra charges"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                </div>
                {/* Transmissiontype  and FuelType */}
                <div className="flex flex-row gap-3 mt-3">
                  <InputText
                    name="refTrasmissionType"
                    placeholder="Enter Transmission Type"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                  <InputText
                    name="refFuleLimit"
                    placeholder="Enter Fuel Limit"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                </div>
                {/* DriverDetailsId  and Carprice */}
                <div className="flex flex-row gap-3 mt-3">
                  {/* <Dropdown
                    value={selectedDriver}
                    onChange={(e: DropdownChangeEvent) => {
                      console.log("-------", e.value);
                      setSelectedDriver(e.value);
                      fetchDriver();
                    }}
                    options={driver}
                    optionValue="refDriverDetailsId"
                    optionLabel="refDriverName"
                    placeholder="Choose a DriverDetails"
                    className="w-full"
                    required
                  /> */}
                  <InputText
                    name="refBag"
                    placeholder="Enter No of Bags"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />

                  <InputText
                    name="refCarPrice"
                    placeholder="Enter Car Price"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                </div>
                {/*OtherRequirements */}
                {/* <div className="flex flex-row gap-3 mt-3">
                
                </div> */}
                {/* RentalAgreement  and Fuel Policy */}
                <div className="flex flex-row gap-3 mt-3">
                  <InputText
                    name="refrefRentalAgreement"
                    placeholder="Enter RentalAgreement"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                  <InputText
                    name="refFuelPolicy"
                    placeholder="Enter Fuel Policy"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                </div>
                {/* DriverRequirements  and PaymentTerms */}
                <div className="flex flex-row gap-3 mt-3">
                  {/* <InputText
                    name="refDriverRequirements"
                    placeholder="Enter DriverRequirements"
                    className="w-full"
                    onChange={handleInput}
                    required
                  /> */}
                  <InputText
                    name="refOtherRequirements"
                    placeholder="Enter Other Requirements"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                  <InputText
                    name="refPaymentTerms"
                    placeholder="Enter PaymentTerms"
                    className="w-full"
                    onChange={handleInput}
                    required
                  />
                </div>

                {/* TermsAndConditionsId
                <div className="flex  gap-3 mt-3">
                  <InputText
                    name="refTermsAndConditionsId"
                    placeholder="Enter Terms and Condition"
                    className="w-full"
                    onChange={handleInput}
                  />
                </div> */}
                {/* Benifits  and  Include*/}
                <div className="flex flex-row w-[100%] gap-3 mt-3">
                  <MultiSelect
                    value={selectedbenefits}
                    onChange={(e) => {
                      console.log(e.value);
                      setSelectedbenefits(e.value);
                    }}
                    options={benefit}
                    optionLabel="refBenifitsName"
                    display="chip"
                    placeholder="Select Benefits"
                    maxSelectedLabels={3}
                    className="w-full md:w-25rem"
                    required
                  />
                  <MultiSelect
                    value={selectedinclude}
                    onChange={(e) => {
                      setSelectedinclude(e.value);
                    }}
                    options={include}
                    optionLabel="refIncludeName"
                    display="chip"
                    placeholder="Select include"
                    maxSelectedLabels={3}
                    className="w-full md:w-25rem"
                    required
                  />
                </div>

                {/* Exclude  and  FormDetails*/}
                <div className="flex flex-row w-[100%] gap-3 mt-3">
                  <MultiSelect
                    value={selectedexclude}
                    onChange={(e) => {
                      console.log(e.value);
                      setSelectedexclude(e.value);
                    }}
                    options={exclude}
                    optionLabel="refExcludeName"
                    display="chip"
                    placeholder="Select Exculde"
                    maxSelectedLabels={3}
                    className="w-full md:w-25rem"
                    required
                  />
                  <MultiSelect
                    value={selectedform}
                    onChange={(e) => {
                      setSelectedform(e.value);
                    }}
                    options={extra}
                    optionLabel="refFormDetails"
                    display="chip"
                    placeholder="Select FormDetails"
                    maxSelectedLabels={3}
                    className="w-full md:w-25rem"
                    required
                  />
                </div>
                <div className="flex flex-col justify-center w-[100%] align-middle mt-4">
                  <FileUpload
                    name="logo"
                    customUpload
                    className="mt-3"
                    uploadHandler={customUploader}
                    accept="image/*"
                    maxFileSize={10000000}
                    emptyTemplate={
                      <p className="m-0">{t("dashboard.imagewarning")}</p>
                    }
                  />
                  {" "}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    label={t("dashboard.Submit")}
                    loading={isFormSubmitting}
                  />
                </div>
              </form>
            </div>
          </TabPanel>
        </TabView>
      </Sidebar>
      <Sidebar
        visible={carupdatesidebar}
        style={{ width: "50%" }}
        onHide={() => setCarupdatesidebar(false)}
        position="right"
      >
        <CarUpdate
          closeCarupdatesidebar={closeCarupdatesidebar}
          CarupdateID={carupdateID}
        />
      </Sidebar>
    </div>
  );
};

export default CarServices;
