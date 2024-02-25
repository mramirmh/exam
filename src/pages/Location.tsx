import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Location.css";
import { Icon, LatLngExpression } from "leaflet";
import { FC, SetStateAction, useEffect, useRef, useState } from "react";
import { e2p } from "../utils/replaceNumber";
import { Cookie, Place } from "@mui/icons-material";
import Select from "react-select";
import { Button, CircularProgress, Snackbar } from "@mui/material";
import Cookies from "universal-cookie";
import axios from "axios";

const icon1 = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [38, 38],
});
const icon2 = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [38, 38],
});
interface Ilocation {
  latlng: {
    lat: number;
    lng: number;
  };
}

interface Ilist {
  id: number;
  name: string;
}

interface Idata {
  data: {
    data: Ilist;
    status: number;
    message: string;
    userToken: string;
  };
}

interface Ipost {
  data: {
    data: { requestNo: string };
    status: number;
    message: string;
    userToken: string;
  };
}
function Location() {
  const position: [number, number] = [29.5926, 52.5836];

  const [position1, setPosition1] = useState<{} | null>(null);
  const [position2, setPosition2] = useState<{} | null>(null);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<[] | null>([]);
  const [errorAlert, setErrorAlert] = useState<boolean>(false);
  const [errorSnac, setErrorSnac] = useState<string>("");
  const [loadingPost, setLoadingPost] = useState<boolean>(false);

  const cookie = new Cookies();

  const userToken: string = cookie.get("userToken");

  const showAlert = (errorMessage: string) => {
    setErrorAlert(true);
    setErrorSnac(errorMessage);
  };
  const getVehicleUsers = async () => {
    setLoading(true);

    try {
      if (userToken) {
        if (query.length >= 2) {
          const response: Idata = await axios.get(
            `https://exam.pishgamanasia.com/webapi/Request/GetVehicleUsers?SearchTerm=${query}&UserToken=${userToken}`,

            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            },
          );
          if (response.data.status === 1) {
            setOption(response.data.data);
          }
          if (response.data.status === 0) {
            showAlert(response.data.message);
          }
        }
      } else {
        showAlert("مشکلی پیش آمده است");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const SendRequest = async () => {
    setLoadingPost(true);
    try {
      const response: Ipost = await axios.post(
        "https://exam.pishgamanasia.com/webapi/Request/SendRequest",
        {
          userToken,
          vehicleUserTypeId: Number(query),
          source: position1.lat.toString() + "," + position1.lng.toString(),
          destination:
            position2.lat.toString() + "," + position2.lng.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      if (response.data.status === 1) {
        showAlert(`درخواست شما : ${response.data.data.requestNo}`);
      }
      if (response.data.status === 0) {
        showAlert(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("مشکلی پیش آمده است");
    }
    setLoadingPost(false);
  };

  useEffect(() => {
    getVehicleUsers();
  }, [query]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!position1) {
          setPosition1(e.latlng);
        } else if (!position2) {
          setPosition2(e.latlng);
        } else {
          setPosition1(null);
          setPosition2(null);
        }
      },
    });

    return (
      <>
        {position1 && (
          <Marker position={position1} icon={icon1}>
            <Popup> مبدا</Popup>
          </Marker>
        )}
        {position2 && (
          <Marker position={position2} icon={icon2}>
            <Popup>مقصد</Popup>
          </Marker>
        )}
      </>
    );
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errorAlert}
        autoHideDuration={3000}
        onClose={() => setErrorAlert(false)}
        message={errorSnac}
      />
      <div className=" relative h-[100vh] w-full">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution=' <a href="https://map.pishgamanasia.ir/">map.pishgamanasia</a>'
            url="https://map.pishgamanasia.ir/tile/{z}/{x}/{y}.png
          "
          />
          {/* <Marker position={position} icon={icon1}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
          <LocationMarker />
        </MapContainer>
        <div className=" absolute bottom-0 left-0 right-0 z-[100000] mb-4 ml-auto mr-auto flex w-1/2 flex-col gap-3 rounded-lg bg-white  p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className=" flex gap-1 text-red-500">
            <Place />
            <p className=" ml-1">مبدا: </p>
            <span>
              {position1
                ? `${e2p(position1.lat)} , ${e2p(position1.lng)}`
                : "لطفا مبدا را انتخاب کنید"}
            </span>
          </div>
          <div className=" flex gap-1 text-blue-500">
            <Place />
            <p className=" ml-1">مقصد: </p>
            <span>
              {position2
                ? `${e2p(position2.lat)} , ${e2p(position2.lng)}`
                : "لطفا مقصد را انتخاب کنید"}
            </span>
          </div>
          <Select
            options={option}
            onChange={(e) => setQuery(e)}
            // value={(e) => setQuery(e)}
            onInputChange={(e) => setQuery(e)}
            placeholder="نوع ماشین آلات"
            noOptionsMessage={({ inputValue }) =>
              `هیچ ماشین آلاتی برای "${inputValue}" وجود ندارد`
            }
            isLoading={loading}
          />
          {/* {query.length < 1 ? (
            <p className=" text-red-500">لطفا بیشتر از یک حرف تایپ کنید</p>
          ) : (
            ""
          )} */}
          {!position1 || !position2 ? (
            <Button
              disabled
              className=" rounded-lg bg-gray-500 text-lg text-black"
            >
              ثبت درخواست
            </Button>
          ) : (
            <Button
              onClick={() => SendRequest()}
              className=" rounded-lg bg-yellow-400 text-lg text-black"
            >
              {loadingPost === true ? (
                <CircularProgress className=" text-red-400" />
              ) : (
                "ثبت درخواست"
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Location;
