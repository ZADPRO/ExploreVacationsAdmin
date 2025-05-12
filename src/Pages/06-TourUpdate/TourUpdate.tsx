import CryptoJS from "crypto-js";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Button } from "primereact/button";

import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { decryptAPIResponse } from "../../utils";
import { Editor } from "primereact/editor";
// import { FileUpload } from "primereact/fileupload";
import { fetchActivities } from "../../services/ActivityService";
import { fetchDestinations } from "../../services/DestinationService";
import { fetchCategories } from "../../services/CategoriesService";
import { FileUpload } from "primereact/fileupload";
import Location from "../01-Location/Location";
import { fetchTours } from "../../services/TourServices";
import { Toast } from "primereact/toast";

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

  const [_isAddTourOpen, setIsAddTourOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [allcategories, setAllcategories] = useState<any[]>([]);

  const [activities, setActivities] = useState<any[]>([]);

  const [include, setInclude] = useState<Includes[]>([]);

  const [exclude, setExclude] = useState<Excludes[]>([]);
  const [mapformData, setMapformdata] = useState<any>([]);

  const [coverImage, setCoverImage] = useState("");
  // const [tourDetails, setTourDetails] = useState<TourPacakge[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [_deleteCoverId, setDeleteCoverId] = useState<number | null>(null);

  const [_deleteMapId, setdeleteMapId] = useState<number | null>(null);
  const [_deleteGalleryId, setDeleteGalleryId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>({
    refPackageId: 0,
    refPackageName: "",
    refDesignationId: "",
    refLocationName: "",
    refDestinationName: "",
    refDurationIday: "",
    refDurationINight: "",
    refCategoryId: 0,
    refGroupSize: "",
    refTourCode: "",
    refTourPrice: "",
    refActivity: "",
    refLocation: "",
    refSeasonalPrice: "",
    refCoverImage: { filename: "", contentType: "", content: "" },
    refTravalDataId: "",
    refItinary: "",
    refItinaryMapPath: { filename: "", contentType: "", content: "" },
    refTravalInclude: "",
    refTravalExclude: "",
    refSpecialNotes: "",
    refTravalOverView: "",
    refGallery: [{ filename: "", contentType: "", content: "" }],
    refCategoryName: "",
    refLocationList: [],
    Activity: [],
    travalInclude: [],
    travalExclude: [],
  });
  const [originalData, setOriginalData] = useState<Record<string, any>>({});
  const toast = useRef<Toast>(null);
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
      console.log("Destination---------->", result);
    });
    fetchCategories().then((result) => {
      setAllcategories(result);
    });
    fetchActivities().then((result) => {
      console.log("fetchActivites ----->", result);
      setActivities(result);
    });

    fetchInclude();
    fetchExclude();
  }, []);

  useEffect(() => {
    if (tourupdateID) {
      fetchSingleIDTourdataForm();
    }
  }, [tourupdateID]);

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
        localStorage.setItem("token", "Bearer " + data.token);
        const filteredLocations = data.result.filter(
          (location: any) => location.refDestinationId === id
        );
        setLocations(filteredLocations);
        console.log("lication.......------------->94", data);

        console.log("Filtered Location------->", filteredLocations);
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
    if (file) {
      setMapformdata(file);
    }

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

  // const customUploader = async (event: any) => {
  //   console.table("event", event);

  //   // Create a FormData object

  //   // Loop through the selected files and append each one to the FormData
  //   for (let i = 0; i < event.files.length; i++) {
  //     const formData = new FormData();
  //     const file = event.files[i];
  //     formData.append("images", file);

  //     try {
  //       const response = await axios.post(
  //         import.meta.env.VITE_API_URL + "/packageRoutes/galleryUpload",

  //         formData,

  //         {
  //           headers: {
  //             Authorization: localStorage.getItem("token"),
  //           },
  //         }
  //       );

  //       const data = decrypt(
  //         response.data[1],
  //         response.data[0],
  //         import.meta.env.VITE_ENCRYPTION_KEY
  //       );

  //       localStorage.setItem("JWTtoken", "Bearer " + data.token);
  //       console.log("data==============", data);

  //       if (data.success) {
  //         handleUploadSuccess(data);
  //         setFormData((prev) => ({ ...prev, refGallery: [...prev.refGallery, data.files[0]] }));
  //       } else {
  //         handleUploadFailure(data);
  //       }
  //     } catch (error) {
  //       handleUploadFailure(error);
  //     }
  //   }
  // };
  const customUploader = async (event: any) => {
  console.table("event", event);

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
      console.log("Gallery upload response:", data);

      if (data.success) {
        handleUploadSuccess(data);
        
        // Update the refGallery array with the file path returned from the server
        if (data.files && data.files.length > 0) {
          const newImage = data.files[0];
          setFormData((prev) => ({
            ...prev,
            refGallery: [...prev.refGallery, newImage]
          }));
        }
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
      // if(file){
      //   setCoverImage(file);
      // }

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
    console.log("Upload Successful:", response);
  };

  const handleUploadFailure = (error: any) => {
    console.error("Upload Failed:", error);
    // Add your failure handling logic here
  };

  // const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post(
  //       import.meta.env.VITE_API_URL + "/packageRoutes/UpdatePackage",
  //       {
  //         refPackageId: formData.refPackageId, //int
  //         refPackageName: formData.refPackageName, //string
  //         refDesignationId: formData.refDesignationId, //int
  //         refDurationIday: formData.refDurationIday, //string
  //         refDurationINight: formData.refDurationINight, //string
  //         refCategoryId: formData.refCategoryId, //int
  //         refGroupSize: "0", //string
  //         refTourCode: formData.refTourCode, //string
  //         refTourPrice: formData.refTourPrice, //string
  //         refSeasonalPrice: formData.refSeasonalPrice, //string
  //         refTravalDataId: formData.refTravalDataId, //int
  //         refTravalOverView: formData.refTravalOverView, //string
  //         refItinary: formData.refItinary,
  //         refItinaryMapPath:  mapformData === ""
  //             ? formData.refItinaryMapPath?.filename ?? ""
  //             : mapformData, //string
  //         refTravalInclude: formData.travalInclude.map(
  //           (include: { id: string }) => include.id
  //         ), //Array
  //         refTravalExclude: formData.travalExclude.map(
  //           (exclude: { id: string }) => exclude.id
  //         ), //Array
  //         refSpecialNotes: formData.refSpecialNotes, //string
  //         refCoverImage:
  //           coverImage === ""
  //             ? formData.refCoverImage?.filename ?? ""
  //             : coverImage, //string
  //         refLocation: formData.refLocationList.map(
  //           (location: { id: string }) => location.id
  //         ), //Array
  //         refActivity: formData.Activity.map(
  //           (activity: { id: number }) => activity.id
  //         ), //Array
  //     refGallery: formDataImages.length > 0
  //         ? formDataImages  // New uploaded images
  //         : formData.refGallery?.map((img: any) => img.filename || "") || [], // Existing images
  //     },
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
  //     console.log("data--> Tourupdate---working", data);
  //     if (data.success) {
  //       // await addTour(payload);
  //       // setIsFormSubmitting(false);
  //       localStorage.setItem("token", "Bearer " + data.token);

  //       setIsAddTourOpen(false);
  //       fetchSingleIDTourdataForm();
  //     }
  //   } catch (e) {
  //     console.error("Error fetching Tour update:", e);
  //   }
  // };

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // const galleryImages = formData.refGallery?.map(
      //   (img: any) => img.filename || ""
      // );
     const galleryImages = formData.refGallery
      .map((img: any) => {
        if (typeof img === 'string') {
          return img; // Already a path
        } else if (img && typeof img === 'object') {
          // Return the first available path property
          return img.filePath || img.path || img.fullPath || img.filename || '';
        }
        return '';
      })
      .filter(Boolean); // Remove empty paths
    console.log("Gallery images to send:", galleryImages);

      const payload = {
        refPackageId: formData.refPackageId, // int
        refPackageName: formData.refPackageName, // string
        refDesignationId: formData.refDesignationId, // int
        refDurationIday: formData.refDurationIday, // string
        refDurationINight: formData.refDurationINight, // string
        refCategoryId: formData.refCategoryId, // int
        refGroupSize: "0", // string
        refTourCode: formData.refTourCode, // string
        refTourPrice: formData.refTourPrice, // string
        refSeasonalPrice: formData.refSeasonalPrice, // string
        refTravalDataId: formData.refTravalDataId, // int
        refTravalOverView: formData.refTravalOverView, // string
        refItinary: formData.refItinary, // string
        refItinaryMapPath:
          mapformData === ""
            ? formData.refItinaryMapPath?.filename ?? ""
            : mapformData, // string
        refTravalInclude: formData.travalInclude.map(
          (include: { id: string }) => include.id
        ), // Array
        refTravalExclude: formData.travalExclude.map(
          (exclude: { id: string }) => exclude.id
        ), // Array
        refSpecialNotes: formData.refSpecialNotes, // string
        refCoverImage:
          coverImage === ""
            ? formData.refCoverImage?.filename ?? ""
            : coverImage, // string
        refLocation: formData.refLocationList.map(
          (location: { id: string }) => location.id
        ), // Array
        refActivity: formData.Activity.map(
          (activity: { id: number }) => activity.id
        ), // Array
        refGallery: galleryImages,
      };

      console.log("Update payload:", payload);

      // Send API request
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/UpdatePackage",
        payload,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      // Decrypt and process response
      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("Tour update response:", data);

      if (data.success) {
        // Update token and refresh data
        localStorage.setItem("token", "Bearer " + data.token);

        // Reset state after successful update
        setIsAddTourOpen(false);

        // Refresh tour data to get updated information
        fetchSingleIDTourdataForm();

        // Show success message
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Tour package updated successfully",
          life: 3000,
        });
      } else {
        // Handle API error response
        console.error("API update failed:", data);
        toast.current?.show({
          severity: "error",
          summary: data.error || "Error",
          detail: "Failed to update tour package",
          life: 3000,
        });
      }
    } catch (e) {
      // Handle exception
      console.error("Error updating tour package:", e);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred while updating the tour package",
        life: 3000,
      });
    }
  };
  const fetchSingleIDTourdataForm = async () => {
    console.log("Fetching data for tourupdateID:", tourupdateID);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/getTour",
        {
          refPackageId: tourupdateID,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from API:", response);
      const data = decrypt(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("fetchSingleIDTourdataForm----------------", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        const result = data.tourDetails[0];
        console.log("->->->->", result);

        setFormData(result);
        // NOTE store copy of API response in original data
        setOriginalData(result);
        fetchLocations(result.refDesignationId);
        // console.log(
        //   "AAAAAAAAAAAAAAAAAAAAAA",
        //   result.refLocationList.map((location: { id: string }) => location.id)
        // );
      }
    } catch (e) {
      console.error("Error fetching tour data:", e);
    }
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   await fetchSingleIDTourdataForm();

  //   await handleUpdateSubmit(e);
  // };

  //delete Coverimage image
  const deleteCoverimage = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/deleteCoverImage",
        {
          refPackageId: id,
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
        fetchTours();
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

      setDeleteCoverId(null);
    }
  };

  //delete Coverimage image
  const deleteMapimage = async (id: any) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/userRoutes/deleteMap",
        {
          refTravalDataId: id,
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
        fetchTours();
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

      setdeleteMapId(null);
    }
  };

  const deleteGalleryImage = async (galleryId: number) => {
    console.log('galleryId inside function', galleryId)
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/deleteImage",
        {
          refGalleryId: galleryId,
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
      console.log("API Response for gallery delete:", data);

      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);

        // Update formData to remove the deleted gallery image
        setFormData((prevData) => ({
          ...prevData,
          refGallery: prevData.refGallery.filter(
            (img: any) => img.id !== galleryId
          ),
        }));

        fetchTours(); // Refresh tour data

        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Gallery Image Successfully Deleted",
          life: 3000,
        });
      } else {
        console.error("API gallery delete failed:", data);
        toast.current?.show({
          severity: "error",
          summary: data.error,
          detail: "Error While Deleting Gallery Image",
          life: 3000,
        });
      }
    } catch (e) {
      console.error("Error deleting gallery image:", e);
      setDeleteGalleryId(null);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold">
        Update New Tour Package ID:{tourupdateID}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateSubmit(e);
        }}
      >
        <InputText
          className="mt-4 w-full"
          value={formData.refPackageName}
          onChange={(e: any) =>
            setFormData((prev) => ({ ...prev, refPackageName: e.target.value }))
          }
        />

        <div className="flex flex-row gap-3 mt-3">
          <Dropdown
            value={formData.refDesignationId}
            onChange={(e: any) => {
              setFormData((prev) => ({
                ...prev,
                refDesignationId: e.target.value,
                // NOTE when we change destination reset location from originalData
                refLocationList: originalData.refLocationList,
              }));
              fetchLocations(e.target.value);
              console.log("e.target.value", typeof e.target.value);
            }}
            options={destinations}
            optionLabel="refDestinationName"
            optionValue="refDestinationId"
            placeholder="Choose a Destination"
            className="w-full"
          />

          <MultiSelect
            value={
              !formData.refLocationList?.length
                ? []
                : formData.refLocationList.map(
                    (location: { id: string }) => location.id
                  )
            }
            onChange={(e: any) =>
              setFormData((prev) => ({
                ...prev,
                refLocationList: e.value.map((locationid: number) => ({
                  id: locationid,
                })),
              }))
            }
            options={locations}
            optionLabel="refLocationName"
            optionValue="refLocationId"
            display="chip"
            placeholder="Select Locations"
            maxSelectedLabels={1}
            className="w-full md:w-20rem"
          />
        </div>

        {/* Category and Activities */}
        <div className="flex flex-row gap-3 mt-3">
          <Dropdown
            value={formData.refCategoryId}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, refCategoryId: e.value }));
            }}
            options={allcategories}
            optionLabel="refCategoryName"
            optionValue="refCategoryId"
            placeholder="Choose a Category"
            className="w-full"
          />
          <MultiSelect
            value={formData.Activity.map(
              (activity: { id: number }) => activity.id
            )}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                Activity: e.value.map((v: number) => ({ id: v })),
              }));
            }}
            options={activities}
            optionLabel="refActivitiesName"
            optionValue="refActivitiesId"
            display="chip"
            placeholder="Select Activities"
            maxSelectedLabels={1}
            className="w-full md:w-20rem"
          />
        </div>

        {/* No of Days & Nights */}
        <div className="flex flex-row gap-3 mt-3">
          <InputText
            placeholder="Number of Days"
            className="w-full"
            value={formData.refDurationIday}
            onChange={(e: any) =>
              setFormData({ ...formData, refDurationIday: e.target.value })
            }
          />
          <InputText
            placeholder="Number of Nights"
            className="w-full"
            value={formData.refDurationINight}
            // onChange={(e: any) => setNumberofNights(e.value)}
            onChange={(e: any) =>
              setFormData({ ...formData, refDurationINight: e.target.value })
            }
          />
        </div>

        {/* Price & Tour Code */}
        <div className="flex flex-row gap-3 mt-3">
          <InputText
            placeholder="Enter Price P/P"
            className="w-full"
            // value={tourPrice}
            // onChange={(e: any) => setTourPrice(e.value)}
            value={formData.refTourPrice}
            onChange={(e: any) =>
              setFormData({ ...formData, refTourPrice: e.target.value })
            }
          />
          <InputText
            placeholder="Enter Code"
            className="w-full"
            // value={tourCode}
            // onChange={(e) => setTourCode(e.target.value)}
            value={formData.refTourCode}
            onChange={(e: any) =>
              setFormData({ ...formData, refTourCode: e.target.value })
            }
          />
        </div>

        {/* Seasonal Price */}
        <div className="flex flex-col gap-3 mt-3">
          <InputText
            placeholder="Enter Seasonal Price"
            className="w-full"
            value={formData.refSeasonalPrice}
            onChange={(e: any) =>
              setFormData({ ...formData, refSeasonalPrice: e.target.value })
            }
          />
        </div>

        {/* Itinerary & Special Notes */}
        <div className="flex flex-col gap-3 mt-3">
          <Editor
            // value={text}
            // onTextChange={(e) => setText(e.htmlValue)}
            value={formData.refItinary}
            onChange={(e: any) =>
              setFormData({ ...formData, refItinary: e.target.value })
            }
            style={{ height: "320px", width: "100%" }}
            placeholder="Enter Itinerary"
          />

          <InputText
            placeholder="Enter Special Notes"
            className="w-full"
            value={formData.refSpecialNotes}
            onChange={(e: any) =>
              setFormData({ ...formData, refSpecialNotes: e.target.value })
            }
            // value={specialNotes}
            // onChange={(e) => setSpecialNotes(e.target.value)}
          />
          <Editor
            // value={text}
            // onTextChange={(e) => setText(e.htmlValue)}
            value={formData.refTravalOverView}
            onChange={(e: any) =>
              setFormData({ ...formData, refTravalOverView: e.target.value })
            }
            style={{ height: "320px", width: "100%" }}
            placeholder="Enter TravalOverView"
          />
        </div>

        {/* Include & Exclude */}
        <div className="flex flex-row gap-3 mt-3">
          <MultiSelect
            value={formData.travalInclude.map(
              (include: { id: string }) => include.id
            )}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                travalInclude: e.value.map((v: number) => ({
                  id: v,
                })),
              }));
            }}
            options={include}
            optionLabel="refTravalInclude"
            optionValue="refTravalIncludeId"
            display="chip"
            placeholder="Select Includes"
            maxSelectedLabels={1}
            className="w-full md:w-20rem"
          />
          <MultiSelect
            value={formData.travalExclude.map(
              (exclude: { id: string }) => exclude.id
            )}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                travalExclude: e.value.map((v: number) => ({
                  id: v,
                })),
              }));
            }}
            options={exclude}
            optionLabel="refTravalExclude"
            optionValue="refTravalExcludeId"
            display="chip"
            placeholder="Select Excludes"
            maxSelectedLabels={1}
            className="w-full md:w-20rem"
          />
        </div>
        {/* Map upload */}

        <div className="w-[30%] h-[30%] relative">
          {formData?.refItinaryMapPath && (
            <>
              <img
                src={`data:${formData.refItinaryMapPath.contentType};base64,${formData.refItinaryMapPath.content}`}
                alt="Staff Profile Image"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  console.log(
                    "Deleting image for ID:",
                    formData.refTravalDataId
                  );
                  deleteMapimage(formData.refTravalDataId);
                  setFormData({ ...formData, refItinaryMapPath: null });
                }}
                className="absolute top-1 right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-2 h-6 flex items-center justify-center hover:bg-red-600"
                title="Remove Image"
              >
                &times;
              </button>
            </>
          )}
        </div>

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

        <div className="w-[30%] h-[30%] relative">
          {formData?.refCoverImage && (
            <>
              <img
                src={`data:${formData.refCoverImage.contentType};base64,${formData.refCoverImage.content}`}
                alt="Staff Profile Image"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  console.log("Deleting image for ID:", formData.refPackageId);
                  deleteCoverimage(formData.refPackageId);
                  setFormData({ ...formData, refCoverImage: null });
                }}
                className="absolute top-1 right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-2 h-6 flex items-center justify-center hover:bg-red-600"
                title="Remove Image"
              >
                &times;
              </button>
            </>
          )}
        </div>

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
              <p className="m-0">
                Drag and drop your Cover Image here to upload.
              </p>
            }
            multiple
          />
        </div>

        {/* Image Upload */}

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Gallery Images</h2>
          <div className="flex flex-wrap gap-4 mt-2">
            {formData.refGallery && formData.refGallery.length > 0 ? (
              formData.refGallery.map((image: any, index: number) => (
                <div key={index} className="w-[150px] h-[150px] relative">
                  <img
                    src={`data:${image.contentType};base64,${image.content}`}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Deleting gallery image ID:", image.id);
                      deleteGalleryImage(image.id);
                    }}
                    className="absolute top-1 right-1 bg-amber-50 text-[#000] text-3xl rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    title="Remove Image"
                  >
                    &times;
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No gallery images uploaded yet</p>
            )}
          </div>
        </div>

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

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            onClick={closeTourupdatesidebar}
            label="Submit"
            loading={isFormSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default TourUpdate;
