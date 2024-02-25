import { Button, CircularProgress, Snackbar } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

interface IFormInputs {
  username: string;
  password: string;
  data: {
    status: number;
    message: string;
    data: {
      userToken: string;
    };
  };
}

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [errorSnac, setErrorSnac] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const navigate = useNavigate();

  const showAlert = (errorMessage: string) => {
    setErrorAlert(true);
    setErrorSnac(errorMessage);
  };

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const cookies = new Cookies();
    setLoading(true);
    try {
      const response: IFormInputs = await axios.post(
        "https://exam.pishgamanasia.com/webapi/Account/Login",
        data,
      );
      cookies.set("userToken", response.data.data.userToken);

      if (response.data.status === 1) {
        navigate(`/Location`);
      }
      if (response.data.status === 0) {
        showAlert(response.data.message);
      }
    } catch (error) {
      console.error;
    }

    setLoading(false);
  };

  return (
    <div className=" flex h-[100vh]  w-full flex-col items-center justify-center">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorAlert}
        autoHideDuration={3000}
        onClose={() => setErrorAlert(false)}
        message={errorSnac}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex w-1/4 flex-col gap-4 rounded-lg p-5 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
      >
        <h1 className=" mb-4 text-center text-3xl">ورود</h1>

        <label htmlFor="username" className=" text-gray-500">
          نام کاربری
        </label>
        <input
          {...register("username", {
            required: true,
          })}
          type="text"
          id="username"
          className=" rounded-full  bg-blue-100 p-2"
        />
        {errors.username && (
          <span className=" -mt-2 text-red-600">
            لطفا نام کاربری را وارد کنید
          </span>
        )}
        <label htmlFor="password" className=" text-gray-500">
          کلمه عبور
        </label>
        <input
          {...register("password", { required: true })}
          type="text"
          id="password"
          className=" rounded-full  bg-blue-100 p-2"
        />
        {errors.password && (
          <span className=" text-red-600">لطفا رمز را وارد کنید</span>
        )}

        <Button
          type="submit"
          className=" my-2 rounded-full bg-yellow-300 p-2 text-lg text-black"
        >
          {loading === true ? (
            <CircularProgress className=" text-red-400" />
          ) : (
            "ورود"
          )}
        </Button>
      </form>
    </div>
  );
}

export default Login;
