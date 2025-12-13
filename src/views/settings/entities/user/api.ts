import {z} from "zod";
import client from "@/src/shared/client/main/client";

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

const userSchema = z.object({
    gender: z.enum(Gender).nullable().optional(),
    nickname: z.string(),
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