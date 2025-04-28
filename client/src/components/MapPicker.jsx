// // components/MapPicker.jsx
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import { useState } from 'react';
// import L from 'leaflet';

// const markerIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// function LocationMarker({ setLatLng }) {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       setPosition([lat, lng]);
//       setLatLng({ lat, lng });
//     },
//   });

//   return position ? <Marker position={position} icon={markerIcon} /> : null;
// }

// export default function MapPicker({ setLatLng }) {
//   return (
//     <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: "300px", width: "100%" }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <LocationMarker setLatLng={setLatLng} />
//     </MapContainer>
//   );
// }


// components/MapPicker.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ pin, setLatLng }) {
  const [position, setPosition] = useState(pin ? [pin.lat, pin.lng] : null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLatLng({ lat, lng });
    },
  });

  // Update marker if pin changes (important when preloading from DB)
  useEffect(() => {
    if (pin?.lat && pin?.lng) {
      setPosition([pin.lat, pin.lng]);
      map.flyTo([pin.lat, pin.lng], map.getZoom());
    }
  }, [pin, map]);

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function MapPicker({ pin, setLatLng }) {
  return (
    <MapContainer
      center={pin?.lat && pin?.lng ? [pin.lat, pin.lng] : [-1.286389, 36.817223]}
      zoom={15}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker pin={pin} setLatLng={setLatLng} />
    </MapContainer>
  );
}
