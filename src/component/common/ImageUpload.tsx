import axios from "axios";
import { decryptAPIResponse } from "../../utils";

type ImageUploadProps = {
  afterUploadCallback: (imagePaths: string[]) => void;
  imagePaths: string[];
};

function ImageUpload({ imagePaths }: ImageUploadProps) {
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      currentTarget: { files },
    } = event;

    if (!files || files.length === 0) return;

    const formData = new FormData();

    for (const file of files) {
      formData.append("Images", file);
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/packageRoutes/galleryUpload",
        formData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("Image uploaded successfully:", data);
      if (data.success) {
        console.log("Image uploaded successfully:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="mt-3">
      {imagePaths.length > 0 ? (
        <div className="w-full flex items-center justify-center gap-[10px]">
          {imagePaths.map((imagePath, _i) => (
            <img src={imagePath} width="100" height="100" className="block" />
          ))}
        </div>
      ) : null}
      <label
        htmlFor="dropzone-file"
        className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center py-6 bg-blue b-rounded">
          <p className="text-md mb-2 text-zinc-700">
            <span className="font-semibold">Click to upload</span>
          </p>
          <input
            onChange={handleImageUpload}
            accept={"image/*"}
            multiple
            type="file"
            name="upload"
            id="dropzone-file"
            className="hidden"
          />
        </div>
      </label>
    </div>
  );
}

export default ImageUpload;
