import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "./Login.css";

type DecryptResult = any;
export default function Login() {
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

  const [inputs, setInputs] = useState({ username: "", password: "" });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({ status: false, message: "" });

  const handleInput = (e: any) => {
    setError({
      status: false,
      message: "",
    });

    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios
        .post(import.meta.env.VITE_API_URL + "/adminRoutes/adminLogin", {
          login: inputs.username,
          password: inputs.password,
        })
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );

          console.log("Data line ------ 69", data);

          if (data.success) {
            localStorage.setItem("token", "Bearer " + data.token);
            localStorage.setItem("roleId", data.roleId);

                    
              const roleId = data.roleId;
            
              if (roleId === 1) {
                navigate("/dashboard");
              } else if (roleId === 2) {
                navigate("/dashboard");
              } else if (roleId === 3) {
                navigate("/dashboard");
              } else if (roleId === 4) {
                navigate("/dashboard");
              } else if (roleId === 5) {
                navigate("/dashboard");
              } else {
                navigate("/dashboard"); 
              }
            
              setLoading(false);
            }
            

          else {
            setLoading(false);
            setError({
              status: true,
              message: "Invalid Username or Password",
            });
          }

          console.log("====================================");
          console.log(data);
          console.log("====================================");
        });
    } catch (e: any) {
      console.log(e);
      setLoading(false);
      setError({
        status: true,
        message: "Something went wrong, Try Again",
      });
    }
  };

  const navigate = useNavigate();

  return (
    <div className="pagebackground">
      <div className="login-background">
       <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "16px", // prevent side cut on small screens
  }}
>
  <form
    onSubmit={handleSubmit}
    style={{
      width: "100%",        // full width on small screens
      maxWidth: "400px",    // limit on desktop
      padding: "20px",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    }}
  >
    <div className="input mt-3">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
                <InputText
                  name="username"
                  onInput={(e) => {
                    handleInput(e);
                  }}
                  value={inputs.username}
                  placeholder="Enter Username"
                  required
                />
              </div>
            </div>
            <div className="input mt-3" style={{ width: "100%" }}>
              <div
                className="p-inputgroup flex flex-row w-full"
                style={{ width: "100%" }}
              >
                <span className="p-inputgroup-addon">
                  <i className="pi pi-lock"></i>
                </span>
                <Password
                  name="password"
                  style={{ width: "100%" }}
                  onInput={(e) => handleInput(e)}
                  value={inputs.password}
                  placeholder="Enter Password"
                  toggleMask
                  feedback={false}
                  required
                />
              </div>
            </div>

            {error.status && (
              <div
                className="mt-1"
                style={{ color: "red", fontSize: "0.85rem", fontWeight: "700" }}
              >
                {error.message}
              </div>
            )}

            <div className="input mt-4">
              <Button
                style={{
                  width: "100%",
                  background: "#0a5c9c",
                  border: "none",
                  height: "40px",
                }}
                label={loading ? "" : "Submit"}
                icon={loading ? "pi pi-spin pi-spinner" : ""}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
