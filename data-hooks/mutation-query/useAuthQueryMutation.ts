'use client';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword, resetPassword, verifyOtp } from '../requests/user-auth';

import { useRouter } from 'next/navigation';
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtp,
    });
};

export const useResetPassword = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            router.push('/login');
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || 'Something went wrong during password reset.');
        },
    });
};
