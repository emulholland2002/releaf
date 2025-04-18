/**
 * MapPage Component
 *
 * This page displays an interactive map of Northern Ireland.
 * It provides a full-width, responsive map container that takes up 70% of the viewport height.
 * The map functionality is implemented in the imported MapComponent.
 */
import MapComponent from "@/components/map-component"

export default function MapPage() {
  return (
    <div className="container mx-auto py-6">
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6">Northern Ireland Map</h1>

      {/* Map container */}
      <div className="h-[70vh] w-full rounded-lg overflow-hidden border border-border">
        <MapComponent />
      </div>
    </div>
  )
}
