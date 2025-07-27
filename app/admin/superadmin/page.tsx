
"use client"
import React, { useState, } from 'react';
import ReusableTable from '@/components/ui/ReusableTable';
import { Button } from '@/components/ui/button';
import { useAllVillages, useAllChokhlas, useCreateChokhla, useGetAllUserList } from '@/data-hooks/mutation-query/useQueryAndMutation';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TABS = [
  { key: 'village', label: 'गांव प्रबंधन' },
  { key: 'chokhla', label: 'चौकला प्रबंधन' },
  { key: 'statics', label: 'आँकड़े' },
  { key: 'user', label: 'यूज़र प्रबंधन' },
  { key: 'profile', label: 'सुपर एडमिन प्रोफ़ाइल' },
];

function SuperAdmin() {
  const [activeTab, setActiveTab] = useState('village');
  const [openChokhlaModal, setOpenChokhlaModal] = useState(false);
  const [chokhlaForm, setChokhlaForm] = useState({
    name: '',
    adhyaksh: '',
    contactNumber: '',
    state: '',
    district: '',
    villageName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [formErrors, setFormErrors] = useState({ email: '', password: '', repeatPassword: '' });
  const { data: villages, isLoading: isVillagesLoading } = useAllVillages();
  const { data: chokhlas, isLoading: isChokhlasLoading } = useAllChokhlas();
  const { data: users, isLoading: usersLoading, error: usersError } = useGetAllUserList();
  const { mutate: createChokhla } = useCreateChokhla();
  const router = useRouter();
  const { data: userData } = useSession()

  const handleChokhlaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChokhlaForm({ ...chokhlaForm, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };
  const validateChokhlaForm = () => {
    let valid = true;
    const errors: any = { email: '', password: '', repeatPassword: '' };
    // Email validation
    if (!chokhlaForm.email) {
      errors.email = 'ईमेल आवश्यक है';
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(chokhlaForm.email)) {
      errors.email = 'मान्य ईमेल दर्ज करें';
      valid = false;
    }
    // Password validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!chokhlaForm.password) {
      errors.password = 'पासवर्ड आवश्यक है';
      valid = false;
    } else if (!strongPassword.test(chokhlaForm.password)) {
      errors.password = 'पासवर्ड मजबूत होना चाहिए (कम से कम 8 अक्षर, एक बड़ा, एक छोटा, एक संख्या, एक विशेष चिन्ह)';
      valid = false;
    }
    // Repeat password validation
    if (!chokhlaForm.repeatPassword) {
      errors.repeatPassword = 'पासवर्ड दोबारा लिखें आवश्यक है';
      valid = false;
    } else if (chokhlaForm.password !== chokhlaForm.repeatPassword) {
      errors.repeatPassword = 'पासवर्ड मेल नहीं खाते';
      valid = false;
    }
    setFormErrors(errors);
    return valid;
  };
  const handleChokhlaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateChokhlaForm()) return;
    createChokhla(chokhlaForm, {
      onSuccess: () => {
        setOpenChokhlaModal(false);
        setChokhlaForm({ name: '', adhyaksh: '', contactNumber: '', state: '', district: '', villageName: '', email: '', password: '', repeatPassword: '' });
      },
    });
  };

  const handleToggleActive = (userId: string, current: boolean) => {
    console.log("clicked on the toggle")
  };

  const handleBack = () => router.push("/");
  const handleLogout = () => signOut({ callbackUrl: `${process.env.NEXTAUTH_URL}/logout` });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/main-logo.png"
              alt="Panchal Samaj Logo"
              width={44}
              height={44}
              className="rounded-full shadow-lg"
            />
            <span className="text-xl md:text-2xl font-bold text-white">पंचाल समाज 14 चोखरा</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              होम
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              लॉगआउट
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 mb-6 md:mb-0">
          <nav className="bg-white rounded-lg shadow border border-orange-200 p-4 flex md:flex-col gap-2">
            {TABS.map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full justify-start text-base font-semibold ${activeTab === tab.key ? 'bg-orange-500 text-white' : 'text-orange-700'}`}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </aside>
        <section className="flex-1 min-w-0">
          {activeTab === 'village' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>गांव सूची</CardTitle>
              </CardHeader>
              <CardContent>
                <ReusableTable
                  columns={[
                    { label: 'नाम', accessor: 'name' },
                    { label: 'सदस्य', accessor: 'villageMemberName' },
                    { label: 'जिला', accessor: 'district' },
                    { label: 'राज्य', accessor: 'state' },
                  ]}
                  data={villages?.data || []}
                  loading={isVillagesLoading}
                  actions={row => (
                    <Button variant="outline" onClick={() => router.push(`/admin/village/${row.id}`)}>
                      देखें
                    </Button>
                  )}
                  caption="सभी गांवों की सूची"
                />
              </CardContent>
            </Card>
          )}
          {activeTab === 'chokhla' && (
            <Card className="mb-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>चौकला सूची</CardTitle>
                <Button variant="default" onClick={() => setOpenChokhlaModal(true)}>
                  चौकला जोड़ें
                </Button>
              </CardHeader>
              <CardContent>
                <ReusableTable
                  columns={[
                    { label: 'नाम', accessor: 'name' },
                    { label: 'अध्यक्ष', accessor: 'adhyaksh' },
                    { label: 'संपर्क नंबर', accessor: 'contactNumber' },
                    { label: 'राज्य', accessor: 'state' },
                    { label: 'जिला', accessor: 'district' },
                    { label: 'गांव', accessor: 'villageName' },
                  ]}
                  data={chokhlas || []}
                  loading={isChokhlasLoading}
                  actions={row => (
                    <Button variant="outline" onClick={() => router.push(`/admin/chokhla/${row.id}`)}>
                      देखें
                    </Button>
                  )}
                  caption="सभी चौकला की सूची"
                />
              </CardContent>
              {/* Modal remains unchanged */}
              {openChokhlaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4 text-orange-700">नया चौकला जोड़ें</h3>
                    <form onSubmit={handleChokhlaSubmit} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">चौकला का नाम</label>
                        <input type="text" name="name" value={chokhlaForm.name} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">अध्यक्ष</label>
                        <input type="text" name="adhyaksh" value={chokhlaForm.adhyaksh} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">संपर्क नंबर</label>
                        <input type="text" name="contactNumber" value={chokhlaForm.contactNumber} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">राज्य</label>
                        <input type="text" name="state" value={chokhlaForm.state} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">जिला</label>
                        <input type="text" name="district" value={chokhlaForm.district} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">गांव</label>
                        <input type="text" name="villageName" value={chokhlaForm.villageName} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">ईमेल</label>
                        <input type="email" name="email" value={chokhlaForm.email} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        {formErrors.email && <div className="text-red-600 text-xs mt-1">{formErrors.email}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">पासवर्ड</label>
                        <input type="password" name="password" value={chokhlaForm.password} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        {formErrors.password && <div className="text-red-600 text-xs mt-1">{formErrors.password}</div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-orange-700 mb-1">पासवर्ड दोबारा लिखें</label>
                        <input type="password" name="repeatPassword" value={chokhlaForm.repeatPassword} onChange={handleChokhlaChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                        {formErrors.repeatPassword && <div className="text-red-600 text-xs mt-1">{formErrors.repeatPassword}</div>}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpenChokhlaModal(false)}>
                          रद्द करें
                        </Button>
                        <Button type="submit" variant="default">
                          सहेजें
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </Card>
          )}
          {activeTab === 'statics' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>आँकड़े</CardTitle>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>
          )}
          {activeTab === 'user' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>यूज़र प्रबंधन</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-orange-600">लोड हो रहा है...</div>
                ) : usersError ? (
                  <div className="text-red-600">{usersError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] bg-white border border-orange-200 rounded-lg shadow">
                      <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">ईमेल</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">नाम</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">भूमिका</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">सक्रिय</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">निर्माण तिथि</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase">कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users?.map((user: { id: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.Key | null | undefined; email: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; fullName: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; globalRole: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; isActive: boolean | undefined; createdAt: string | number | Date; }) => (
                          <tr key={user.id} className="border-b border-orange-100 hover:bg-orange-50">
                            <td className="px-4 py-2 text-orange-900 text-xs break-all">{user.id}</td>
                            <td className="px-4 py-2 text-orange-800">{user.email}</td>
                            <td className="px-4 py-2 text-orange-800">{user.fullName}</td>
                            <td className="px-4 py-2 text-orange-800">{user.globalRole}</td>
                            <td className="px-4 py-2">
                              <Switch checked={user.isActive} onCheckedChange={() => handleToggleActive(user.id, user.isActive)} />
                            </td>
                            <td className="px-4 py-2 text-orange-700 text-xs">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('hi-IN') : '-'}</td>
                            <td className="px-4 py-2">
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {activeTab === 'profile' && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>सुपर एडमिन प्रोफ़ाइल</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>ID:</strong> {userData?.user?.id}</div>
                <div><strong>Email:</strong> {userData?.user?.email}</div>
                <div><strong>Role:</strong> {userData?.user?.role}</div>
                <div><strong>Chokla ID:</strong> {userData?.user?.choklaId}</div>
                <div><strong>Village ID:</strong> {userData?.user?.villageId ?? 'N/A'}</div>
                <div><strong>Token Expires:</strong> {new Date(userData?.expires).toLocaleString()}</div>
              </CardContent>
            </Card>

          )}
        </section>
      </main>
    </div>
  );
}

export default SuperAdmin;
