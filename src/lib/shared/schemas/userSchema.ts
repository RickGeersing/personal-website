import { Role } from "@prisma/client";
import { z } from "zod";

export type UserSchema = z.infer<typeof userSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

export const userSchema = z.object({
    email: z.string({
        message: "E-mail is required",
    }).email({
        message: "Invalid e-mail address",
    }),
    role: z.nativeEnum(Role, {
        message: "Invalid role was selected",
    }),
    password: z.string({
        message: "Password is required",
    }).min(8, {
        message: "Password must be at least 8 characters long",
    }),
});

export const userUpdateSchema = z.object({
    email: z.string().email({
        message: "Invalid e-mail address",
    }),
    role: z.nativeEnum(Role, {
        message: "Invalid role was selected",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }).optional(),
});