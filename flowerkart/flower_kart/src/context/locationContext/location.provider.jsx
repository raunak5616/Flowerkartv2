import { useState } from "react";
import { LocationContext } from "./location.context";

export const LocationProvider = ({ children }) => {
  const [address, setAddress] = useState(() => {
    return localStorage.getItem("deliveryAddress") || "Select Location";
  });

  const [coordinates, setCoordinates] = useState(() => {
    const saved = localStorage.getItem("deliveryCoordinates");
    return saved ? JSON.parse(saved) : null;
  });
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const data = await response.json();

        const shortAddress = `${data.address.city || data.address.town || ""}, ${data.address.state || ""}`;

        setAddress(shortAddress);
        setCoordinates({ lat: latitude, lng: longitude });
        
        localStorage.setItem("deliveryAddress", shortAddress);
        localStorage.setItem("deliveryCoordinates", JSON.stringify({ lat: latitude, lng: longitude }));
      },
      () => alert("Please allow location access")
    );
  };

  return (
    <LocationContext.Provider value={{ address, setAddress, coordinates, setCoordinates, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
