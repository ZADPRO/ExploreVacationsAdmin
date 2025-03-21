import { useState, useEffect, type FormEvent } from "react";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { Editor } from "primereact/editor";
import CryptoJS from "crypto-js";
import { decryptAPIResponse } from "../../utils";
import { fetchDestinations } from "../../services/DestinationService";
import { fetchCategories } from "../../services/CategoriesService";
import { fetchActivities } from "../../services/ActivityService";
import { fetchTours } from "../../services/TourServices";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabPanel, TabView } from "primereact/tabview";
import AddForm from "../05-CarServices/AddForm";
import { addTourBaseOnKey } from "../../services/Travel";
import { FileUpload } from "primereact/fileupload";
import { EditorTextChangeEvent } from "primereact/editor";
import { fetchNewcarservices } from "../../services/NewServices";
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
function transformArrayToObject(array: string[], key: string) {
  return {
    [key]: array.map((val) => ({ [key]: val })),
  };
}

function ToursNew() {
  const [submitLoading, setSubmitLoading] = useState(false);
  console.log(submitLoading);
  const [isAddTourOpen, setIsAddTourOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [allcategories, setAllcategories] = useState<any[]>([]);
  const [selectedcategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<any | null>();
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedactivities, setSelectedactivities] = useState<any[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const isFormSubmitting = false;
  // const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [include, setInclude] = useState<Includes[]>([]);
  const [selectedInclude, setSelectedInclude] = useState<any[]>([]);
  const [exclude, setExclude] = useState<Excludes[]>([]);
  const [selectexclude, setSelectedExclude] = useState<any[]>([]);
  const [editIncludeId, setEditIncludeId] = useState<number | null>(null);
  const [editIncludeValue, setEditIncludeValue] = useState({
    refTravalIncludeId: "",
    refTravalInclude: "",
  });
  const [specialNotes, setSpecialNotes]: any = useState("");
  const [editExcludeId, setEditExcludeId] = useState<number | null>(null);
  const [editExcludeValue, setEditExcludeValue] = useState({
    refTravalExcludeId: "",
    refTravalExclude: "",
  });
  const [formData, setFormData] = useState<any>([]);
  const [formDataImages, setFormdataImages] = useState<any>([]);
  const [text, setText]: any = useState("");

  type DecryptResult = any;

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
  useEffect(() => {
    fetchDestinations().then((result) => {
      setDestinations(result);
    });
    fetchCategories().then((result) => {
      setAllcategories(result);
    });
    fetchActivities().then((result) => {
      setActivities(result);
    });
    fetchTours().then((result) => {
      setTours(result);
    });
    fetchNewcarservices().then((result) => {
      setTours(result);
    });
    fetchTours().then((result) => {
      setTours(result);
    });
    
    fetchInclude();
    fetchExclude();
  }, []);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataobject = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );

    const payload = {
      refPackageName: formDataobject.packageName,
      refDesignationId: selectedDestination?.refDestinationId,
      refDurationIday: formDataobject.noOfDays,
      refDurationINight: formDataobject.noOfNights,
      refLocation: selectedLocations.map((loc) => loc.refLocationId),
      refCategoryId: selectedcategory.refCategoryId,
      refActivity: selectedactivities.map((act) => act.refActivitiesId),
      refGroupSize: "Not Specified",
      refTourCode: formDataobject.tourCode,
      refTourPrice: formDataobject.price,
      refSeasonalPrice: formDataobject.seasonalPrice,
      refUploadMap: formData,
      refUploadImage: formDataImages,
    };
    console.log("payload", payload);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/addPackage",
        {
          refPackageName: formDataobject.packageName,
          refDesignationId: parseInt(selectedDestination.refDestinationId),
          refDurationIday: formDataobject.noOfDays,
          refDurationINight: formDataobject.noOfNights,
          refLocation: selectedLocations.map((loc) => loc.refLocationId),
          refCategoryId: parseInt(selectedcategory.refCategoryId),
          refGroupSize: "Not Specified",
          refTourCode: formDataobject.tourCode,
          refTourPrice: formDataobject.price,
          refSeasonalPrice: formDataobject.seasonalPrice,
          images: formDataImages,
          refItinary: text,
          refItinaryMapPath: formData,
          refSpecialNotes: specialNotes,
          refActivity: selectedactivities.map((act) => act.refActivitiesId),
          refTravalInclude: selectedInclude,
          refTravalExclude: selectexclude,
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
      if (data.success) {
        console.log("data------------->192", data);
        // await addTour(payload);
        // setIsFormSubmitting(false);
        localStorage.setItem("token", "Bearer " + data.token);
      }
    } catch (e) {
      console.error("Error fetching locations:", e);
    }

    
  };
  const snoTemplate = (
    _rowData: Destination,
    options: { rowIndex: number }
  ) => {
    return options.rowIndex + 1;
  };

  const fetchInclude = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/packageRoutes/listTravalInclude",
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
      console.log("data-------------->include", data);
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
        import.meta.env.VITE_API_URL + "/packageRoutes/listTravalExclude",
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

  //Update Include

  // Handle Edit Button Click
  const handleEditIncludeClick = (rowData: any) => {
    setEditIncludeId(rowData.refTravalIncludeId);
    setEditIncludeValue({ ...rowData });
  };

  // Handle Input Change
  const handleIncludeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditIncludeValue((prevData) => ({
      ...prevData,
      refTravalInclude: e.target.value,
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
    setEditExcludeId(rowData.refTravalExcludeId);
    setEditExcludeValue({ ...rowData });
  };

  // Handle Input Change
  const handleExcludeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditExcludeValue((prevData) => ({
      ...prevData,
      refTravalExclude: e.target.value, // Update the name in state
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
      }
    } catch (e) {
      console.error("Error updating exclude:", e);
      setSubmitLoading(false);
      setEditExcludeId(null);
    }
  };

  //Delete Inlclude

  const deleteInclude = async (refTravalIncludeId: number) => {
    // if (!refTravalIncludeId) {
    //   console.error("Invalid data: Missing ID");
    //   return;
    // }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/deleteTravalInclude",
        { refTravalIncludeId }, // Send only the required payload
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
      console.log("deleted-->", data);
      setSubmitLoading(false);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        fetchInclude(); // Refresh list after deletion
      }
    } catch (e) {
      console.error("Error deleting include:", e);
      setSubmitLoading(false);
    }
  };

  // Action Buttons (Edit / Delete)
  const includeActionTemplateDelete = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editIncludeId === rowData.refTravalIncludeId ? (
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={updateInclude}
          />
        ) : (
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditIncludeClick(rowData)}
          />
        )}

        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          onClick={() => deleteInclude(rowData.refTravalIncludeId)}
        />
      </div>
    );
  };

  //Delete Exclude
  const deleteExclude = async (refTravalExcludeId: number) => {
    if (!refTravalExcludeId) {
      console.error("Invalid data: Missing ID");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/deleteTravalExclude",
        { refTravalExcludeId }, // Corrected payload
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
      }
    } catch (e) {
      console.error("Error deleting exclude:", e);
      setSubmitLoading(false);
    }
  };

  const excludeActionTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        {editExcludeId === rowData.refTravalExcludeId ? (
          <Button
            label="Update"
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={updateExclude}
          />
        ) : (
          <Button
            icon="pi pi-pencil"
            className="p-button-warning p-button-sm"
            onClick={() => handleEditExcludeClick(rowData)}
          />
        )}

        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          onClick={() => deleteExclude(rowData.refTravalExcludeId)}
        />
      </div>
    );
  };

  //Map image upload

  const customMap = async (event: any) => {
    console.table("event", event);
    const file = event.files[0]; // Assuming single file upload
    const formData = new FormData();
    formData.append("Image", file);
    console.log("formData", formData);

    for (let pair of formData.entries()) {
      console.log("-------->______________", pair[0] + ":", pair[1]); // Log each field in the FormData
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
          handleUploadSuccess(data);
        } else {
          handleUploadFailure(data);
        }
      } catch (error) {
        handleUploadFailure(error);
      }
    }
  };

  const handleUploadSuccessMap = (response: any) => {
    // let temp = formDataImages;

    // temp.push(response.filePath);

    console.log("Upload Successful:", response);
    setFormData(response.filePath);
  };

  // const handleUploadFailure = (error: any) => {
  //   console.error("Upload Failed:", error);
  //   // Add your failure handling logic here
  // };

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

  return (
    <>
      <div className="flex justify-between p-4">
        <h2 className="text-2xl font-semibold">Tours</h2>
        <Button
          label="Add new tour"
          severity="success"
          onClick={() => setIsAddTourOpen(true)}
        />
      </div>

      <div className="mt-4 p-5">
        <h3 className="text-lg font-bold">Added Tours</h3>
        <DataTable value={tours} tableStyle={{ minWidth: "50rem" }}>
          <Column
            header="S.No"
            headerStyle={{ width: "3rem" }}
            body={(_, options) => options.rowIndex + 1}
          ></Column>

          <Column
            field="refPackageName"
            header="Package Name"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refDurationIday"
            header="noo of Day"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refDurationINight"
            header="no of night"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refGroupSize"
            header="Group  
                      size"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refTourPrice"
            header="TourPrice"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refSeasonalPrice"
            header="SeasonalPrice"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="reflocationlabel"
            header="Location"
            style={{ minWidth: "200px" }}
          ></Column>
          <Column
            field="refactivitylabel"
            header="Activity"
            style={{ minWidth: "200px" }}
          ></Column>
        </DataTable>
      </div>

      <Sidebar
        visible={isAddTourOpen}
        style={{ width: "50%" }}
        onHide={() => setIsAddTourOpen(false)}
        position="right"
      >
        <h2 className="text-xl font-bold">Add New Tour</h2>
        <TabView>
          <TabPanel header="Tour Form Details">
            <form onSubmit={handleSubmit} method="post">
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
                <InputText
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
                <InputText
                  name="seasonalPrice"
                  placeholder="Enter Notes"
                  className="w-full"
                />
              </div>

              {/* Itinary and refSpecialNotes*/}
              <div className="flex flex-col gap-3 mt-3">
                <Editor
                  value={text} // Bind state variable
                  onTextChange={(e: EditorTextChangeEvent) =>
                    setText(e.htmlValue)
                  } // Handle input changes
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
                    <p className="m-0">
                      Drag and drop your logo here to upload.
                    </p>
                  }
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
                    <p className="m-0">
                      Drag and drop your logo here to upload.
                    </p>
                  }
                  multiple
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="submit"
                  label="Submit"
                  loading={isFormSubmitting}
                />
              </div>
            </form>
          </TabPanel>
          <TabPanel header="Tour Details">
            <div className="flex flex-col gap-4">
              <h3>Tour Details:</h3>
              <div className="flex flex-col gap-4">
                {/* Card 1 */}

                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">Include</h4>

                  <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) {
                        return;
                      }
                      addTourBaseOnKey(
                        transformArrayToObject(values, "refTravalInclude"),
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
                      field="refTravalInclude"
                      header="Includes"
                      body={(rowData) =>
                        editIncludeId === rowData.refTravalIncludeId ? (
                          <InputText
                            value={editIncludeValue.refTravalInclude}
                            onChange={handleIncludeInputChange}
                          />
                        ) : (
                          rowData.refTravalInclude
                        )
                      }
                    />

                    <Column
                      body={includeActionTemplateDelete}
                      header="Actions"
                    />
                  </DataTable>
                </div>

                {/* Card 2 */}
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h4 className="font-semibold">Exclude</h4>

                  <AddForm
                    submitCallback={(values) => {
                      if (values.length < 1) {
                        return;
                      }
                      addTourBaseOnKey(
                        transformArrayToObject(values, "refTravalExclude"),
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
                      field="refTravalExclude"
                      header="Excludes"
                      body={(rowData) =>
                        editExcludeId === rowData.refTravalExcludeId ? (
                          <InputText
                            value={editExcludeValue.refTravalExclude}
                            onChange={handleExcludeInputChange}
                          />
                        ) : (
                          rowData.refTravalExclude
                        )
                      }
                    />

                    <Column body={excludeActionTemplate} header="Actions" />
                  </DataTable>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </Sidebar>
    </>
  );
}

export default ToursNew;
