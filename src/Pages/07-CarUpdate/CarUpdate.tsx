import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

import { FormEvent, useEffect, useState, useRef } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { fetchNewcarservices } from "../../services/NewServices";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { FileUpload } from "primereact/fileupload";
import { decryptAPIResponse } from "../../utils";
interface CarUpdateProps {
  closeCarupdatesidebar: () => void;
  CarupdateID: string;
}
// interface Carname {
//   createdAt: string;
//   createdBy: string;
//   refDummy1: null;
//   refDummy2: null;
//   refDummy3: null;
//   refDummy4: null;
//   refDummy5: null;
//   refVehicleTypeId: number;
//   refVehicleTypeName: string;
//   updatedAt: null;
//   updatedBy: null;
// }

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
  Exclude: string;
}
interface Form {
  refFormDetails: string;
}
interface Carname {
  createdAt: string;
  createdBy: string;
  refVehicleTypeId: number;
  refVehicleTypeName: string;
}
interface CarType {
  refCarTypeId: number;
  refCarTypeName: string;
}

interface CarDetails {
  refVehicleTypeId: number;
  refCarsId: number;
  refPersonCount: string;
  refVehicleTypeName: string;
  refBag: string;
  refFuelType: string;
  refcarManufactureYear: string;
  refMileage: string;
  refTrasmissionType: string;
  refCarTypeName:string;
  refFuleLimit: string;
  refCarTypeId: number;
  refOtherRequirements: string;
  refRentalAgreement: string;
  refFuelPolicy: string;
  refCarPrice: string;
  refPaymentTerms: string;
  Benifits: string[]; // assuming strings; change type if different
  Include: string[]; // assuming strings
  Exclude: string[]; // assuming strings
  refFormDetails: any[]; // use a proper type instead of `any` if known
  carImagePath: {
    filename: string;
    contentType: string;
    content: string;
  } | null;
}

type DecryptResult = any;

