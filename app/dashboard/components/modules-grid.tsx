"use client"

import { MapPin, Home, Users, UserCheck, Shield, Award, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ModulesGridProps {
  setActiveModule: (module: string) => void
}

const modules = [
  {
    id: "chokhras",
    title: "चोखरा प्रबंधन",
    description: "चोखरा जोड़ें/संपादित करें, दृश्यता स्थिति सेट करें",
    icon: MapPin,
    color: "from-orange-500 to-orange-600",
    count: "14 चोखरा",
  },
  {
    id: "villages",
    title: "गांव प्रबंधन",
    description: "गांव जोड़ें/संपादित करें, गांव एडमिन असाइन करें",
    icon: Home,
    color: "from-blue-500 to-blue-600",
    count: "24 गांव",
  },
  {
    id: "families",
    title: "परिवार प्रबंधन",
    description: "परिवार की जानकारी, पारिवारिक कार्ड स्थिति",
    icon: Users,
    color: "from-green-500 to-green-600",
    count: "2,847 परिवार",
  },
  {
    id: "members",
    title: "सदस्य प्रबंधन",
    description: "व्यक्तिगत सदस्य विवरण, दृश्यता नियंत्रण",
    icon: UserCheck,
    color: "from-purple-500 to-purple-600",
    count: "12,456 सदस्य",
  },
  {
    id: "admins",
    title: "एडमिन प्रबंधन",
    description: "एडमिन उपयोगकर्ता, भूमिकाएं और अनुमतियां",
    icon: Shield,
    color: "from-red-500 to-red-600",
    count: "47 एडमिन",
  },
  {
    id: "schemes",
    title: "योजना प्रबंधन",
    description: "सामुदायिक योजनाएं, पात्रता फिल्टर",
    icon: Award,
    color: "from-indigo-500 to-indigo-600",
    count: "12 योजनाएं",
  },
]

export function ModulesGrid({ setActiveModule }: ModulesGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">प्रबंधन मॉड्यूल</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Home className="w-4 h-4 mr-2" />
            होम
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            रिफ्रेश
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Card
              key={module.id}
              className="bg-gradient-to-br from-white to-orange-50 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {module.count}
                  </Badge>
                </div>
                <CardTitle className="text-orange-700">{module.title}</CardTitle>
                <CardDescription className="text-gray-600">{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setActiveModule(module.id)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  खोलें
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
