"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema, SignInSchema } from "@/lib/validations/auth";
import { Models } from "appwrite";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeClosedIcon, Loader2Icon, ChevronLeftIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { getUser, logIn } from "@/lib/appwrite/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AppwriteError = {
    message?: string;
};

export default function SignInForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<SignInSchema>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
            keepMeLoggedIn: false,
        },
    });

    const onSubmit = async (data: SignInSchema) => {
        const { email, password } = data;
        setLoading(true);

        try {
            // 🔹 Log in user (returns Appwrite session)
            const session: Models.Session = await logIn(email, password);

            if (!session) {
                toast.error("Login failed.");
                return;
            }

            // 🔹 Fetch user
            const user: Models.User<Models.Preferences> = await getUser();

            // 🔹 Redirect based on admin role
            const isAdmin = Array.isArray(user.labels) && user.labels.includes("admin");

            router.push(isAdmin ? "/admin-Dashboard-Panel" : "/dashboard");

        } catch (err: unknown) {
            console.error("Login Error:", err);

            // Type guard for Appwrite errors
            const errorObj = err as AppwriteError;
            const msg = errorObj?.message?.toLowerCase() ?? "";

            // 🔥 Appwrite error mapping
            if (msg.includes("invalid credentials")) {
                toast.error("Incorrect email or password.");
            } else if (msg.includes("user not found")) {
                toast.error("No account registered with this email.");
            } else if (msg.includes("user is blocked")) {
                toast.error("Your account has been suspended.");
            } else if (msg.includes("rate limit")) {
                toast.error("Too many login attempts. Try again later.");
            } else {
                toast.error("Login failed. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="flex flex-col flex-1 w-full pb-10">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="mr-1" />
                    Back to home
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div className="mb-5 sm:mb-8">
                    <h1 className="mb-2 md:text-3xl xl:text-4xl font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                        Sign In
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter your email and password to sign in!
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="example@domain.com"
                                            className="h-12"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <InputGroup className="h-12">
                                                <InputGroupInput
                                                    placeholder="Enter your password"
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupButton
                                                        onClick={() =>
                                                            setShowPassword(!showPassword)
                                                        }
                                                    >
                                                        {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                                                    </InputGroupButton>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between">
                            <FormField
                                control={form.control}
                                name="keepMeLoggedIn"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="m-0">Keep me logged in</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <Link
                                href="/reset-password"
                                className="text-sm text-primary hover:text-brand-600 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full h-12 font-semibold" size="sm">
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2Icon className="animate-spin" /> Signing in...
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="mt-5 text-center">
                    <p className="text-sm font-normal text-gray-700 dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-primary hover:text-brand-600 transition"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
