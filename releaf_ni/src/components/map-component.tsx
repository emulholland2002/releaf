/**
 * Map Component
 *
 * This component renders an interactive map of Northern Ireland using Leaflet.
 * It displays the region boundary, major cities, and includes a custom legend.
 * The component handles client-side only rendering to avoid SSR issues with Leaflet.
 */

"use client"

// React hooks for state and refs
import { useEffect, useRef, useState } from "react"

// Leaflet types (imported without the actual library to avoid SSR issues)
import type { Map as LeafletMap, LatLngExpression } from "leaflet"

/**
 * Client-side Map Component
 *
 * This nested component handles all the Leaflet-specific code and is only
 * rendered on the client side to avoid server-side rendering issues.
 */
const MapComponentClient = () => {
  // Reference to the Leaflet map instance
  const mapRef = useRef<LeafletMap | null>(null)

  // Reference to the DOM element that will contain the map
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // State to track if we're on the client side
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set isClient to true once the component is mounted
    // This ensures we only run Leaflet code in the browser
    setIsClient(true)

    /**
     * Initialise the Leaflet map
     * This function dynamically imports Leaflet and sets up the map
     */
    const initializeMap = async () => {
      // Dynamically import Leaflet only on the client side
      // This prevents SSR issues with Next.js
      const L = await import("leaflet")

      // Import Leaflet CSS
      await import("leaflet/dist/leaflet.css")

      /**
       * Fix for Leaflet marker icons in Next.js
       * This is needed because Leaflet's default icon paths don't work with Next.js
       */
      const fixLeafletIcon = () => {
        delete (L.Icon.Default.prototype as any)._getIconUrl

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        })
      }

      // Initialise map if it doesn't exist yet and the container is available
      if (!mapRef.current && mapContainerRef.current) {
        // Fix Leaflet icon issue
        fixLeafletIcon()

        // Northern Ireland coordinates (approximate center)
        const niCenter: LatLngExpression = [54.7877, -6.4923]

        // Create map instance and set the view to Northern Ireland
        mapRef.current = L.map(mapContainerRef.current).setView(niCenter, 8)

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current)

        // Add Northern Ireland boundary (simplified polygon)
        // These coordinates represent a simplified outline of Northern Ireland
        const niBoundary: LatLngExpression[] = [
          [55.3333, -6.4167], // North
          [55.0167, -5.6667], // Northeast
          [54.0667, -5.4667], // East
          [54.0167, -6.0], // Southeast
          [54.0, -7.5], // South
          [54.6167, -8.1667], // Southwest
          [55.2667, -7.5], // West
          [55.3333, -6.4167], // Back to North
        ]

        // Create a polygon with the boundary coordinates
        L.polygon(niBoundary, {
          color: "green",
          weight: 2,
          fillOpacity: 0.1,
        }).addTo(mapRef.current)

        // Add some major cities as markers
        const cities: { name: string; coords: LatLngExpression }[] = [
          { name: "Belfast", coords: [54.5973, -5.9301] },
          { name: "Derry", coords: [54.9966, -7.3086] },
          { name: "Newry", coords: [54.1753, -6.3402] },
          { name: "Armagh", coords: [54.3503, -6.6528] },
          { name: "Enniskillen", coords: [54.3438, -7.6314] },
        ]

        // Add each city as a marker with a popup
        cities.forEach((city) => {
          L.marker(city.coords).addTo(mapRef.current!).bindPopup(`<b>${city.name}</b>`)
        })

        // Add a custom legend to the map
        const legend = L.control({ position: "bottomright" })

        // Define the HTML content for the legend
        legend.onAdd = () => {
          const div = L.DomUtil.create("div", "legend")
          div.innerHTML = `
            <div style="
              background: white; 
              padding: 10px; 
              border-radius: 4px; 
              border: 1px solid #ccc;
              box-shadow: 0 1px 5px rgba(0,0,0,0.2);
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.5;
            ">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Map Legend</h4>
              
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <div style="
                  width: 20px; 
                  height: 20px; 
                  background-color: #2d6a4f; 
                  margin-right: 8px;
                  border-radius: 3px;
                "></div>
                <span>Forest Areas</span>
              </div>
              
              <div style="display: flex; align-items: center; margin-bottom: 6px;">
                <div style="
                  width: 20px; 
                  height: 20px; 
                  border: 2px solid green; 
                  margin-right: 8px;
                  background-color: rgba(0, 128, 0, 0.1);
                  border-radius: 3px;
                "></div>
                <span>Northern Ireland Boundary</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <div style="
                  width: 20px; 
                  height: 20px; 
                  background-image: url('https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png');
                  background-size: contain;
                  background-repeat: no-repeat;
                  background-position: center;
                  margin-right: 8px;
                "></div>
                <span>Major Cities</span>
              </div>
            </div>
          `
          return div
        }

        // Add the legend to the map
        legend.addTo(mapRef.current)
      }
    }

    // Initialise the map if we're on the client side
    if (isClient) {
      initializeMap()
    }

    // Cleanup function to remove the map when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isClient]) // Only re-run if isClient changes

  // Render a div that will contain the map
  return <div className="h-full w-full" ref={mapContainerRef}></div>
}

/**
 * Map Component Wrapper
 *
 * This wrapper component provides the container for the client-side map component.
 * It ensures proper sizing and positioning of the map.
 */
const MapComponent = () => {
  return (
    <div className="h-full w-full relative">
      <MapComponentClient />
    </div>
  )
}

export default MapComponent
