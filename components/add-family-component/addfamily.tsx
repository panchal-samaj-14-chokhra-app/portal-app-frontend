import React, { useState, useEffect } from "react";
import { useCreateFamily } from "@/data-hooks/mutation-query/useQueryAndMutation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/group-component/family-form/employment-info-section";
import { Textarea } from "@/components/ui/textarea";
import { statesAndDistricts } from "@/components/group-component/family-form/constants";
import { Loader2 } from "lucide-react";

type AddFamilyDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => Promise<void>;
    chakolaId: string | number;
    villageId: string | number;
};
const economicStatusOptions = [
    { value: "bpl", label: "गरीबी रेखा से नीचे (BPL)" },
    { value: "apl", label: "गरीबी रेखा से ऊपर (APL)" },
    { value: "middle", label: "मध्यम वर्गीय (Middle Class)" },
    { value: "upper", label: "उच्च वर्गीय (Upper Middle Class)" },
];


export default function AddFamilyDialog({
    isOpen,
    onClose,
    chakolaId,
    villageId,
}: AddFamilyDialogProps) {
    const [formData, setFormData] = useState({
        chakolaId: chakolaId,
        villageId: villageId,
        mukhiyaName: "",
        economicStatus: "",
        anyComment: "",
        currentFamilyState: "",
        currentFamilyDistrict: "",
        currentFamilyVillage: "",
        currentFamilyPincode: "",
        currentAddress: "",
        permanentFamilyState: "",
        permanentFamilyDistrict: "",
        permanentFamilyVillage: "",
        permanentFamilyPincode: "",
        permanentAddress: "",
        latitude: null as number | null,
        longitude: null as number | null,
        status: "active", // Default status
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
    const [submitMessage, setSubmitMessage] = useState("");

    // React Query mutation
    const { mutation } = useCreateFamily((result?: any) => {
        // If result is an error (instanceof Error), handle error
        if (result instanceof Error) {
            setSubmitStatus("error");
            setSubmitMessage(result.message || "परिवार जोड़ने में त्रुटि! (Error adding family!)");
            return;
        }
        // Otherwise, handle success
        const data = result;
        const familyId = data?.id || data?.familyId || data?.data?.id || data?.data?.familyId;
        setSubmitStatus("success");
        setSubmitMessage(
            `परिवार सफलतापूर्वक जोड़ा गया! (Family created successfully!)${familyId ? `\nFamily ID: ${familyId}` : ""}`
        );
        setTimeout(() => {
            setSubmitStatus(null);
            setSubmitMessage("");
            onClose();
            window.location.reload();
        }, 1800);
        // Reset form
        setFormData({
            chakolaId,
            villageId,
            mukhiyaName: "",
            economicStatus: "",
            anyComment: "",
            currentFamilyState: "",
            currentFamilyDistrict: "",
            currentFamilyVillage: "",
            currentFamilyPincode: "",
            currentAddress: "",
            permanentFamilyState: "",
            permanentFamilyDistrict: "",
            permanentFamilyVillage: "",
            permanentFamilyPincode: "",
            permanentAddress: "",
            latitude: null,
            longitude: null,
            status: "active",
        });
        setErrors({});
    });
    const { mutate, isLoading } = mutation;

    // Generate state options from statesAndDistricts keys
    const stateOptions = Object.keys(statesAndDistricts).map((state) => ({
        label: state,
        value: state,
    }));

    // District options depend on selected currentFamilyState
    const currentDistrictOptions = formData.currentFamilyState
        ? statesAndDistricts[formData.currentFamilyState].map((district) => ({
            label: district,
            value: district,
        }))
        : [];

    // District options depend on selected permanentFamilyState
    const permanentDistrictOptions = formData.permanentFamilyState
        ? statesAndDistricts[formData.permanentFamilyState].map((district) => ({
            label: district,
            value: district,
        }))
        : [];

    // Handle input change for text inputs and textareas
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle SelectInput changes
    const handleSelectChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
            // If state changed, reset corresponding district field
            ...(field === "currentFamilyState" && { currentFamilyDistrict: "" }),
            ...(field === "permanentFamilyState" && { permanentFamilyDistrict: "" }),
        }));
    };

    // Validate required fields
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.mukhiyaName.trim())
            newErrors.mukhiyaName = "मुखिया का नाम आवश्यक है (Head of Family is required)";
        if (!formData.economicStatus)
            newErrors.economicStatus = "आर्थिक स्थिति आवश्यक है (Economic Status is required)";
        if (!formData.currentFamilyState)
            newErrors.currentFamilyState = "राज्य आवश्यक है (Current State is required)";
        if (!formData.currentFamilyDistrict)
            newErrors.currentFamilyDistrict = "जिला आवश्यक है (Current District is required)";
        if (!formData.currentFamilyVillage.trim())
            newErrors.currentFamilyVillage = "गांव आवश्यक है (Current Village is required)";
        if (!formData.currentFamilyPincode.trim())
            newErrors.currentFamilyPincode = "पिनकोड आवश्यक है (Current Pincode is required)";
        if (!formData.currentAddress.trim())
            newErrors.currentAddress = "पूरा पता आवश्यक है (Current Address is required)";
        if (!formData.permanentFamilyState)
            newErrors.permanentFamilyState = "राज्य आवश्यक है (Permanent State is required)";
        if (!formData.permanentFamilyDistrict)
            newErrors.permanentFamilyDistrict = "जिला आवश्यक है (Permanent District is required)";
        if (!formData.permanentFamilyVillage.trim())
            newErrors.permanentFamilyVillage = "गांव आवश्यक है (Permanent Village is required)";
        if (!formData.permanentFamilyPincode.trim())
            newErrors.permanentFamilyPincode = "पिनकोड आवश्यक है (Permanent Pincode is required)";
        if (!formData.permanentAddress.trim())
            newErrors.permanentAddress = "पूरा पता आवश्यक है (Permanent Address is required)";
        return newErrors;
    };

    // Get GPS coordinates from browser API on open
    useEffect(() => {
        if (!isOpen) return;

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.warn("GPS error or denied, setting lat/lng to null");
                    setFormData((prev) => ({
                        ...prev,
                        latitude: null,
                        longitude: null,
                    }));
                },
                { timeout: 10000 }
            );
        } else {
            setFormData((prev) => ({
                ...prev,
                latitude: null,
                longitude: null,
            }));
        }
    }, [isOpen]);

    // On form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage("");
        mutate(
            {
                ...formData,
                chakolaId,
                villageId,
            },
            {
                onSettled: () => setIsSubmitting(false),
            }
        );
    };




    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden p-2 sm:p-4 lg:p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-orange-800 text-center">
                        नया परिवार जोड़ें (Add New Family)
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto px-1">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Basic Info */}
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <h3 className="text-lg font-semibold text-orange-800 mb-4">
                                बुनियादी जानकारी (Basic Information)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-orange-700 mb-1">
                                        मुखिया का नाम (Head of Family) *
                                    </label>
                                    <Input
                                        name="mukhiyaName"
                                        value={formData.mukhiyaName}
                                        onChange={handleChange}
                                        className="border-orange-300 focus:border-orange-500 text-sm"
                                    />
                                    {errors.mukhiyaName && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {errors.mukhiyaName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-orange-700 mb-1">
                                        आर्थिक स्थिति (Economic Status) *
                                    </label>
                                    <SelectInput
                                        name="economicStatus"
                                        value={formData.economicStatus}
                                        options={economicStatusOptions}
                                        onChange={(val: any) =>
                                            handleSelectChange("economicStatus", val)
                                        }
                                        placeholder="चुनें"
                                    />
                                    {errors.economicStatus && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {errors.economicStatus}
                                        </p>
                                    )}
                                    {/* Submission status */}
                                    {submitStatus && (
                                        <div className={`text-center py-2 font-semibold ${submitStatus === "success" ? "text-green-600" : "text-red-600"}`}>
                                            {submitMessage}
                                        </div>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-orange-700 mb-1">
                                        टिप्पणी (Comment)
                                    </label>
                                    <Textarea
                                        name="anyComment"
                                        value={formData.anyComment}
                                        onChange={handleChange}
                                        className="border-orange-300 focus:border-orange-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Current Address */}
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                वर्तमान पता (Current Address)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectInput
                                    name="currentFamilyState"
                                    label="राज्य (State)"
                                    options={stateOptions}
                                    value={formData.currentFamilyState}
                                    onChange={(val?: string) =>
                                        handleSelectChange("currentFamilyState", val)
                                    }
                                    placeholder="राज्य चुनें"
                                />
                                <SelectInput
                                    name="currentFamilyDistrict"
                                    label="जिला (District)"
                                    options={currentDistrictOptions}
                                    value={formData.currentFamilyDistrict}
                                    onChange={(val?: string) =>
                                        handleSelectChange("currentFamilyDistrict", val)
                                    }
                                    placeholder="जिला चुनें"
                                    disabled={!formData.currentFamilyState}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        गांव (Village)
                                    </label>
                                    <Input
                                        name="currentFamilyVillage"
                                        value={formData.currentFamilyVillage}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        पिनकोड (Pincode)
                                    </label>
                                    <Input
                                        name="currentFamilyPincode"
                                        value={formData.currentFamilyPincode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        पूरा पता (Full Address)
                                    </label>
                                    <Textarea
                                        name="currentAddress"
                                        value={formData.currentAddress}
                                        onChange={handleChange}
                                        className="sm:col-span-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Permanent Address */}
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">
                                स्थायी पता (Permanent Address)
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectInput
                                    name="permanentFamilyState"
                                    label="राज्य (State)"
                                    options={stateOptions}
                                    value={formData.permanentFamilyState}
                                    onChange={(val: any) =>
                                        handleSelectChange("permanentFamilyState", val)
                                    }
                                    placeholder="राज्य चुनें"
                                />
                                <SelectInput
                                    name="permanentFamilyDistrict"
                                    label="जिला (District)"
                                    options={permanentDistrictOptions}
                                    value={formData.permanentFamilyDistrict}
                                    onChange={(val: any) =>
                                        handleSelectChange("permanentFamilyDistrict", val)
                                    }
                                    placeholder="जिला चुनें"
                                    disabled={!formData.permanentFamilyState}
                                />
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">
                                        गांव (Village)
                                    </label>
                                    <Input
                                        name="permanentFamilyVillage"
                                        value={formData.permanentFamilyVillage}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-green-700 mb-1">
                                        पिनकोड (Pincode)
                                    </label>
                                    <Input
                                        name="permanentFamilyPincode"
                                        value={formData.permanentFamilyPincode}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-green-700 mb-1">
                                        पूरा पता (Permanent Address)
                                    </label>
                                    <Textarea
                                        name="permanentAddress"
                                        value={formData.permanentAddress}
                                        onChange={handleChange}
                                        className="sm:col-span-2"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                                रद्द करें
                            </Button>
                            <Button type="submit" disabled={isSubmitting || isLoading}>
                                {(isSubmitting || isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                जोड़ें
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
