import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Location.css";
import { Icon } from "leaflet";
import { useState } from "react";
const icon1 = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [38, 38],
});
const icon2 = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
  iconSize: [38, 38],
});
function Location() {
  interface Ilocation {
    latlng: {
      lat: number;
      lng: number;
    };
  }

  const position: [number, number] = [29.5926, 52.5836];

  const [position1, setPosition1] = useState<LatLngExpression | null>(null);
  const [position2, setPosition2] = useState<LatLngExpression | null>(null);
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!position1) {
          setPosition1(e.latlng);
        } else if (!position2) {
          setPosition2(e.latlng);
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
      <div className=" absolute bottom-0 left-0 right-0 z-[100000] mb-4 ml-auto mr-auto w-1/2 bg-red-400">
        <p>
          مبدا{" "}
          <span>
            {position1.lat} , {position1.lng}
          </span>
        </p>
        <p>مقصد</p>
      </div>
    </div>
  );
}

export default Location;
