import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { fetchNewcarservices } from "../../services/NewServices";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
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
}
interface Form {
  refFormDetails: string;
}

type DecryptResult = any;

const CarUpdate: React.FC<CarUpdateProps> = ({
  closeCarupdatesidebar,
  CarupdateID,
}) => {
  const [formData, setFormData] = useState<any>([]);
  const [_visible, setVisible] = useState(false);

  const [driver, setDriver] = useState<Driverdetails[]>([]);
  const [benefit, _setBenefit] = useState<Benefits[]>([]);
  const [include, _setInclude] = useState<Includes[]>([]);
  const [exclude, _setExclude] = useState<Excludes[]>([]);
  const [extra, _setExtra] = useState<Form[]>([]);
  const [_submitLoading, setSubmitLoading] = useState(false);
  const isFormSubmitting = false;

  const [selectesvechile, _setSelectedvechile] = useState<any[]>([]);
  const [selectedbenefits, setSelectedbenefits] = useState<any[]>([]);
  const [selectedinclude, setSelectedinclude] = useState<any[]>([]);
  const [selectedexclude, setSelectedexclude] = useState<any[]>([]);
  const [selectedform, setSelectedform] = useState<any[]>([]);
  const [_cabDetils, setCabDetails] = useState<any[]>([]);

  const [selectedDriver, setSelectedDriver] = useState<any[]>([]);

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
            Authorization: localStorage.getItem("JWTtoken"),
          },
        }
      );

      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      localStorage.setItem("JWTtoken", "Bearer " + data.token);
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

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataobject = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );
    console.log("formDataobject------------>handleform-------", formDataobject);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/addCars",
        {
          refVehicleTypeId: selectesvechile,
          refPersonCount: +formDataobject.refPersonCount,
          refBag: +formDataobject.refBag,
          refFuelType: formDataobject.refFuelType,
          refcarManufactureYear: +formDataobject.refcarManufactureYear,
          refMileage: +formDataobject.refMileage,
          refTrasmissionType: formDataobject.refTrasmissionType,
          refFuleLimit: formDataobject.refFuleLimit,
          refDriverDetailsId: selectedDriver,
          refOtherRequirements: formDataobject.refOtherRequirements,
          refrefRentalAgreement: formDataobject.refrefRentalAgreement,
          refFuelPolicy: formDataobject.refFuelPolicy,
          refDriverRequirements: formDataobject.refDriverRequirements,
          refPaymentTerms: formDataobject.refPaymentTerms,
          refBenifits: selectedbenefits.map((act) => act.refBenifitsId + ""),
          refInclude: selectedinclude.map((act) => act.refIncludeId + ""),
          refExclude: selectedexclude.map((act) => act.refExcludeId + ""),
          refFormDetails: selectedform.map((act) => act.refFormDetailsId + ""),
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
  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement> | { value: number | null },
    name?: string
  ) => {
    if ("target" in event) {
      // Handling for InputText
      const { name, value } = event.target;
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    } else if (name) {
      // Handling for InputNumber
      setFormData((prev: any) => ({ ...prev, [name]: event.value || 0 })); // Default to 0 if null
    }
  };
 useEffect(() => {
  fetchCardataForm();
  }, [CarupdateID]);


  const fetchCardataForm = async () => {
    
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/carsRoutes/getCars",
        {
          refCarsId:CarupdateID
          },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );
          console.log("response", response)
      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("data-------------->Updatecardata", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

      
      }
    } catch (e: any) {
      console.log("Error fetching Includes:", e);
    }
  };
  return (
    <div>
      <div>
        <h2 className="text-xl font-bold">Update New Car Package ID :{CarupdateID}</h2>
        <form onSubmit={handleUpdateSubmit} method="post">
          {/* Vechiletype  and Personcount */}
          <div className="flex flex-row gap-3 mt-3">
            <Dropdown
              // value={selectesvechile}
              // onChange={(e: DropdownChangeEvent) => {
              //   setSelectedvechile(e.value);
              //   fetchCarname();
              // }}
              // options={car}
              optionValue="refVehicleTypeId"
              optionLabel="refVehicleTypeName"
              placeholder="Choose a VechileType"
              className="w-full"
            />
            <InputNumber
              name="refPersonCount"
              placeholder="Enter Person Count"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* Noof bage  and FuelType */}
          <div className="flex flex-row gap-3 mt-3">
            <InputNumber
              name="refBag"
              placeholder="Enter No of Bags"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refFuelType"
              placeholder="Enter Fuel Type"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* ManufactureYear  and Mileage */}
          <div className="flex flex-row gap-3 mt-3">
            <InputNumber
              name="refcarManufactureYear"
              placeholder="Enter Manufacture Year"
              className="w-full"
              useGrouping={false}
              onChange={handleInput}
            />
            <InputNumber
              name="refMileage"
              placeholder="Enter Mileage"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* Transmissiontype  and FuelType */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refTrasmissionType"
              placeholder="Enter Transmission Type"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refFuleLimit"
              placeholder="Enter Fuel Limit"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* DriverDetailsId  and OtherRequirements */}
          <div className="flex flex-row gap-3 mt-3">
            <Dropdown
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
            />
            <InputText
              name="refOtherRequirements"
              placeholder="Enter Other Requirements"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* RentalAgreement  and Fuel Policy */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refrefRentalAgreement"
              placeholder="Enter RentalAgreement"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refFuelPolicy"
              placeholder="Enter Fuel Policy"
              className="w-full"
              onChange={handleInput}
            />
          </div>
          {/* DriverRequirements  and PaymentTerms */}
          <div className="flex flex-row gap-3 mt-3">
            <InputText
              name="refDriverRequirements"
              placeholder="Enter DriverRequirements"
              className="w-full"
              onChange={handleInput}
            />
            <InputText
              name="refPaymentTerms"
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
