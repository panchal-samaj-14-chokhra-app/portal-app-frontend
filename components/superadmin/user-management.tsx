"use client"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Users, Plus, UserCheck, UserX, Loader2, Mail } from "lucide-react"
import { Input } from "../ui/input/input"
import { useEffect, useState } from "react"

interface User {
  id: string
  fullName: string
  email: string
  globalRole: string
  isActive: boolean
  createdAt: string
  CodeNo?: string;
  village?: {
    name: string
  }
  chokhla?: {
    name: string
  }
}

interface PaginationInfo {
  page: number;
  totalPages: number;
  limit: number;
}

interface UserManagementProps {
  totalPages: number
  users: User[];
  isLoading: boolean;
  error: string | null;
  onAddUser: () => void;
  onToggleActive: (userId: string, currentStatus: boolean) => void;
  pagination: PaginationInfo; // Correct type
  setPagination: (pageInfo: PaginationInfo) => void; // Correct type
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  globalRole: string;
  setGlobalRole: (role: string) => void;
  onlyActive: boolean;
  setOnlyActive: (onlyActive: boolean) => void;
}
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


const UserManagement: React.FC<UserManagementProps> = ({ users,
  globalRole, setGlobalRole,
  setSearchTerm,
  searchTerm,
  isLoading,
  error,
  onAddUser,
  onToggleActive,
  pagination = { page: 1, totalPages: 1, limit: 15 }, // default
  setPagination,
  onlyActive,
  setOnlyActive,
  totalPages }) => {

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge className="bg-red-100 text-red-700 border-red-200">सुपर एडमिन</Badge>
      case "CHOKHLA_MEMBER":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">चोखरा एडमिन</Badge>
      case "VILLAGE_MEMBER":
        return <Badge className="bg-green-100 text-green-700 border-green-200">गांव सदस्य</Badge>
      default:
        return <Badge className=" bg-pink-600 text-white border-pink-600" variant="outline" > मेट्रिमोनियल सदस्य</Badge >
    }
  }

  const roleList = [
    { role: "", text: "सभी भूमिकाएँ" },
    { role: "SUPER_ADMIN", text: "सुपर एडमिन" },
    { role: "CHOKHLA_MEMBER", text: "चोखरा एडमिन" },
    { role: "VILLAGE_MEMBER", text: "गांव सदस्य" },
    { role: "MATRIMONIAL_USER", text: "मेट्रिमोनियल सदस्य" }
  ];


  const handleBadgeClick = (role: string) => {
    setGlobalRole(role);
    setPagination({ ...pagination, page: 1 }); // Reset to first page on role change
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        <UserCheck className="w-3 h-3 mr-1" />
        सक्रिय
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-700 border-red-200">
        <UserX className="w-3 h-3 mr-1" />
        निष्क्रिय
      </Badge>
    )
  }

  // if (isLoading) {
  //   return (
  //     <div className="w-full">
  //       <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
  //         <CardHeader>
  //           <CardTitle className="flex items-center text-orange-700">
  //             <Users className="w-5 h-5 mr-2" />
  //             यूज़र प्रबंधन
  //           </CardTitle>
  //           <CardDescription>सभी उपयोगकर्ताओं की जानकारी और प्रबंधन</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="flex items-center justify-center py-12">
  //             <div className="text-center">
  //               <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
  //               <p className="text-gray-600">उपयोगकर्ताओं की जानकारी लोड हो रही है...</p>
  //             </div>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  if (error) {
    return (
      <div className="w-full">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-red-200/50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <Users className="w-5 h-5 mr-2" />
              यूज़र प्रबंधन
            </CardTitle>
            <CardDescription>सभी उपयोगकर्ताओं की जानकारी और प्रबंधन</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">त्रुटि</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeUsers = users?.filter((user) => user.isActive)?.length || 0
  const inactiveUsers = users?.filter((user) => !user.isActive)?.length || 0

  return (
    <div className="w-full space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">कुल यूज़र</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{users?.length || 0}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">सक्रिय यूज़र</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700">{activeUsers}</p>
              </div>
              <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">निष्क्रिय यूज़र</p>
                <p className="text-xl sm:text-2xl font-bold text-red-700">{inactiveUsers}</p>
              </div>
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">नया यूज़र</p>
                <Button onClick={onAddUser} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white mt-2">
                  <Plus className="w-4 h-4 mr-1" />
                  जोड़ें
                </Button>
              </div>
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table/Cards */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-orange-200/50">
        <CardHeader className="py-2 px-4 sm:py-3 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">

            {/* Left side: Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
              <CardTitle className="flex items-center text-orange-700 text-sm sm:text-base font-bold">
                <Users className="w-4 h-4 mr-1.5" />
                उपयोगकर्ताओं की सूची
              </CardTitle>

            </div>

            {/* Middle: Search Input */}
            <div className="w-full sm:w-1/3">
              <Input
                placeholder="नाम, ईमेल या कोड नंबर खोजें"
                className="w-full border-orange-300 text-sm py-1.5"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
        </CardHeader>

        <div className="p-2 bg-white">
          <div className="flex flex-wrap gap-2">
            {roleList.map((item) => (
              <Badge
                key={item.role}
                onClick={() => handleBadgeClick(item.role)}
                className={`
          cursor-pointer px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all
          ${globalRole === item.role
                    ? "bg-pink-600 text-white shadow-md"   // Matrimonial सदस्य active
                    : "text-pink-600 bg-pink-50 hover:bg-pink-100"} // Not selected
        `}
              >
                {item.text}
              </Badge>
            ))}

            {/* Active User Badge (सक्रिय सदस्य) */}
            <Badge
              onClick={() => setOnlyActive(true)}
              className={`
        cursor-pointer px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all
        ${onlyActive === true
                  ? "bg-green-600 text-white shadow-md"
                  : "text-green-600 bg-green-50 hover:bg-green-100"}
      `}
            >
              सक्रिय सदस्य
            </Badge>

            {/* Inactive User Badge (निष्क्रिय सदस्य) */}
            <Badge
              onClick={() => setOnlyActive(false)}
              className={`
        cursor-pointer px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all
        ${onlyActive === false
                  ? "bg-red-600 text-white shadow-md"
                  : "text-red-600 bg-red-50 hover:bg-red-100"}
      `}
            >
              निष्क्रिय सदस्य
            </Badge>
          </div>
        </div>





        {
          !isLoading && (<CardContent className="p-0 sm:p-6">
            {/* Mobile Card Layout */}
            <div className="block md:hidden">
              {users?.length > 0 ? (
                <div className="space-y-4 p-4">
                  {users.map((user, index) => (
                    <Card key={user.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">#{index + 1}</Badge>
                            <h3 className="font-semibold text-gray-900 text-sm">{user.fullName}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(user.isActive)}
                            <Switch
                              checked={user.isActive}
                              onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                              className="data-[state=checked]:bg-green-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 truncate">{user.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">भूमिका:</span>
                            {getRoleBadge(user.globalRole)}
                          </div>
                          {user.village && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">गांव:</span>
                              <span className="font-medium text-xs">{user.village.name}</span>
                            </div>
                          )}
                          {user.chokhla && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">चोखरा:</span>
                              <span className="font-medium text-xs">{user.chokhla.name}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">पंजीकरण:</span>
                            <span className="text-xs text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-gray-600">PS कोड संख्या:</span>
                            <span className="text-xs text-gray-500">
                              {user?.CodeNo ? user.CodeNo : <span className="text-gray-500">-</span>}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
                  <p className="text-gray-600 mb-4">अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है</p>
                  <Button onClick={onAddUser} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    पहला उपयोगकर्ता जोड़ें
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">क्र.सं.</TableHead>
                    <TableHead>नाम</TableHead>
                    <TableHead>ईमेल</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>पंजीकरण तिथि</TableHead>


                    <TableHead>PS कोड संख्या</TableHead>


                    <TableHead className="text-center">सक्रिय/निष्क्रिय</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.length > 0 ? (
                    users.map((user, index) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Badge className="bg-orange-100 text-orange-700 border-orange-200">{index + 1}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-600" />
                            {user.fullName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="truncate max-w-[200px]" title={user.email}>
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.globalRole)}</TableCell>

                        <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString("hi-IN")}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {user.CodeNo ? user.CodeNo : <span className="text-gray-500">-</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={() => onToggleActive(user.id, user.isActive)}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">कोई उपयोगकर्ता नहीं मिला</h3>
                        <p className="text-gray-600 mb-4">अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है</p>
                        <Button onClick={onAddUser} className="bg-orange-600 hover:bg-orange-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          पहला उपयोगकर्ता जोड़ें
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>)

        }

      </Card>
      {
        !isLoading ? (<Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => setPagination({ ...pagination, page: newPage })}
        />) : ''
      }




    </div >
  )
}

export default UserManagement

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const jumpBack = () => onPageChange?.(Math.max(page - 10, 1));
  const jumpForward = () => onPageChange?.(Math.min(page + 10, totalPages));

  return (
    <Card className="mt-4 shadow-md border-orange-200/50 bg-white/90 backdrop-blur-sm">
      <CardContent className="flex items-center justify-center sm:justify-between px-4 sm:px-6 py-3">
        {/* --- Mobile View (< > only) --- */}
        <div className="flex items-center justify-center gap-2 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={jumpBack}
            disabled={page === 1}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-50"
          >
            &lt;&lt;
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-50"
          >
            &lt;
          </Button>

          <span className="text-gray-700 text-sm font-medium">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-50"
          >
            &gt;
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={jumpForward}
            disabled={page === totalPages}
            className="border-orange-300 text-orange-700 hover:bg-orange-50 disabled:opacity-50"
          >
            &gt;&gt;
          </Button>
        </div>

        {/* --- Desktop View --- */}
        <div className="hidden sm:flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={jumpBack}
              disabled={page === 1}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50"
            >
              ⏮ 10 पिछला
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50"
            >
              ◀ पिछला
            </Button>
          </div>

          <div className="text-sm text-gray-700">
            पेज <span className="text-orange-700 font-semibold">{page}</span> /
            <span className="text-gray-600"> {totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === totalPages}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50"
            >
              अगला ▶
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={jumpForward}
              disabled={page === totalPages}
              className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50"
            >
              10 अगला ⏭
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

