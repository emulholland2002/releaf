"use client"

/**
 * Carbon Footprint Calculator Component
 *
 * This component allows users to calculate their carbon footprint based on
 * transportation, home energy, and food consumption habits. It provides a
 * tabbed interface for data entry and displays results with recommendations.
 */

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

// Define types for form data and results
type FormData = {
  // Transportation
  carMiles: number
  publicTransportMiles: number
  flightHours: number

  // Home
  electricityUsage: number
  gasUsage: number
  householdSize: number

  // Food
  meatConsumption: number
  dairyConsumption: number
  localFoodPercentage: number
}

type Results = {
  transportation: number
  home: number
  food: number
  total: number
}

type ValidationErrors = {
  [key in keyof FormData]?: string
}

export default function CarbonCalculator() {
  // State for calculation results
  const [results, setResults] = useState<Results | null>(null)

  // State for form data with default values
  const [formData, setFormData] = useState<FormData>({
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

  // State for validation errors
  const [errors, setErrors] = useState<ValidationErrors>({})

  // State for general error message
  const [generalError, setGeneralError] = useState<string | null>(null)

  // State to track active tab
  const [activeTab, setActiveTab] = useState<string>("transportation")

  /**
   * Handle input changes and validate as user types
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, min, max } = e.target

    // Parse the input value as a number
    let numValue = value === "" ? 0 : Number.parseFloat(value)

    // Validate min/max if specified
    if (min !== "" && numValue < Number(min)) {
      numValue = Number(min)
    }
    if (max !== "" && numValue > Number(max)) {
      numValue = Number(max)
    }

    // Update form data
    setFormData({
      ...formData,
      [name]: numValue,
    })

    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  /**
   * Validate all form inputs before calculation
   * @returns boolean indicating if form is valid
   */
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    // Validate transportation inputs
    if (formData.carMiles < 0) {
      newErrors.carMiles = "Car miles cannot be negative"
      isValid = false
    }

    if (formData.publicTransportMiles < 0) {
      newErrors.publicTransportMiles = "Public transport miles cannot be negative"
      isValid = false
    }

    if (formData.flightHours < 0) {
      newErrors.flightHours = "Flight hours cannot be negative"
      isValid = false
    }

    // Validate home inputs
    if (formData.electricityUsage < 0) {
      newErrors.electricityUsage = "Electricity usage cannot be negative"
      isValid = false
    }

    if (formData.gasUsage < 0) {
      newErrors.gasUsage = "Gas usage cannot be negative"
      isValid = false
    }

    if (formData.householdSize < 1) {
      newErrors.householdSize = "Household size must be at least 1"
      isValid = false
    }

    // Validate food inputs
    if (formData.meatConsumption < 0) {
      newErrors.meatConsumption = "Meat consumption cannot be negative"
      isValid = false
    }

    if (formData.dairyConsumption < 0) {
      newErrors.dairyConsumption = "Dairy consumption cannot be negative"
      isValid = false
    }

    if (formData.localFoodPercentage < 0 || formData.localFoodPercentage > 100) {
      newErrors.localFoodPercentage = "Local food percentage must be between 0 and 100"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  /**
   * Calculate carbon footprint based on form inputs
   */
  const calculateFootprint = () => {
    try {
      // Reset any previous errors
      setGeneralError(null)

      // Validate form before calculation
      if (!validateForm()) {
        // Find the first tab with errors and switch to it
        if (errors.carMiles || errors.publicTransportMiles || errors.flightHours) {
          setActiveTab("transportation")
        } else if (errors.electricityUsage || errors.gasUsage || errors.householdSize) {
          setActiveTab("home")
        } else if (errors.meatConsumption || errors.dairyConsumption || errors.localFoodPercentage) {
          setActiveTab("food")
        }
        return
      }

      // Check if all inputs are zero
      const hasInput = Object.values(formData).some((value) => value > 0)
      if (!hasInput) {
        setGeneralError("Please enter at least one value to calculate your carbon footprint")
        return
      }

      // Calculate transportation footprint (kg CO2e)
      // Car: 0.35 kg CO2e per mile
      // Public transport: 0.15 kg CO2e per mile
      // Flights: 90 kg CO2e per hour
      const transportation = formData.carMiles * 0.35 + formData.publicTransportMiles * 0.15 + formData.flightHours * 90

      // Calculate home energy footprint (kg CO2e)
      // Electricity: 0.191 kg CO2e per kWh
      // Gas: 0.203 kg CO2e per kWh
      // Divided by household size for per-person impact
      const home = (formData.electricityUsage * 0.191 + formData.gasUsage * 0.203) / Math.max(1, formData.householdSize)

      // Calculate food footprint (kg CO2e)
      // Meat: 50 kg CO2e per meal
      // Dairy: 1.13 kg CO2e per serving
      // Local food reduces footprint by 0.3 kg CO2e per percentage point
      const food = formData.meatConsumption * 50 + formData.dairyConsumption * 1.13 - formData.localFoodPercentage * 0.3

      // Calculate total footprint
      const total = transportation + home + food

      // Update results
      setResults({
        transportation: Math.max(0, transportation),
        home: Math.max(0, home),
        food: Math.max(0, food),
        total: Math.max(0, total),
      })
    } catch (error) {
      console.error("Error calculating carbon footprint:", error)
      setGeneralError("An error occurred while calculating your carbon footprint. Please try again.")
    }
  }

  /**
   * Reset the form and results
   */
  const resetCalculator = () => {
    setFormData({
      carMiles: 0,
      publicTransportMiles: 0,
      flightHours: 0,
      electricityUsage: 0,
      gasUsage: 0,
      householdSize: 1,
      meatConsumption: 0,
      dairyConsumption: 0,
      localFoodPercentage: 0,
    })
    setResults(null)
    setErrors({})
    setGeneralError(null)
  }

  /**
   * Get recommendations based on results
   */
  const getRecommendations = () => {
    if (!results) return []

    const recommendations = []

    // Transportation recommendations
    if (results.transportation > 100) {
      recommendations.push("Consider carpooling or using public transport more frequently")
      recommendations.push("Look into electric vehicles for your next car purchase")
    }

    // Home recommendations
    if (results.home > 50) {
      recommendations.push("Switch to renewable energy sources for your home")
      recommendations.push("Improve home insulation to reduce energy consumption")
    }

    // Food recommendations
    if (results.food > 100) {
      recommendations.push("Reduce your meat consumption by having plant-based meals several times a week")
      recommendations.push("Try to buy more locally sourced food to reduce transportation emissions")
    }

    // Always include general recommendation
    recommendations.push("Support our reforestation efforts by making a donation")

    return recommendations
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

        {generalError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{generalError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    min="0"
                    value={formData.carMiles || ""}
                    onChange={handleInputChange}
                    className={errors.carMiles ? "border-red-500" : ""}
                  />
                  {errors.carMiles && <p className="text-red-500 text-sm mt-1">{errors.carMiles}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicTransportMiles">Public transport miles per week</Label>
                  <Input
                    id="publicTransportMiles"
                    name="publicTransportMiles"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.publicTransportMiles || ""}
                    onChange={handleInputChange}
                    className={errors.publicTransportMiles ? "border-red-500" : ""}
                  />
                  {errors.publicTransportMiles && (
                    <p className="text-red-500 text-sm mt-1">{errors.publicTransportMiles}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flightHours">Flight hours per year</Label>
                  <Input
                    id="flightHours"
                    name="flightHours"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.flightHours || ""}
                    onChange={handleInputChange}
                    className={errors.flightHours ? "border-red-500" : ""}
                  />
                  {errors.flightHours && <p className="text-red-500 text-sm mt-1">{errors.flightHours}</p>}
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="home">
              <CardHeader>
                <CardTitle>Home Energy</CardTitle>
                <CardDescription>Tell us about your home energy usage per household.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="electricityUsage">Electricity usage (kWh per month)</Label>
                  <Input
                    id="electricityUsage"
                    name="electricityUsage"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.electricityUsage || ""}
                    onChange={handleInputChange}
                    className={errors.electricityUsage ? "border-red-500" : ""}
                  />
                  {errors.electricityUsage && <p className="text-red-500 text-sm mt-1">{errors.electricityUsage}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gasUsage">Gas usage (kWh per month)</Label>
                  <Input
                    id="gasUsage"
                    name="gasUsage"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.gasUsage || ""}
                    onChange={handleInputChange}
                    className={errors.gasUsage ? "border-red-500" : ""}
                  />
                  {errors.gasUsage && <p className="text-red-500 text-sm mt-1">{errors.gasUsage}</p>}
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
                    className={errors.householdSize ? "border-red-500" : ""}
                  />
                  {errors.householdSize && <p className="text-red-500 text-sm mt-1">{errors.householdSize}</p>}
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
                  <Label htmlFor="meatConsumption">Red meat meals per week</Label>
                  <Input
                    id="meatConsumption"
                    name="meatConsumption"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.meatConsumption || ""}
                    onChange={handleInputChange}
                    className={errors.meatConsumption ? "border-red-500" : ""}
                  />
                  {errors.meatConsumption && <p className="text-red-500 text-sm mt-1">{errors.meatConsumption}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dairyConsumption">Dairy servings per week</Label>
                  <Input
                    id="dairyConsumption"
                    name="dairyConsumption"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={formData.dairyConsumption || ""}
                    onChange={handleInputChange}
                    className={errors.dairyConsumption ? "border-red-500" : ""}
                  />
                  {errors.dairyConsumption && <p className="text-red-500 text-sm mt-1">{errors.dairyConsumption}</p>}
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
                    className={errors.localFoodPercentage ? "border-red-500" : ""}
                  />
                  {errors.localFoodPercentage && (
                    <p className="text-red-500 text-sm mt-1">{errors.localFoodPercentage}</p>
                  )}
                </div>
              </CardContent>
            </TabsContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button onClick={calculateFootprint} className="w-full bg-green-600 hover:bg-green-700">
                Calculate My Carbon Footprint
              </Button>
              {results && (
                <Button onClick={resetCalculator} variant="outline" className="w-full border-green-600 text-green-700">
                  Reset Calculator
                </Button>
              )}
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
                    <p className="text-xs text-gray-500 mt-1">
                      {results.transportation > 0
                        ? `${((results.transportation / results.total) * 100).toFixed(1)}% of your total footprint`
                        : "No transportation emissions recorded"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800">Home Energy</h3>
                    <p className="text-2xl font-bold">{results.home.toFixed(2)} kg CO₂e</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {results.home > 0
                        ? `${((results.home / results.total) * 100).toFixed(1)}% of your total footprint`
                        : "No home energy emissions recorded"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800">Food</h3>
                    <p className="text-2xl font-bold">{results.food.toFixed(2)} kg CO₂e</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {results.food > 0
                        ? `${((results.food / results.total) * 100).toFixed(1)}% of your total footprint`
                        : "No food emissions recorded"}
                    </p>
                  </div>
                </div>

                <div className="bg-green-100 p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Total Carbon Footprint</h3>
                  <p className="text-4xl font-bold text-green-800">{results.total.toFixed(2)} kg CO₂e</p>
                  <p className="text-sm text-gray-600 mt-2">
                    The average person produces about 4,000 kg CO₂e per year.
                  </p>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">About This Calculation</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    This is a simplified estimate based on average emissions factors. Your actual carbon footprint may
                    vary based on specific circumstances like your car's fuel efficiency, your home's energy source, and
                    other factors.
                  </AlertDescription>
                </Alert>

                <div className="bg-white p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">What You Can Do</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    {getRecommendations().map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
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
