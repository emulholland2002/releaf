"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CarbonCalculator() {
  const [results, setResults] = useState<{
    transportation: number
    home: number
    food: number
    total: number
  } | null>(null)

  const [formData, setFormData] = useState({
    // Transportation
    carMiles: 0,
    publicTransportMiles: 0,
    flightHours: 0,

    // Home
    electricityUsage: 0,
    gasUsage: 0,
    householdSize: 1,

    // Food
    meatConsumption: 0,
    dairyConsumption: 0,
    localFoodPercentage: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: Number.parseFloat(value) || 0,
    })
  }

  const calculateFootprint = () => {
    // Simple calculation model (would be more complex in a real app)
    const transportation = formData.carMiles * 0.35 + formData.publicTransportMiles * 0.15 + formData.flightHours * 90

    const home = (formData.electricityUsage * 0.5 + formData.gasUsage * 0.2) / Math.max(1, formData.householdSize)

    const food = formData.meatConsumption * 50 + formData.dairyConsumption * 20 - formData.localFoodPercentage * 0.3

    const total = transportation + home + food

    setResults({
      transportation,
      home,
      food,
      total,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Carbon Footprint Calculator</h1>
          <p className="text-gray-600">
            Estimate your carbon footprint and learn how you can reduce your environmental impact.
          </p>
        </div>

        <Tabs defaultValue="transportation" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
          </TabsList>

          <Card>
            <TabsContent value="transportation">
              <CardHeader>
                <CardTitle>Transportation</CardTitle>
                <CardDescription>How do you get around? Enter your typical weekly usage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="carMiles">Car miles per week</Label>
                  <Input
                    id="carMiles"
                    name="carMiles"
                    type="number"
                    placeholder="0"
                    value={formData.carMiles || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicTransportMiles">Public transport miles per week</Label>
                  <Input
                    id="publicTransportMiles"
                    name="publicTransportMiles"
                    type="number"
                    placeholder="0"
                    value={formData.publicTransportMiles || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flightHours">Flight hours per year</Label>
                  <Input
                    id="flightHours"
                    name="flightHours"
                    type="number"
                    placeholder="0"
                    value={formData.flightHours || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="home">
              <CardHeader>
                <CardTitle>Home Energy</CardTitle>
                <CardDescription>Tell us about your home energy usage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="electricityUsage">Electricity usage (kWh per month)</Label>
                  <Input
                    id="electricityUsage"
                    name="electricityUsage"
                    type="number"
                    placeholder="0"
                    value={formData.electricityUsage || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gasUsage">Gas usage (therms per month)</Label>
                  <Input
                    id="gasUsage"
                    name="gasUsage"
                    type="number"
                    placeholder="0"
                    value={formData.gasUsage || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="householdSize">Number of people in household</Label>
                  <Input
                    id="householdSize"
                    name="householdSize"
                    type="number"
                    placeholder="1"
                    min="1"
                    value={formData.householdSize || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="food">
              <CardHeader>
                <CardTitle>Food Choices</CardTitle>
                <CardDescription>Your diet has a significant impact on your carbon footprint.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meatConsumption">Meat meals per week</Label>
                  <Input
                    id="meatConsumption"
                    name="meatConsumption"
                    type="number"
                    placeholder="0"
                    value={formData.meatConsumption || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dairyConsumption">Dairy servings per week</Label>
                  <Input
                    id="dairyConsumption"
                    name="dairyConsumption"
                    type="number"
                    placeholder="0"
                    value={formData.dairyConsumption || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localFoodPercentage">Percentage of locally sourced food (0-100)</Label>
                  <Input
                    id="localFoodPercentage"
                    name="localFoodPercentage"
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={formData.localFoodPercentage || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </TabsContent>

            <CardFooter>
              <Button onClick={calculateFootprint} className="w-full bg-green-600 hover:bg-green-700">
                Calculate My Carbon Footprint
              </Button>
            </CardFooter>
          </Card>
        </Tabs>

        {results && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Carbon Footprint Results</CardTitle>
              <CardDescription>
                Based on the information you provided, here's an estimate of your carbon footprint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800">Transportation</h3>
                    <p className="text-2xl font-bold">{results.transportation.toFixed(2)} kg CO₂e</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800">Home Energy</h3>
                    <p className="text-2xl font-bold">{results.home.toFixed(2)} kg CO₂e</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800">Food</h3>
                    <p className="text-2xl font-bold">{results.food.toFixed(2)} kg CO₂e</p>
                  </div>
                </div>

                <div className="bg-green-100 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Total Carbon Footprint</h3>
                  <p className="text-4xl font-bold text-green-800">{results.total.toFixed(2)} kg CO₂e</p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">What You Can Do</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Consider carpooling or using public transport more frequently</li>
                    <li>Reduce your meat consumption by having plant-based meals several times a week</li>
                    <li>Switch to renewable energy sources for your home</li>
                    <li>Support our reforestation efforts by making a donation</li>
                  </ul>
                  <div className="mt-6">
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <a href="/donate">Offset Your Carbon Footprint</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
