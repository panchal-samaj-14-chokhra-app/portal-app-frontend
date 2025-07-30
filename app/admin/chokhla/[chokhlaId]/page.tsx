"use client"
import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useCreateVillage, useChokhlaDetails, useUpdateChokhla, useGetAllVillageswithChokhlaID } from '@/data-hooks/mutation-query/useQueryAndMutation';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { LogOut, ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TABS = [
    { key: 'village', label: 'गांव प्रबंधन' },
    { key: 'statics', label: 'आँकड़े' },
    { key: 'reports', label: 'रिपोर्ट्स' },
    { key: 'profile', label: 'चौकला प्रोफ़ाइल' },
];

function Chokhla() {
    const { data: session, status } = useSession()

    const [activeTab, setActiveTab] = useState('village');
    const [open, setOpen] = useState(false);

    const ChokhlaID = useParams().chokhlaId
    const { data: villages, isLoading } = useGetAllVillageswithChokhlaID(ChokhlaID);
    const { data: chokhla, isLoading: isChokhlaLoading, error: chokhlaError } = useChokhlaDetails(ChokhlaID);
    const { mutate: updateChokhla, isLoading: isUpdatingChokhla } = useUpdateChokhla(ChokhlaID);
    const [editProfile, setEditProfile] = useState(false);
    const [profileForm, setProfileForm] = useState<any>(null);
    const [successData, setSuccessData] = useState<null | any>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    React.useEffect(() => {
        if (chokhla && !editProfile) {
            setProfileForm({
                name: chokhla.name || '',
                adhyaksh: chokhla.adhyaksh || '',
                contactNumber: chokhla.contactNumber || '',
                state: chokhla.state || '',
                district: chokhla.district || '',
                villageName: chokhla.villageName || '',
            });
        }
    }, [chokhla, editProfile]);

    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => setShowSuccessModal(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };
    const handleProfileSave = () => {
        updateChokhla(profileForm, {
            onSuccess: () => setEditProfile(false),
        });
    };
    const router = useRouter();
    const userType = useMemo(() => session?.user?.role, [session?.user?.role])


    const handleBack = () => router.back();
    const handleLogout = () => signOut({ callbackUrl: "/login" });

    const form = useForm({
        mode: "onChange",
        criteriaMode: "all",
        defaultValues: {
            name: '',
            villageMemberName: '',
            mobileNumber: '',
            age: '',
            email: '',
            tehsil: '',
            district: '',
            state: '',
            isVillageHaveSchool: false,
            isVillageHavePrimaryHealthCare: false,
            isVillageHaveCommunityHall: false,
            longitude: '',
            latitude: '',
            password: '',
            repeatPassword: '',
        },
    });

    const { mutate: createVillage, isLoading: isCreating } = useCreateVillage();
    const onSubmit = (data: any) => {
        const plainPassword = data.password; // Store before hash
        createVillage(
            {
                ...data,
                age: data.age ? Number(data.age) : null,
                longitude: data.longitude ? Number(data.longitude) : null,
                latitude: data.latitude ? Number(data.latitude) : null,
                chakola: { connect: { id: ChokhlaID } },
            },
            {

                onSuccess: (res) => {
                    setSuccessData({ ...res, password: plainPassword });
                    setShowSuccessModal(true);
                    setOpen(false);
                    form.reset();
                },
                onError: (error: any) => {
                    const message =
                        error?.response?.data?.message || error?.message || "कुछ गलत हो गया। कृपया पुनः प्रयास करें।";
                    setErrorMessage(message);
                    setShowErrorModal(true);
                },

            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
            {/* Navbar */}
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
                        {userType === 'SUPER_ADMIN' && (< Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            वापस
                        </Button>)}
                        <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            लॉगआउट
                        </Button>
                    </div>
                </div>
            </header >
            <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
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
                {/* Main Content */}
                <section className="flex-1 min-w-0">
                    {activeTab === 'village' && (
                        <Card className="mb-8">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>गांव सूची</CardTitle>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        {userType === 'CHOKHLA_MEMBER' && (<Button variant="outline">
                                            <Plus className="w-5 h-5 mr-2" />
                                            गांव जोड़ें</Button>)}

                                    </DialogTrigger>
                                    <DialogContent className="max-w-full sm:max-w-lg p-2 sm:p-6">
                                        <DialogHeader>
                                            <DialogTitle>नया गांव जोड़ें</DialogTitle>
                                        </DialogHeader>
                                        <div className="max-h-[80vh] overflow-y-auto">
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <FormField name="name" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>गांव का नाम</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} required />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="villageMemberName" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>गांव सदस्य का नाम</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="mobileNumber" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>मोबाइल नंबर</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="tel" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="age" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>आयु</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="number" value={field.value ?? ''} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="email" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>ईमेल</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="email" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="tehsil" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>तहसील</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="district" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>जिला</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="state" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>राज्य</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="isVillageHaveSchool" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>क्या गांव में स्कूल है?</FormLabel>
                                                                <FormControl>
                                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="isVillageHavePrimaryHealthCare" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>क्या प्राथमिक स्वास्थ्य केंद्र है?</FormLabel>
                                                                <FormControl>
                                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="isVillageHaveCommunityHall" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>क्या कम्युनिटी हॉल है?</FormLabel>
                                                                <FormControl>
                                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="longitude" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>देशांतर (Longitude)</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="number" step="any" value={field.value ?? ''} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField name="latitude" control={form.control} render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>अक्षांश (Latitude)</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="number" step="any" value={field.value ?? ''} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField
                                                            name="password"
                                                            control={form.control}
                                                            rules={{
                                                                required: "पासवर्ड आवश्यक है",
                                                                minLength: { value: 8, message: "कम से कम 8 अक्षर" },
                                                                pattern: {
                                                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
                                                                    message: "पासवर्ड मजबूत होना चाहिए (एक बड़ा, एक छोटा, एक संख्या, एक विशेष चिन्ह)"
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>पासवर्ड</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} type="password" required />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            name="repeatPassword"
                                                            control={form.control}
                                                            rules={{
                                                                required: "पासवर्ड दोबारा लिखें आवश्यक है",
                                                                validate: value => value === form.getValues('password') || 'पासवर्ड मेल नहीं खाते'
                                                            }}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>पासवर्ड दोबारा लिखें</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} type="password" required />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex justify-end mt-4">
                                                        <Button className='border' type="submit" disabled={isCreating}>
                                                            {isCreating ? 'सहेजा जा रहा है...' : 'सहेजें'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                                    <DialogContent className="sm:max-w-lg">
                                        <DialogHeader>
                                            <DialogTitle>गांव और यूज़र सफलतापूर्वक जोड़ा गया</DialogTitle>
                                        </DialogHeader>
                                        {successData && (
                                            <div className="space-y-3 text-sm">
                                                <p><strong>यूज़र का नाम:</strong> {successData.user.fullName}</p>
                                                <p><strong>ईमेल:</strong> {successData.user.email}</p>
                                                <p><strong>पासवर्ड:</strong> {successData.password}</p>
                                                <p><strong>गांव सदस्य का नाम:</strong> {successData.village.villageMemberName}</p>
                                                <p><strong>गांव ID:</strong> {successData.village.id}</p>
                                                <p><strong>यूज़र ID:</strong> {successData.user.id}</p>
                                                <p><strong>भूमिका:</strong> {successData.user.globalRole}</p>
                                                <div className="flex justify-end pt-2">
                                                    <Button onClick={() => setShowSuccessModal(false)}>बंद करें</Button>
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-red-600">त्रुटि</DialogTitle>
                                        </DialogHeader>
                                        <div className="text-sm text-red-700">
                                            {errorMessage}
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button variant="outline" onClick={() => setShowErrorModal(false)}>बंद करें</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>


                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <div className="rounded-lg shadow overflow-hidden border border-orange-200 bg-white w-full overflow-x-auto">
                                        <table className="w-full min-w-[600px] sm:min-w-[900px] divide-y divide-orange-200 text-sm sm:text-base">
                                            <thead className="bg-gradient-to-r from-orange-400 to-orange-500">
                                                <tr>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">नाम</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">सदस्य</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">मोबाइल नंबर</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">आयु</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">तहसील</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">जिला</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">राज्य</th>
                                                    <th className="px-2 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">कार्रवाई</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-orange-100">
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan={8} className="px-6 py-4 text-center text-orange-500 font-semibold">लोड हो रहा है...</td>
                                                    </tr>
                                                ) : (
                                                    (villages || []).map((village: any, idx: number) => (
                                                        <tr
                                                            key={village.id}
                                                            className={
                                                                idx % 2 === 0
                                                                    ? 'bg-orange-50 hover:bg-orange-100 transition-colors'
                                                                    : 'bg-white hover:bg-orange-50 transition-colors'
                                                            }
                                                        >
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap font-medium text-orange-900">{village.name}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-orange-800">{village.villageMemberName}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-orange-800">{village.mobileNumber}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-orange-800">{village.age}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-orange-800">{village.tehsil}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-orange-800">{village.district}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-orange-800">{village.state}</td>
                                                            <td className="px-2 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                                                                <Button
                                                                    variant="outline"
                                                                    className="border-orange-400 text-orange-600 hover:bg-orange-100 hover:text-orange-800 transition-colors px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
                                                                    onClick={() => router.push(`/admin/village/${village.id}?chakolaId=${ChokhlaID}`)}
                                                                >
                                                                    देखें
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'statics' && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>आँकड़े</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Statics content here */}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'reports' && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>रिपोर्ट्स</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Reports content here */}
                            </CardContent>
                        </Card>
                    )}
                    {activeTab === 'profile' && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle>चौकला प्रोफ़ाइल</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isChokhlaLoading ? (
                                    <div className="text-orange-600">लोड हो रहा है...</div>
                                ) : chokhlaError ? (
                                    <div className="text-red-600">त्रुटि: {chokhlaError.message}</div>
                                ) : chokhla && profileForm ? (
                                    <div className="max-w-md bg-white rounded-lg shadow p-4 border border-orange-200">
                                        <div className="flex justify-end mb-2">
                                            {!editProfile ? (
                                                <Button variant="outline" onClick={() => setEditProfile(true)}>
                                                    संपादित करें
                                                </Button>
                                            ) : (
                                                <Button variant="default" onClick={handleProfileSave} disabled={isUpdatingChokhla}>
                                                    {isUpdatingChokhla ? 'सहेजा जा रहा है...' : 'सहेजें'}
                                                </Button>
                                            )}
                                        </div>
                                        <form className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-1">चौकला का नाम</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profileForm.name}
                                                    onChange={handleProfileChange}
                                                    disabled={!editProfile}
                                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-1">अध्यक्ष</label>
                                                <input
                                                    type="text"
                                                    name="adhyaksh"
                                                    value={profileForm.adhyaksh}
                                                    onChange={handleProfileChange}
                                                    disabled={!editProfile}
                                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-1">संपर्क नंबर</label>
                                                <input
                                                    type="text"
                                                    name="contactNumber"
                                                    value={profileForm.contactNumber}
                                                    onChange={handleProfileChange}
                                                    disabled={!editProfile}
                                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-1">राज्य</label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={profileForm.state}
                                                    onChange={handleProfileChange}
                                                    disabled={!editProfile}
                                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-1">जिला</label>
                                                <input
                                                    type="text"
                                                    name="district"
                                                    value={profileForm.district}
                                                    onChange={handleProfileChange}
                                                    disabled={!editProfile}
                                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-orange-700 mb-1">गांव का नाम</label>
                                                <input
                                                    type="text"
                                                    name="villageName"
                                                    value={profileForm.villageName}
                                                    onChange={handleProfileChange}
                                                    disabled={!editProfile}
                                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
                                                />
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                <span className="text-xs text-orange-700 font-semibold">निर्माण तिथि: {chokhla.createdDate ? new Date(chokhla.createdDate).toLocaleDateString('hi-IN') : '-'}</span>
                                                <span className="text-xs text-gray-500">अद्यतन तिथि: {chokhla.updatedDate ? new Date(chokhla.updatedDate).toLocaleDateString('hi-IN') : '-'}</span>
                                            </div>
                                        </form>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    )}
                </section>
            </main>
        </div >
    );
}

export default Chokhla;
