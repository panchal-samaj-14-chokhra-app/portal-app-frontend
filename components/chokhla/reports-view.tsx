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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">रिपोर्ट्स और डाउनलोड</h2>
        <p className="text-sm text-gray-600">विभिन्न रिपोर्ट्स जेनरेट करें और डाउनलोड करें</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className={`${getColorClasses(stat.color)} border hover:shadow-lg transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${getIconColorClasses(stat.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Available Reports */}
      <Card className="border-orange-200/50 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            उपलब्ध रिपोर्ट्स
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow border-gray-200">
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
                          className="text-gray-600 hover:text-gray-800 bg-transparent"
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

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-400 to-orange-500">
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      रिपोर्ट
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">प्रकार</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">साइज</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      अंतिम अपडेट
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      कार्रवाई
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report, index) => {
                    const Icon = report.icon
                    return (
                      <tr
                        key={report.id}
                        className={`${
                          index % 2 === 0 ? "bg-orange-50" : "bg-white"
                        } hover:bg-orange-100 transition-colors duration-150`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${getIconColorClasses(report.color)} mr-4`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{report.title}</div>
                              <div className="text-sm text-gray-500">{report.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getColorClasses(report.color)}>
                            {report.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{report.size}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(report.lastGenerated).toLocaleDateString("hi-IN")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 hover:text-gray-800 bg-transparent"
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
      <Card className="border-orange-200/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <PieChart className="w-5 h-5 mr-2 text-orange-500" />
            नई रिपोर्ट जेनरेट करें
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
            >
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
              <span className="text-sm">परिवार डेटा एक्सपोर्ट</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
            >
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="text-sm">सांख्यिकी रिपोर्ट</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
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
