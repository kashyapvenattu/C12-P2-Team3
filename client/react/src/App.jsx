import React, { useState, useRef, useEffect, useContext } from "react"
import { GoogleMap, useLoadScript, Marker, MarkerF, InfoWindow, Autocomplete, DirectionsRenderer } from "@react-google-maps/api"
import "./App.css"
import marketLogo from './assets/constructionMarker.png'
import mapStyle from "./assets/customMapSytle.json" //Map Styling
import { useNavigate } from "react-router-dom"
import LoginContext, { IfLoggedIn, IfNotLoggedIn } from "./LoginContext"

const App = () => {

  const mapContainerStyle = { 
    width: "100%",
    height: "100%",
  }

  const center = { lat: 51, lng: -114 }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places", "geometry"],
  })

  const [map, setMap] = useState(null)
  const [distance, setDistance] = useState("")
  const [duration, setDuration] = useState("")
  const [directionsRenderers, setDirectionsRenderers] = useState([])
  const [constructionMarkers, setConstructionMarkers] = useState([])
  const [filteredConstructionMarkers, setFilteredConstructionMarkers] = useState([])
  const [routes, setRoutes] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [modal, setModal] = useState(false)
  const [rank, setRank] = useState(false)
  const [rankJson, setRankJson] = useState([])


  const originRef = useRef()
  const destinationRef = useRef()
  const travelModeRef = useRef()
  const navigate = useNavigate()
  const {loggedInUser} = useContext(LoginContext)

  //Fetch data from database api
  const getConstructionData = async () => {
    const response = await fetch("/api/construction")
    const constructionData = await response.json()
    setConstructionMarkers(constructionData)
  }

 // Focus & Zoom on the marker area
 function fitBoundsToMarkers(){
      const newBounds = new google.maps.LatLngBounds()
      constructionMarkers.forEach((marker) => {
        newBounds.extend(marker.position)
       })
       map.fitBounds(newBounds)
  }

  useEffect(() => {
    getConstructionData()
  }, [])

  // any change in map or construction markers refreshes the marker bounds [helps to zoom in to marker area]
  useEffect(()=>{
    if(map && constructionMarkers){
      fitBoundsToMarkers()
  }}, [map, constructionMarkers])


  if (loadError) {
    return <div>Error loading maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps</div>
  }
  
  const toggleModal = () => {
    setModal(!modal)
  }

  const toggleRank = () => {
    setRank(!rank)
  }

  const calculateRoute =  () => {
    // setRank(false)
    handleCloseClick()
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return
    }
    const directionsService = new google.maps.DirectionsService()
    directionsService.route(
      {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode[travelModeRef.current.value],
        provideRouteAlternatives: true,
      },
      async (response, status) => {
        if (status === "OK") {
          directionsRenderers.forEach((renderer) => {
            renderer.setMap(null)
          })
          const result = await fetch('/api/googleData', {
            method: 'POST',
            headers: {
              // 'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(response)
          })

          const resultJson = await result.json()
          const resultJsonArray = resultJson.ranked
          setRankJson(resultJsonArray)
          setRank(true)
          setRoutes(response.routes)
          const newRenderers = []
          let filteredMarkers
          for (let i = 0; i < response.routes.length; i++) {
            // var myPosition = new google.maps.LatLng(51.04484,-114.07187)
            const polyline = new google.maps.Polyline({path:google.maps.geometry.encoding.decodePath(response.routes[i].overview_polyline)})
            const newDirections = new google.maps.DirectionsRenderer({  map: map,
                  directions: response,
                  routeIndex: i, })
            newRenderers.push(newDirections)

            filteredMarkers = constructionMarkers.filter((marker) => {
              return google.maps.geometry.poly.isLocationOnEdge(marker.position, polyline, 0.0001) 
            })
            // setConstructionMarkers(filteredMarkers)            

          }
          setFilteredConstructionMarkers(filteredMarkers)
          if(filteredMarkers.length>0){
            setModal(true)          }
          setDirectionsRenderers(newRenderers)
        }
      }
    )
  }

  const handleMarkerClick = (marker) => {
    setSelectedPlace(marker)
  }

  const handleCloseClick = () => {
    setSelectedPlace(null)
  }

  return (
    <div className="main">
      <div className="navigation-bar-container">
      <div className="navigation-bar">
        <h1>SHIFT</h1>
        <div className="user-and-login">
          <IfNotLoggedIn>
              <button onClick={() => {navigate("/login")}}>Login</button>
              <button onClick={() => {navigate("/signup")}}>Signup</button>
          </IfNotLoggedIn>
          <IfLoggedIn>
              <p> Welcome <b>{loggedInUser?.username} </b></p>
          </IfLoggedIn>
        </div>
      </div>
      </div>
        <div className="flex-container">
          <div className="flex-child-1">
            <label htmlFor="start">Starting Point:</label>
            <Autocomplete>
              <input
                type="text"
                id="origin"
                placeholder="Enter starting point"
                ref={originRef}
              />
            </Autocomplete>
          </div>
          <div className="flex-child-2">
            <label htmlFor="end">Destination:</label>
            <Autocomplete>
              <input
                type="text"
                id="destination"
                placeholder="Enter destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </div>
          <div className="flex-child-3">
            <label htmlFor="mode">Travel Mode:</label>
            <div>
              <select id="mode" ref={travelModeRef}>
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="TRANSIT">Transit</option>
              </select>
            </div>
          </div>
          <div className="flex-child-4">
            <br />
            <div>
              <button onClick={calculateRoute}><b>Calculate</b></button>
            </div>
        </div>
          {/* <br />
          <button className="btn_pan" onClick={() => map.panTo(center)}>
            🎯
          </button> */}
        </div>

      {modal && (
      <div className="modal" onClick={toggleModal}>
        <h4>WATCH OUT FOR CONSTRUCTIONS!!! </h4>
        <div className="modalImgDiv">
          <img src={marketLogo} alt="" className="modalImg" />
          <button className="close-modal" onClick={toggleModal}>Close</button>
        </div>
      </div>
      )}

      {/* <div className="rankCard"  onClick={toggleRank}> */}
        { 
          rank && 
          <div className="rankCard"  onClick={toggleRank}>
          {rankJson.map((rankObject, index) => (
            <div className="rankCardItem" key={index}>
              <p className="para"><b>Route Name: {rankObject.name}</b></p>
              <p className="para">Preference: {rankObject.like}</p>
              <p className="para">Duration: {rankObject.timeDisplay}</p>
              {/* <text>Rank: {rankObject.time}</text> */}
            </div>
          ))}
          </div>
        }
      {/* </div> */}

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={5}
          // center={center}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
            // styles: mapStyle
          }}
          onLoad={(map) => {setMap(map)}}
        >
          {filteredConstructionMarkers.map((marker, index) => (
            <MarkerF
              key={index}
              position={marker.position}
              icon={{
                url: marketLogo,
                scaledSize: new google.maps.Size(20, 20)
              }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.position}
              onCloseClick={handleCloseClick}
            >
              <div>
                <p>{selectedPlace.desc}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
    </div>
    )
}

export default App