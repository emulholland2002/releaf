import MapComponent from "@/components/map-component"

export const metadata = {
  title: "ReLeaf NI - Map",
  description: "Interactive map of Northern Ireland",
}

export default function MapPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Northern Ireland Map</h1>
      <div className="h-[70vh] w-full rounded-lg overflow-hidden border border-border">
        <MapComponent />
      </div>
    </div>
  )
}
