"use client";
import React from "react";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer
} from "@react-google-maps/api";
import { useState, useEffect, ReactElement } from "react";
import Spinner from "../Components/spinner";

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: false
};

const googleMapsApiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

const Mapa = ({
  destination
}: {
  destination: google.maps.LatLngLiteral;
}): ReactElement => {
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setOrigin({ lat, lng });
        },
        () => {
          alert({
            icon: "warning",
            text: "Necesita habilitar la geolocaclización en su dispositivo."
          });
        }
      );
    } else {
      alert({ icon: "error", text: "La geolocalización no está disponible." });
    }
  }, []);

  useEffect(() => {
    if (!window.google || !origin) {
      return;
    }

    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          alert({ icon: "error", text: "No pudo planificarse la ruta." });
        }
      }
    );
  }, [isLoaded, origin]);

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          options={mapOptions}
          zoom={14}
          center={origin ? origin : { lat: -34.60755, lng: -58.40045 }}
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "540px" }}
        >
          {directions ? (
            <DirectionsRenderer options={{ directions }} />
          ) : (
            <p>Calculando Ruta...</p>
          )}
        </GoogleMap>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Mapa;
