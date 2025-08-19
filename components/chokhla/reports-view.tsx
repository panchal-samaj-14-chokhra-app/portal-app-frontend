"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Printer,
} from "lucide-react"

export function ReportsView() {
  const reports = [
    {
      id: 1,
      title: "गांव-वार परिवार रिपोर्ट",
      description: "सभी गांवों में परिवारों की विस्तृत जानकारी",
      type: "Excel",
      icon: FileSpreadsheet,
      color: "green",
      lastGenerated: "2024-01-15",
      size: "2.3 MB",
    },
    {
      id: 2,
      title: "सुविधाओं की रिपोर्ट",
      description: "स्कूल, स्वास्थ्य केंद्र और सामुदायिक हॉल की स्थिति",
      type: "PDF",
      icon: FileText,
      color: "blue",
      lastGenerated: "2024-01-14",
      size: "1.8 MB",
    },
    {
      id: 3,
      title: "जनसांख्यिकी रिपोर्ट",
      description: "आयु, लिंग और शिक्षा के आधार पर विश्लेषण",
      type: "PDF",
      icon: BarChart3,
      color: "purple",
      lastGenerated: "2024-01-13",
      size: "3.1 MB",
    },
    {
      id: 4,
      title: "संपर्क सूची",
      description: "सभी गांव प्रतिनिधियों की संपर्क जानकारी",
      type: "Excel",
      icon: Users,
      color: "orange",
      lastGenerated: "2024-01-12",
      size: "0.9 MB",
    },
  ]

  const quickStats = [
    {
      title: "कुल रिपोर्ट्स",
      value: "12",
      icon: FileText,
      color: "blue",
    },
    {
      title: "इस महीने जेनरेट की गई",
      value: "4",
      icon: Calendar,
      color: "green",
    },
    {
      title: "कुल डाउनलोड",
      value: "156",
      icon: Download,
      color: "purple",
    },
    {
      title: "औसत फाइल साइज",
      value: "2.1 MB",
      icon: TrendingUp,
      color: "orange",
    },
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      red: "bg-red-50 text-red-700 border-red-200",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
      red: "bg-red-500 text-white",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-700">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${getIconColorClasses(stat.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Available Reports */}
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            उपलब्ध रिपोर्ट्स
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {reports.map((report) => {
                const Icon = report.icon
                return (
                  <Card key={report.id} className="border border-orange-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${getIconColorClasses(report.color)} mr-3`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{report.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <Badge variant="outline" className={getColorClasses(report.color)}>
                            {report.type}
                          </Badge>
                          <span>{report.size}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-gray-600 hover:text-gray-800 bg-transparent border-orange-200"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            डाउनलोड
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          अंतिम बार जेनरेट: {new Date(report.lastGenerated).toLocaleDateString("hi-IN")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full divide-y divide-orange-200">
                <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      रिपोर्ट
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      प्रकार
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      साइज
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      अंतिम अपडेट
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      कार्रवाई
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-100">
                  {reports.map((report, index) => {
                    const Icon = report.icon
                    return (
                      <tr
                        key={report.id}
                        className={`transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-orange-50 hover:bg-orange-100" : "bg-white hover:bg-orange-50"
                        }`}
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getIconColorClasses(report.color)} mr-4`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-orange-900">{report.title}</div>
                              <div className="text-sm text-gray-500">{report.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getColorClasses(report.color)}>
                            {report.type}
                          </Badge>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-sm text-orange-800">{report.size}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="text-sm text-orange-800">
                            {new Date(report.lastGenerated).toLocaleDateString("hi-IN")}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 hover:text-gray-800 bg-transparent border-orange-200"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              डाउनलोड
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate New Report */}
      <Card className="shadow-xl border-orange-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
            <PieChart className="w-5 h-5 sm:w-6 sm:h-6" />
            नई रिपोर्ट जेनरेट करें
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent border-orange-200"
            >
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
              <span className="text-sm">परिवार डेटा एक्सपोर्ट</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent border-orange-200"
            >
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="text-sm">सांख्यिकी रिपोर्ट</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent border-orange-200"
            >
              <MapPin className="w-6 h-6 text-purple-600" />
              <span className="text-sm">गांव सूची</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
