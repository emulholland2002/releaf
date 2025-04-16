import Link from "next/link"
import { ArrowRight, Leaf, TreePine, CloudRain, Bug, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AfforestationChart from "./afforestation-chart"

export default function LearnPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Learn About Afforestation in Northern Ireland</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the importance of tree planting, current challenges, and how you can contribute to a greener future.
        </p>
      </div>

      {/* Graph Section */}
      <div className="flex justify-center mb-12">
        <Card className="mb-12 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Afforestation Trends in Northern Ireland</CardTitle>
            <CardDescription>Annual tree planting rates and woodland coverage from 2010-2023</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <AfforestationChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Facts Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Key Facts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <TreePine className="h-6 w-6 text-green-700" />
              </div>
              <CardTitle className="text-xl">Current Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-700 mb-2">8.7%</p>
              <p className="text-muted-foreground">
                Northern Ireland has approximately 8.7% woodland cover, the lowest in the UK and well below the European
                average of 37%.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Leaf className="h-6 w-6 text-green-700" />
              </div>
              <CardTitle className="text-xl">Planting Target</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-700 mb-2">9,000 ha</p>
              <p className="text-muted-foreground">
                The Northern Ireland Forestry Strategy aims to increase woodland cover by planting 9,000 hectares of new
                woodland by 2030.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <CardTitle className="text-xl">Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-700 mb-2">70%</p>
              <p className="text-muted-foreground">
                70% of people in Northern Ireland live within 5 miles of a forest, with forests receiving approximately
                5 million visits annually.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Benefits of Afforestation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-green-600" />
                <CardTitle>Climate Resilience</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Trees absorb approximately 22 kg of CO₂ per year, helping combat climate change</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Woodlands reduce flood risk by slowing water runoff and improving soil absorption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Trees help stabilize soil and prevent erosion, particularly important in hilly regions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-green-600" />
                <CardTitle>Biodiversity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Native woodlands support over 1,000 species of wildlife in Northern Ireland</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Mixed woodland planting creates diverse habitats for threatened species</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Forest corridors allow wildlife to move safely between habitats</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Challenges Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Current Challenges</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-amber-700">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Low Planting Rates</h3>
                  <p className="text-muted-foreground">
                    Current planting rates are approximately 200 hectares per year, well below the 900 hectares needed
                    annually to meet 2030 targets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-amber-700">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Land Use Competition</h3>
                  <p className="text-muted-foreground">
                    Agricultural priorities often compete with afforestation goals, with 75% of Northern Ireland's land
                    used for farming.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-amber-700">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Funding Gaps</h3>
                  <p className="text-muted-foreground">
                    Despite government schemes, funding remains insufficient to incentivize widespread private landowner
                    participation in afforestation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Help Us Make Northern Ireland Greener</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
          Join our efforts to increase woodland coverage, improve biodiversity, and combat climate change through
          afforestation.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/donate">
              Support Our Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/volunteer">Volunteer With Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
