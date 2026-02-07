import {z} from "zod";
import client from "@/src/shared/client/main/client";
import { isAxiosError } from "axios";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

const userSchema = z.object({
    gender: z.enum(Gender).nullable().optional(),
    nickname: z.string(),
    providerSub: z.string(),
    dateOfBirth: z.string().nullable().optional(),
    marketingAgreedAt: z.string().nullable(),
    termsOfUseAgreedAt: z.string(),
    privacyAgreedAt: z.string(),
});

export type UserResponse = z.infer<typeof userSchema>;

export const fetchUser = async () => {
    const response = await client.get("/users/me");
    return userSchema.parse(response.data);
};

// Tutorial Completion API
// 백엔드: POST /api/v1/users/tutorial
// 성공: { "message": "success" }
// 실패 (이미 완료): { "errorCode": "USER_005", "message": "이미 튜토리얼을 완료했습니다." }

const TUTORIAL_ERROR_CODE = 'USER_005';

/**
 * 튜토리얼 완료 API
 * @returns true: 첫 완료 (크레딧 지급됨), false: 이미 완료 (크레딧 미지급)
 */
export async function completeTutorial(): Promise<boolean> {
    try {
        await client.post("/users/tutorial");
        return true;
    } catch (error) {
        // USER_005 (이미 완료) 에러는 정상 처리 — 크레딧 미지급
        if (isAxiosError(error)) {
            const data = error.response?.data;
            const errorCode = data?.errorCode ?? data?.error_code;

            console.error('[completeTutorial] API error:', {
                status: error.response?.status,
                errorCode,
                message: data?.message,
                rawData: data,
            });

            if (errorCode === TUTORIAL_ERROR_CODE) {
                return false;
            }
        }
        throw error;
    }
}