import React, { useState, useEffect, useMemo } from "react"
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Popup,
} from "react-map-gl"
import { usePapaParse } from "react-papaparse"

let pathToCSV = "./data/gtw-facility-analysis_2023-08-15-1692117740.csv"
const pinStyle = {
  cursor: "pointer",
  fill: "#d00",
  stroke: "none",
}
const pin = (
  <svg
    height="20"
    width="20"
    viewBox="0 0 24 24"
    style={{
      ...pinStyle,
    }}
  >
    <path
      d="M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z"
    />
  </svg>
)

const viewport = {
  latitude: 41.42,
  longitude: -97.29,
  zoom: 4.5,
  bearing: 0,
  pitch: 0,
}

const MapComponent = () => {
  const { readString } = usePapaParse()
  const [exprolerData, setExplorerData] = useState([])
  const [markers, setMarkers] = useState([])
  const [popupInfo, setPopupInfo] = useState()

  useEffect(() => {
    fetch(pathToCSV)
      .then((res) => res.text())
      .then((data) => {
        const results = readString(data, { header: true })
        setMarkers(results.data)

        // set popup info parsed results.data
        setExplorerData(
          results.data.map((data) => {
            return {
              facility_name: data.Facility_Name,
              facility_id: data.Facility_ID,
              CO2e_kt: parseFloat(data.CO2e_kt),
              unit_Temp_degC: parseFloat(data.Unit_Temp_degC),
              temp_3000m_degC: parseInt(data.Temp_3000m),
              gradient_degC_per_km: parseFloat(data.Temp_Gradient_degC_per_km),
              temp_plus15C_Available_3000m:
                data.Temp_plus15C_Available_3000m === "true",
              position: {
                lat: parseFloat(data.Latitude),
                lng: parseFloat(data.Longitude),
              },
              // geophires_summary: JSON.parse(
              //   data.geophires_summary.replaceAll("'", '"')
              // ),
            }
          })
        )
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error)
      })
  }, [])

  const pins = useMemo(() => {
    return markers.map((marker, i) => {
      if (marker.Latitude) {
        return (
          <Marker
            key={`marker-${i}`}
            latitude={marker.Latitude}
            longitude={marker.Longitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setPopupInfo({
                name: exprolerData[i].facility_name,
                position: {
                  latitude: exprolerData[i].position.lat,
                  longitude: exprolerData[i].position.lng,
                },
                id: exprolerData[i].facility_id,
                CO2e_kt: exprolerData[i].CO2e_kt,
                unit_Temp_degC: exprolerData[i].unit_Temp_degC,
                temp_3000m_degC: exprolerData[i].temp_3000m_degC,
                gradient_degC_per_km: exprolerData[i].gradient_degC_per_km,
                temp_plus15C_Available_3000m:
                  exprolerData[i].temp_plus15C_Available_3000m === "true",
              })
            }}
          >
            {pin}
          </Marker>
        )
      } else {
        console.log("false")
      }
    })
  }, [markers])

  return (
    <div className="container">
      <Map
        mapboxAccessToken="pk.eyJ1IjoiYW5kcmlpYnVsaGFrb3YiLCJhIjoiY2x1aTJsZ3lqMDAyODJrbnBpa3EwNTJidSJ9.QYx_ieY_pSftL6Vi_P_FnA"
        initialViewState={{
          ...viewport,
        }}
        style={{ width: "100%", height: 600 }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        {pins}
        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.position.longitude)}
            latitude={Number(popupInfo.position.latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <table className="mui-table">
              <thead>
                <tr>
                  <th colSpan={2}>{popupInfo.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>facility_id</td>
                  <td>
                    <a
                      href="https://ghgdata.epa.gov/ghgp/service/facilityDetail/2021?id=1004038&amp;ds=E&amp;et=&amp;popup=true"
                      target="_blank"
                      title="Open EPA GHGRP Facility Details in a separate window"
                    >
                      {popupInfo.id}
                    </a>
                  </td>
                </tr>
                {Object.entries(popupInfo).map(([key, value], index) => {
                  console.log(key, typeof value)
                  if (
                    key !== "name" &&
                    key !== "position" &&
                    key !== "id" &&
                    Number(value) !== NaN
                  ) {
                    return (
                      <tr key={index + value + key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    )
                  }
                })}
              </tbody>
            </table>
          </Popup>
        )}
      </Map>
    </div>
  )
}

export default MapComponent
