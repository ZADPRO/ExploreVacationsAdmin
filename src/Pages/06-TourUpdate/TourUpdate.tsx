import CryptoJS from "crypto-js";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "primereact/button";

import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { decryptAPIResponse } from "../../utils";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { FileUpload } from "primereact/fileupload";
interface Destination {
  refDestinationId: string;
  refDestinationName: string;
}
interface Includes {
  refTravalInclude: string;
}
interface Excludes {
  refTravalExclude: string;
}
interface Location {
  refDestinationId: string;
  refLocationName: string;
  refLocationId: number;
}

interface TourPacakge {
  refPackageId: "";
  refPackageName: "";
  refDurationIday: "";
  refDesignationId: "";
  refDurationINight: "";
  refCategoryId: "";
  refGroupSize: "";
  refTourCode: "";
  refTourPrice: "";
  refSeasonalPrice: "";
  refTravalDataId: "";
  refTravalOverView: "";
  refItinary: "";
  refItinaryMapPath: "";
  refTravalInclude: "";
  refTravalExclude: "";
  refSpecialNotes: "";
  refLocation: "";
  Activity: "";
}

interface TourUpdateProps {
  closeTourupdatesidebar: () => void;
  tourupdateID: string;
}

type DecryptResult = any;
const TourUpdate: React.FC<TourUpdateProps> = ({
  closeTourupdatesidebar,
  tourupdateID,
}) => {
  const isFormSubmitting = false;
  const [selectexclude, setSelectedExclude] = useState<any[]>([]);
  const [isAddTourOpen, setIsAddTourOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [allcategories, setAllcategories] = useState<any[]>([]);
  const [selectedcategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<any | null>();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedactivities, setSelectedactivities] = useState<any[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [specialNotes, setSpecialNotes]: any = useState("");
  const [include, setInclude] = useState<Includes[]>([]);
  const [selectedInclude, setSelectedInclude] = useState<any[]>([]);
  const [exclude, setExclude] = useState<Excludes[]>([]);
  const [mapformData, setMapformdata] = useState<any>([]);
  const [formDataImages, setFormdataImages] = useState<any>([]);
  const [text, setText]: any = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tourDetails, setTourDetails] = useState<TourPacakge[]>([]);
   const [locations, setLocations] = useState<Location[]>([]);
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
  const fetchTourdata = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/packageRoutes/listPackage",
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
      console.log("data--------added", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        setTourDetails(data.result);
      }
    } catch (e: any) {
      console.log("Error fetching Includes:", e);
    }
  };
  const fetchLocations = async (id: any) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/settingRoutes/listLocation",
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
      if (data.success) {
        console.log("data------------->94", data);

        const filteredLocations = data.result.filter(
          (location: any) => location.refDestinationId === id
        );
        setLocations(filteredLocations);

        console.log(filteredLocations);
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };


    //Map image upload

    const customMap = async (event: any) => {
      console.table("event", event);
      const file = event.files[0]; // Assuming single file upload
      const formData = new FormData();
      formData.append("Image", file);
      console.log("formData", formData);
  
      for (let pair of formData.entries()) {
        console.log("-------->______________", pair[0] + ":", pair[1]);
      }
  
      console.log("formData------------>", formData);
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/userRoutes/uploadMap",
  
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
  
        localStorage.setItem("JWTtoken", "Bearer " + data.token);
        console.log("data==============", data);
  
        if (data.success) {
          console.log("data+", data);
          handleUploadSuccessMap(data);
        } else {
          console.log("data-", data);
          handleUploadFailure(data);
        }
      } catch (error) {
        handleUploadFailure(error);
      }
    };
  
    //galary image upload
  
    const customUploader = async (event: any) => {
      console.table("event", event);
  
      // Create a FormData object
  
      // Loop through the selected files and append each one to the FormData
      for (let i = 0; i < event.files.length; i++) {
        const formData = new FormData();
        const file = event.files[i];
        formData.append("images", file);
  
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + "/packageRoutes/galleryUpload",
  
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
  
          localStorage.setItem("JWTtoken", "Bearer " + data.token);
          console.log("data==============", data);
  
          if (data.success) {
            handleUploadSuccess(data);
          } else {
            handleUploadFailure(data);
          }
        } catch (error) {
          handleUploadFailure(error);
        }
      }
    };
  
    const customCoverUploader = async (event: any) => {
      console.table("event", event);
  
      // Create a FormData object
  
      // Loop through the selected files and append each one to the FormData
      for (let i = 0; i < event.files.length; i++) {
        const formData = new FormData();
        const file = event.files[i];
        formData.append("Image", file);
  
        try {
          const response = await axios.post(
            import.meta.env.VITE_API_URL + "/packageRoutes/uploadCoverImage",
  
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
  
          localStorage.setItem("JWTtoken", "Bearer " + data.token);
          console.log("data==============", data);
  
          if (data.success) {
            handleUploadSuccessCover(data);
          } else {
            handleUploadFailure(data);
          }
        } catch (error) {
          handleUploadFailure(error);
        }
      }
    };
  
    const handleUploadSuccessMap = (response: any) => {
      console.log("Upload Successful:", response);
      setMapformdata(response.filePath);
    };
  
    const handleUploadSuccessCover = (response: any) => {
      console.log("Upload Successful:", response);
      setCoverImage(response.filePath);
    };
  
    const handleUploadSuccess = (response: any) => {
      let temp = [...formDataImages]; // Create a new array to avoid mutation
      temp.push(response.filePath); // Add the new file path
      console.log("Upload Successful:", response);
      setFormdataImages(temp); // Update the state with the new array
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

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/addPackage",
        {
          refPackageName: formDataobject.packageName,
          refDesignationId: parseInt(selectedDestination.refDestinationId),
          refDurationIday: +formDataobject.noOfDays,
          refDurationINight: +formDataobject.noOfNights,
          refLocation: selectedLocations.map((loc) => loc.refLocationId + ""),
          refCategoryId: parseInt(selectedcategory.refCategoryId),
          refGroupSize: 0,
          refTourCode: formDataobject.tourCode,
          refTourPrice: +formDataobject.price,
          refSeasonalPrice: +formDataobject.seasonalPrice,
          images: formDataImages,
          refItinary: text,
          refItinaryMapPath: mapformData,
          refSpecialNotes: specialNotes,
          refActivity: selectedactivities.map(
            (act) => act.refActivitiesId + ""
          ),
          refTravalInclude: selectedInclude.map(
            (inc) => inc.refTravalIncludeId + ""
          ),
          refTravalExclude: selectexclude.map(
            (exc) => exc.refTravalExcludeId + ""
          ),
          refCoverImage: coverImage,
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
      console.log("data----240", data);
      if (data.success) {
        // await addTour(payload);
        // setIsFormSubmitting(false);
        localStorage.setItem("token", "Bearer " + data.token);

        setIsAddTourOpen(false);
        fetchTourdata();
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Update New Tour Package ID:{tourupdateID}</h2>

      <form onSubmit={handleUpdateSubmit} method="post">
        <InputText
          name="packageName"
          placeholder="Enter Package Name"
          className="w-full mt-4"
        />
        {/* Destination and locations */}
        <div className="flex flex-row gap-3 mt-3">
          <Dropdown
            value={selectedDestination}
            onChange={(e) => {
              setSelectedDestination(e.value);
              fetchLocations(e.value.refDestinationId);
            }}
            options={destinations}
            optionLabel="refDestinationName"
            placeholder="Choose a Destination"
            className="w-full"
          />
          <MultiSelect
            value={selectedLocations}
            onChange={(e) => {
              setSelectedLocations(e.value);
            }}
            options={locations}
            optionLabel="refLocationName"
            display="chip"
            placeholder="Select Locations"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
          />
        </div>
        {/* Category and Activities */}
        <div className="flex flex-row gap-3 mt-3">
          <Dropdown
            value={selectedcategory}
            onChange={(e) => {
              setSelectedCategory(e.value);
            }}
            options={allcategories}
            optionLabel="refCategoryName"
            placeholder="Choose a Category"
            className="w-full"
          />
          <MultiSelect
            value={selectedactivities}
            onChange={(e) => {
              setSelectedactivities(e.value);
            }}
            options={activities}
            optionLabel="refActivitiesName"
            display="chip"
            placeholder="Select Activities"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
          />
        </div>
        {/* No of days */}
        <div className="flex flex-row gap-3 mt-3">
          <InputNumber
            placeholder="Number of Days"
            name="noOfDays"
            className="w-full"
          />
          <InputNumber
            name="noOfNights"
            placeholder="Number of Nights"
            className="w-full"
          />
        </div>
        {/* Price */}
        <div className="flex flex-row gap-3 mt-3">
          <InputNumber
            name="price"
            placeholder="Enter Price P/P"
            className="w-full"
          />
          <InputText
            name="tourCode"
            placeholder="Enter Code"
            className="w-full"
          />
        </div>
        {/* Notes */}
        <div className="flex flex-col gap-3 mt-3">
          <InputNumber
            name="seasonalPrice"
            placeholder="Enter Seasonal Price"
            className="w-full"
          />
        </div>

        {/* Itinary and refSpecialNotes*/}
        <div className="flex flex-col gap-3 mt-3">
          <Editor
            value={text} // Bind state variable
            onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue)} // Handle input changes
            style={{ height: "320px", width: "100%" }} // Custom styles
            placeholder="Enter Itinerary"
          />

          <InputText
            name="refSpecialNotes"
            placeholder="Enter Special Notes"
            className="w-full"
            onChange={(e) => setSpecialNotes(e.target.value)}
          />
        </div>

        {/* Include  Exclude */}

        <div className="flex flex-row gap-3 mt-3">
          <MultiSelect
            value={selectedInclude}
            onChange={(e) => {
              setSelectedInclude(e.value);
            }}
            options={include}
            optionLabel="refTravalInclude"
            display="chip"
            placeholder="Select Includes"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
          />
          <MultiSelect
            value={selectexclude}
            onChange={(e) => {
              setSelectedExclude(e.value);
            }}
            options={exclude}
            optionLabel="refTravalExclude"
            display="chip"
            placeholder="Select Excludes"
            maxSelectedLabels={3}
            className="w-full md:w-20rem"
          />
        </div>
        {/* Map upload */}

        <div>
          <h2 className="mt-3">Upload Map </h2>
          <FileUpload
            name="logo"
            customUpload
            className="mt-3"
            uploadHandler={customMap}
            accept="image/*"
            maxFileSize={10000000}
            emptyTemplate={
              <p className="m-0">Drag and drop your Map here to upload.</p>
            }
          />
        </div>

        {/* Image Cover */}

        <div>
          <h2 className="mt-3">Upload Cover Image</h2>
          <FileUpload
            name="cover"
            customUpload
            className="mt-3"
            uploadHandler={customCoverUploader}
            accept="image/*"
            maxFileSize={10000000}
            emptyTemplate={
              <p className="m-0">Drag and drop your Cover Image here to upload.</p>
            }
            multiple
          />
        </div>

        {/* Image Upload */}

        <div>
          <h2 className="mt-3">Upload Image</h2>
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
            multiple
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" onClick={closeTourupdatesidebar}  label="Submit" loading={isFormSubmitting} />
        </div>
      </form>

     
    </div>
  );
};

export default TourUpdate;