const CarUpdate: React.FC<CarUpdateProps> = ({
  closeCarupdatesidebar,
  CarupdateID,
}) => {
  const [_visible, setVisible] = useState(false);
  const [car, setCar] = useState<Carname[]>([]);
    const [carType, setCarType] = useState<CarType[]>([]);
  const [_vechiletype, setVechileType] = useState<any[]>([]);
  const [_driver, setDriver] = useState<Driverdetails[]>([]);
  const [benefit, setBenefit] = useState<Benefits[]>([]);
  const [include, setInclude] = useState<Includes[]>([]);
  const [exclude, setExclude] = useState<Excludes[]>([]);
  const toast = useRef<Toast>(null);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const isFormSubmitting = false;
  const [formDataObject, setFormDataobject] = useState<CarDetails>({
    refVehicleTypeId: 0,
    refCarsId: 0,
    refPersonCount: "",
    refCarTypeName:"",
    refVehicleTypeName: "",
    refBag: "",
    refCarPrice: "",
    refFuelType: "",
    refcarManufactureYear: "",
    refMileage: "",
    refTrasmissionType: "",
    refFuleLimit: "",
    refCarTypeId: 0,
    refOtherRequirements: "",
    refRentalAgreement: "",
    refFuelPolicy: "",
    refPaymentTerms: "",
    Benifits: [],
    Include: [],
    Exclude: [],
    refFormDetails: [],
    carImagePath: { filename: "", contentType: "", content: "" },
  });
  
  const [formDataImage, setFormDataImage] = useState<any>([]);
  const [_selectesvechile, _setSelectedvechile] = useState<any[]>([]);
  const [_editStaffId, setEditStaffId] = useState<number | null>(null);
  const [_cabDetils, setCabDetails] = useState<any[]>([]);
  const [extra, setExtra] = useState<Form[]>([]);


  const [_editDriverId, setEditDriverId] = useState<number | null>(null);

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
       }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
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

  // const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const formDataObject = Object.fromEntries(
  //     new FormData(e.target as HTMLFormElement)
  //   );
  //   console.log("formDataObject------------>handleform-------", formDataObject);

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/carsRoutes/updateCars",
  //       {
  //         refCarsId: +CarupdateID,
  //         refVehicleTypeId: +selectesvechile,
  //         refPersonCount: formDataObject.refPersonCount,
  //         refBag: formDataObject.refBag,
  //         refFuelType: formDataObject.refFuelType,
  //         refcarManufactureYear: formDataObject.refcarManufactureYear,
  //         refMileage: formDataObject.refMileage,
  //         refTrasmissionType: formDataObject.refTrasmissionType,
  //         refFuleLimit: formDataObject.refFuleLimit,
  //         refDriverDetailsId: +selectedDriver,
  //         refOtherRequirements: formDataObject.refOtherRequirements,
  //         refRentalAgreement: formDataObject.refRentalAgreement,
  //         refFuelPolicy: formDataObject.refFuelPolicy,
  //         refDriverRequirements: formDataObject.refDriverRequirements,
  //         refPaymentTerms: formDataObject.refPaymentTerms,
  //         // refBenifits: selectedbenefits.map((act) => act.refBenifitsId + ""),
  //         // refInclude: selectedinclude.map((act) => act.refIncludeId + ""),
  //         // refExclude: selectedexclude.map((act) => act.refExcludeId + ""),
  //         // refFormDetails: selectedform.map((act) => act.refFormDetailsId + ""),
  //         refBenifits: formDataObject.Benifits,
  //         refInclude: formDataObject.Include,
  //         refExclude: formDataObject.Exclude,
  //         refFormDetails: formDataObject.refFormDetails,
  //         // carImagePath: formData.productImage,
  //         carImagePath:
  //           formData === ""
  //             ? formDataObject.carImagePath?.filename ?? ""
  //             : formData,
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

  //     console.log("+++++++++++++++++++++=", data);

  //     setSubmitLoading(false);
  //     if (data.success) {
  //       localStorage.setItem("token", "Bearer " + data.token);
  //       setEditDriverId(null);
  //       fetchNewcarservices().then((result) => {
  //         setCabDetails(result);
  //       });
  //       setVisible(false);
  //     }
  //   } catch (e) {
  //     console.error("Error updating driver:", e);
  //     setSubmitLoading(false);
  //     setEditDriverId(null);
  //   }

  //   // await addNewcarpackage(payload);
  //   // setIsFormSubmitting(false);
  // };

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();



    try {
      // // Create a properly typed carImagePath value
      // let carImagePathValue;

      // if (formData === "") {
      //   // Check if carImagePath exists and has the filename property
      //   if (
      //     formDataObject.carImagePath &&
      //     "filename" in formDataObject.carImagePath
      //   ) {
      //     carImagePathValue = formDataObject.carImagePath.filename;
      //   } else {
      //     carImagePathValue = "";
      //   }
      // } else {
      //   carImagePathValue = formData;
      // }

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/updateCars",
        {
          refCarsId: +CarupdateID,
          refVehicleTypeId: +formDataObject.refVehicleTypeId,
          refCarTypeId: +formDataObject.refCarTypeId,
          refPersonCount: formDataObject.refPersonCount,
          refBag: formDataObject.refBag,
          refFuelType: formDataObject.refFuelType,
          refCarPrice:formDataObject.refCarPrice,
          refcarManufactureYear: formDataObject.refcarManufactureYear,
          refMileage: formDataObject.refMileage,
          refTrasmissionType: formDataObject.refTrasmissionType,
          refFuleLimit: formDataObject.refFuleLimit,
          refOtherRequirements: formDataObject.refOtherRequirements,
          refRentalAgreement: formDataObject.refRentalAgreement,
          refFuelPolicy: formDataObject.refFuelPolicy,
          refPaymentTerms: formDataObject.refPaymentTerms,
          refBenifits: formDataObject.Benifits,
          refInclude: formDataObject.Include,
          refExclude: formDataObject.Exclude,
          refFormDetails: formDataObject.refFormDetails,
          carImagePath: formDataImage===""? formDataObject.carImagePath?.filename ?? "":formDataImage,
         
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
        console.log("Car Name----------->", data);
        setCar(data.result);
       
        setVechileType(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching destinations:", e);
    }
  };
  useEffect(() => {
    fetchSingleIDCardataForm();
    fetchDriver();
    fetchCarname();
    fetchExtra();
    fetchBenefits();
    fetchInclude();
    fetchExclude();
    fetchCarType();
  }, [CarupdateID]);

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
      console.log("data-------------->extra", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setExtra(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching extras:", e);
    }
  };
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
        console.log("data line 44444444444444==================", data);

        console.log("data.result line 445================", data.result);
        setExclude(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching exclude:", e);
    }
  };

  const fetchSingleIDCardataForm = async () => {
    console.log("Fetching data for car update ID:", CarupdateID);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/getCars",
        {
          refCarsId: CarupdateID,
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

      if (data.success) {
        console.log("fetchSingleIDCardataForm----------->", data);
        const carDetails = data.result[0];

        // Set form data object with fetched data
        setFormDataobject({
          refCarTypeId: +carDetails.refCarTypeId,
          refCarsId: +carDetails.refCarsId,
          refVehicleTypeId: +carDetails.refVehicleTypeId,
          refPersonCount: carDetails.refPersonCount || "",
          refBag: carDetails.refBagCount || "",
          refVehicleTypeName: carDetails.refVehicleTypeName || "",
          refCarTypeName: carDetails.refCarTypeName || "",
          refFuelType: carDetails.refFuelType || "",
          refcarManufactureYear: carDetails.refcarManufactureYear || "",
          refMileage: carDetails.refMileage || "",
          refCarPrice: carDetails.refCarPrice || "",
          refTrasmissionType: carDetails.refTrasmissionType || "",
          refFuleLimit: carDetails.refFuleLimit || "",
          refOtherRequirements: carDetails.refOtherRequirements || "",
          refRentalAgreement: carDetails.refRentalAgreement || "",
          refFuelPolicy: carDetails.refFuelPolicy || "",
          refPaymentTerms: carDetails.refPaymentTerms || "",
          Benifits: carDetails.Benifits || [],
          Include: carDetails.Include || [],
          Exclude: carDetails.Exclude || [],
          refFormDetails: carDetails.refFormDetails || [],
          // refFormDetails:// carDetails.refFormDetails||[],

          // carDetails.refFormDetails.slice(1,  carDetails.refFormDetails.length - 1).split(",").map(v => parseInt(v))
          carImagePath: carDetails.refCarPath || null,
        });
      }
    } catch (e) {
      console.error("Error fetching car data:", e);
    }
  };

  useEffect(() => {
    console.log("Formdatacheck------>", formDataObject);
  }, [formDataObject]);

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement> | { value: number | null },
    name?: string
  ) => {
    if ("target" in event) {
      const { name, value } = event.target;
      setFormDataobject((prev) => ({ ...prev, [name]: value }));
    } else if (name) {
      setFormDataobject((prev) => ({ ...prev, [name]: event.value || 0 }));
    }
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   await fetchSingleIDCardataForm();

  //   await handleUpdateSubmit(e);
  // };

  //delete image

  //delete parking image
  const deleteCarimage = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/deleteCarImage",
        {
          refCarsId: id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("API Response:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully Deleted",
          life: 3000,
        });
      } else {
        console.error("API update failed:", data);
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Deleting ",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error updating package:", e);
      setSubmitLoading(false);
      setEditStaffId(null);
    }
  };

  const customUploader = async (event: any) => {
    console.table("event", event);
    const file = event.files[0];
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    if (file) {
      setFormDataImage(file);
    }

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
    // setFormData((prevFormData: any) => ({
    //   ...prevFormData,
    //   productImage: response.filePath,
    // }));
setFormDataImage(response.filePath);

  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">
          Update New Car Package ID :{CarupdateID}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateSubmit(e);
          }}
          className="mt-4"
        >
          <div className="flex flex-row gap-3 mt-3">
           

           <Dropdown
              value={formDataObject.refVehicleTypeId}
              onChange={(e: DropdownChangeEvent) => {

                console.log("valuee--------",e.value)
                setFormDataobject((prev) => ({
                  ...prev,
                  refVehicleTypeId: e.value,
                }));
              }}
              optionValue="refVehicleTypeId"
              optionLabel="refVehicleTypeName"
              placeholder="Choose a Vehicle Type"
              className="w-full"
              options={car}
            /> 

            <Dropdown
              value={formDataObject.refCarTypeId}
              
              onChange={(e: DropdownChangeEvent) => {
                  console.log("valuee--------",e.value)
                setFormDataobject((prev) => ({
                  ...prev,
                  refCarTypeId: e.value,
                }));
              }}
              optionValue="refCarTypeId"
              optionLabel="refCarTypeName"
              placeholder="Choose a Car Type"
              className="w-full"
              options={carType}
              
            /> 
            
            </div>
             <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refPersonCount"
              value={formDataObject.refPersonCount}
              placeholder="Enter Person Count"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refFuelType"
              value={formDataObject.refFuelType}
              placeholder="Enter Fuel Type"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* Noof bage  and FuelType */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refBag"
              value={formDataObject.refBag}
              placeholder="Enter No of Bags"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refCarPrice"
              value={formDataObject.refCarPrice}
              placeholder="Enter Car Price"
              className="w-full"
              onChange={handleInput}
            />
            
          </div>
          {/* ManufactureYear  and Mileage */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refcarManufactureYear"
              value={formDataObject.refcarManufactureYear}
              placeholder="Enter Manufacture Year"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refMileage"
              value={formDataObject.refMileage}
              placeholder="Enter Mileage"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* Transmissiontype  and FuelType */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refTrasmissionType"
              value={formDataObject.refTrasmissionType}
              placeholder="Enter Transmission Type"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refFuleLimit"
              value={formDataObject.refFuleLimit}
              placeholder="Enter Fuel Limit"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* DriverDetailsId  and OtherRequirements */}
          {/* <div className="flex flex-row gap-3 mt-3">
            <Dropdown
              value={formDataObject.refDriverDetailsId}
              onChange={(e: DropdownChangeEvent) => {
                setFormDataobject((prev) => ({
                  ...prev,
                  refDriverDetailsId: e.value,
                }));
              }}
              options={driver}
              optionValue="refDriverDetailsId"
              optionLabel="refDriverName"
              placeholder="Choose a Driver Name"
              className="w-full"
            />
            <InputText
              name="refOtherRequirements"
              value={formDataObject.refOtherRequirements}
              placeholder="Enter Other Requirements"
              className="w-full"
              onChange={handleInput}
            />
          </div> */}
          {/* RentalAgreement  and Fuel Policy */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refRentalAgreement"
              value={formDataObject.refRentalAgreement}
              placeholder="Enter RentalAgreement"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refFuelPolicy"
              value={formDataObject.refFuelPolicy}
              placeholder="Enter Fuel Policy"
              className="w-full"
              onChange={handleInput}
            />
          </div>

          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refOtherRequirements"
              value={formDataObject.refOtherRequirements}
              placeholder="Enter Other Requirements"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refPaymentTerms"
              value={formDataObject.refPaymentTerms}
              placeholder="Enter PaymentTerms"
              className="w-full"
              onChange={handleInput}
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
              value={formDataObject.Benifits}
              onChange={(e) => {
                setFormDataobject((prev) => ({
                  ...prev,
                  Benifits: e.value,
                }));
              }}
              options={benefit}
              optionValue="refBenifitsId"
              optionLabel="refBenifitsName"
              display="chip"
              placeholder="Select Benefits"
              maxSelectedLabels={1}
              className="w-full md:w-25rem"
            />
            <MultiSelect
              value={formDataObject.Include}
              onChange={(e) => {
                setFormDataobject((prev) => ({
                  ...prev,
                  Include: e.value,
                }));
              }}
              options={include}
              optionValue="refIncludeId"
              optionLabel="refIncludeName"
              display="chip"
              placeholder="Select include"
              maxSelectedLabels={1}
              className="w-full md:w-25rem"
            />
          </div>

          {/* Exclude  and  FormDetails*/}
          <div className="flex flex-row w-[100%] gap-3 mt-3">
            <MultiSelect
              value={formDataObject.Exclude}
              onChange={(e) => {
                setFormDataobject((prev) => ({
                  ...prev,
                  Exclude: e.value,
                }));
              }}
              options={exclude}
              optionValue="refExcludeId"
              optionLabel="refExcludeName"
              display="chip"
              placeholder="Select Exculde"
              maxSelectedLabels={1}
              className="w-full md:w-25rem"
            />
            <MultiSelect
              value={formDataObject.refFormDetails}
              onChange={(e) => {
                 setFormDataobject((prev) => ({
                  ...prev,
                  refFormDetails: e.value,
                }));
              }}
              options={extra}
              optionValue="refFormDetailsId"
              optionLabel="refFormDetails"
              display="chip"
              placeholder="Select FormDetails"
              maxSelectedLabels={1}
              className="w-full md:w-25rem"
            />
          </div>
          <div className="w-[30%] h-[30%] relative">
            {formDataObject?.carImagePath && (
              <>
                <img
                  src={`data:${formDataObject.carImagePath.contentType};base64,${formDataObject.carImagePath.content}`}
                  alt="Car Image"
                  className="w-full h-full object-cover rounded-lg"
                />
                +
                <button
                  type="button"
                  onClick={() => {
                    console.log(
                      "Deleting image for ID:",
                      formDataObject.refCarsId
                    );
                    deleteCarimage(formDataObject.refCarsId);
                                  
                  }}
                  className="absolute top-1 right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-2 h-6 flex items-center justify-center hover:bg-red-600"
                  title="Remove Image"
                >
                  &times;
                </button>
              </>
            )}
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
                <p className="m-0">Drag and drop your Image here to upload.</p>
              }
            />
            {" "}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={closeCarupdatesidebar}
              type="submit"
              label="Submit"
              loading={isFormSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarUpdate;
