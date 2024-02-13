import { createContext, useContext, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { Toast } from "primereact/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useLocalStorage("user", userData);
  const navigate = useNavigate();

  const toastRef = useRef(null);
  const login = async (userName, password) => {
    return new Promise((resolve, reject) => {
      if (userName === "admin" && password === "admin") {
        setUser(userName);
        navigate("/Dashboard", { replace: true });
        console.log("berhasil");

        resolve("success");
        toastRef.current.show({
          severity: "success",
          summary: "Login Success",
          life: 1200,
        });
      } else {
        console.log("gagal");
        reject("Incorrect password");
        toastRef.current.show({
          severity: "error",
          summary: "Login Failed",
          detail: "Invalid username or password.",
          life: 1200,
        });
      }
    });
  };
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      <Toast ref={toastRef} />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
