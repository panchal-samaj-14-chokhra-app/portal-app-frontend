import request from "@/config/request";

export const forgotPassword = async (email: string) => {
    const { data } = await request.post('/api/auth/forgot-password', { email });
    return data;
};

export const verifyOtp = async ({ email, otp }: { email: string; otp: string }) => {
    const { data } = await request.post('/api/auth/verify-otp', { email, otp });
    return data;
};

export const resetPassword = async ({
    email,
    newPassword,
}: {
    email: string;
    newPassword: string;
}) => {
    const { data } = await request.post('/api/auth/reset-password', {
        email,
        newPassword,
    });
    return data;
};
