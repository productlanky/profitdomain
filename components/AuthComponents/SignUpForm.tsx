"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchema } from "@/lib/validations/auth";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, EyeClosedIcon, EyeIcon, Loader2Icon, Calendar1 } from "lucide-react"
import { toast } from "sonner"
import { Country, State, City } from "country-state-city";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import PhoneInput from "../ui/PhoneInput";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { nanoid } from 'nanoid';
import { databases, DB_ID, NOTIFICATION_COLLECTION, PROFILE_COLLECTION_ID, TRANSACTION_COLLECTION } from "@/lib/appwrite/client";
import { ID, Permission, Query, Role } from "appwrite";
import { signUp } from "@/lib/appwrite/auth";

export default function SignUpForm() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams();
    const ref = searchParams.get("ref");

    const form = useForm<SignUpSchema>({
        defaultValues: {
            fname: "",
            lname: "",
            email: "",
            password: "",
            confirm_password: "",
            gender: undefined,
            date_of_birth: "",
            country: "",
            state: "",
            city: "",
            zip: "",
            phone: "+234",
            address: "",
            referred_by: ref || "",
            terms: false,
        },
        resolver: zodResolver(signUpSchema),
    });


    const [countryCode, setCountryCode] = useState<string>("");
    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedState, setSelectedState] = useState<string>("");
    const [states, setStates] = useState<{ value: string; label: string }[]>([]);
    const [cities, setCities] = useState<{ value: string; label: string }[]>([]);

    // Get all countries for select options
    const countries = Country.getAllCountries().map((country) => ({
        value: country.isoCode,
        label: country.name,
    }));

    const genders = [
        {
            value: 'male',
            label: 'Male'
        },
        {
            value: 'female',
            label: 'Female'
        },
        {
            value: 'others',
            label: 'Others'
        }
    ]

    const handleCountryChange = (isoCode: string) => {
        setSelectedCountry(isoCode);

        const selectedCountry = Country.getCountryByCode(isoCode);
        if (selectedCountry) {
            setCountryCode("+" + selectedCountry.phonecode);
        }

        const countryStates = State.getStatesOfCountry(isoCode).map((state) => ({
            value: state.isoCode,
            label: state.name,
        }));

        if (countryStates.length > 0) {
            setStates(countryStates);
        } else {
            setStates([]);
            setCities([]); // No states, no cities
        }
    };


    const handleStateChange = (isoCode: string) => {
        setSelectedState(isoCode);
        const stateCities = City.getCitiesOfState(selectedCountry, isoCode).map((city) => ({
            value: city.name,
            label: city.name,
        }));
        setCities(stateCities);
    };


    const onSubmit = async (data: SignUpSchema) => {
        setLoading(true);

        const {
            email,
            password,
            fname,
            lname,
            gender,
            date_of_birth,
            phone,
            country,
            address,
            zip,
            city,
            state,
            referred_by
        } = data;

        try {
            // --- PREPARE DATA ---
            async function generateUniqueReferral() {
                let referral = "";
                let exists = true;

                while (exists) {
                    referral = nanoid(8); // longer = safer
                    const list = await databases.listDocuments(
                        DB_ID,
                        PROFILE_COLLECTION_ID,
                        [Query.equal("refereeId", referral)]
                    );

                    exists = list.total > 0;
                }

                return referral;
            }

            const referral_code = await generateUniqueReferral();;

            const selectedCountryObj = Country.getCountryByCode(country);
            const selectedStateObj =
                state && country ? State.getStateByCodeAndCountry(state, country) : undefined;

            const fullCountryName = selectedCountryObj?.name || country;
            const fullStateName = selectedStateObj?.name || state;

            const cleanedPhone = phone.replace(/^\+/, "");
            const fullPhoneNumber = `${countryCode}${cleanedPhone}`;

            const name = `${fname} ${lname}`;

            // --- CREATE USER ACCOUNT ---
            const user = await signUp(email, password, name);
            if (!user?.$id) throw new Error("User creation failed.");

            // --- CREATE USER PROFILE ---
            await databases.createDocument(
                DB_ID,
                PROFILE_COLLECTION_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    email,
                    firstName: fname,
                    lastName: lname,
                    gender,
                    dob: date_of_birth,
                    country: fullCountryName,
                    state: fullStateName,
                    city,
                    zip,
                    address,
                    phone: fullPhoneNumber,
                    referredBy: referred_by,
                    tierLevel: 1,
                    refereeId: referral_code,
                    withdrawalPassword: "",
                    kycStatus: "pending",
                    password: password,
                    profit: 10
                },
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );

            // --- CREATE WELCOME NOTIFICATION ---
            await databases.createDocument(
                DB_ID,
                NOTIFICATION_COLLECTION,
                ID.unique(),
                {
                    userId: user.$id,
                    title: "Welcome!",
                    message: "Your account has successfully been created.",
                    type: "info",
                    isRead: false,
                },
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );

            // --- CREATE WELCOME BONUS TRANSACTION ---
            await databases.createDocument(
                DB_ID,
                TRANSACTION_COLLECTION,
                ID.unique(),
                {
                    userId: user.$id,
                    amount: 10,
                    status: "approved",
                    type: "Welcome Bonus",
                    method: "system",
                },
                [Permission.read(Role.any()), Permission.write(Role.any())]
            );

            toast("Login your account.");
            setLoading(false);

            setTimeout(() => router.push("/signin"), 2000);
            return user;

        } catch (error: unknown) {
            const message = (error as { message?: string })?.message ?? "";

            if (message.includes("already exists")) {
                toast.error("Email already registered. Try signing in.");
            } else {
                toast.error("An error occurred during sign-up. Please try again.");
                console.error("Signup Error:", message);
            }

            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar pb-10">
            <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon />
                    Back to home
                </Link>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign Up
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign up!
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" noValidate>
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* First Name */}
                                    <FormField
                                        control={form.control}
                                        name="fname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name<span className="text-error-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your first name" className="h-12" type="text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Last Name */}
                                    <FormField
                                        control={form.control}
                                        name="lname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name<span className="text-error-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your last name" className="h-12" type="text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email<span className="text-error-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input autoComplete="off" placeholder="Enter your email" className="h-12" type="email" {...field} />
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
                                            <FormLabel>Password<span className="text-error-500">*</span></FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <InputGroup className="h-12">
                                                        <InputGroupInput autoComplete="new-password" placeholder="Enter your password"
                                                            type={showPassword ? "text" : "password"}
                                                            {...field} />
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupButton
                                                                onClick={() => setShowPassword(!showPassword)}
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

                                {/* Confirm Password */}
                                <FormField
                                    control={form.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password<span className="text-error-500">*</span></FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <InputGroup className="h-12">
                                                        <InputGroupInput placeholder="Re-enter your password"
                                                            type={showPassword ? "text" : "password"}
                                                            {...field} />
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupButton
                                                                onClick={() => setShowPassword(!showPassword)}
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

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* Gender */}

                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value || ""}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger className='w-full !h-12'>
                                                                <SelectValue placeholder="Select an option" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {genders.map((g) => (
                                                                    <SelectItem key={g.value} value={g.value}>
                                                                        {g.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="date_of_birth"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date of Birth</FormLabel>
                                                    <FormControl>
                                                        <Popover open={open} onOpenChange={setOpen}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    className="w-full justify-between h-12 font-normal"
                                                                >
                                                                    {field.value
                                                                        ? new Date(field.value).toLocaleDateString()
                                                                        : "Select a date"}
                                                                    <Calendar1 />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value ? new Date(field.value) : undefined}
                                                                    captionLayout="dropdown"
                                                                    onSelect={(date) => {
                                                                        if (date) {
                                                                            // get local year, month, day
                                                                            const year = date.getFullYear();
                                                                            const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                                                            const day = date.getDate().toString().padStart(2, "0");

                                                                            const localDateStr = `${year}-${month}-${day}`;
                                                                            field.onChange(localDateStr); // submit as YYYY-MM-DD
                                                                        } else {
                                                                            field.onChange("");
                                                                        }
                                                                        setOpen(false);
                                                                    }}

                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* Country */}
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value || ""}
                                                        onValueChange={(value: string) => {
                                                            field.onChange(value);
                                                            handleCountryChange(value);
                                                        }}
                                                    >
                                                        <SelectTrigger className='w-full !h-12'>
                                                            <SelectValue placeholder="Select Country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countries.map((g) => (
                                                                <SelectItem key={g.value} value={g.value}>
                                                                    {g.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* State */}
                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value || ""}
                                                        onValueChange={(value) => {
                                                            field.onChange(value);
                                                            handleStateChange(value);
                                                        }}
                                                    >
                                                        <SelectTrigger className='w-full !h-12'>
                                                            <SelectValue placeholder="Select state" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {states.map((g) => (
                                                                <SelectItem key={g.value} value={g.value}>
                                                                    {g.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {/* City */}
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value || ""}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className='w-full !h-12'>
                                                            <SelectValue placeholder="Select city" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {cities.map((g) => (
                                                                <SelectItem key={g.value} value={g.value}>
                                                                    {g.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    {/* ZIP Code */}
                                    <FormField
                                        control={form.control}
                                        name="zip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ZIP Code</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Zip" className="h-12" type="text" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Phone */}
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <PhoneInput
                                                    countries={[
                                                        { code: countryCode || '+1', label: countryCode }
                                                    ]}
                                                    placeholder="Enter your phone"
                                                    onChange={(value) => field.onChange(value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Address */}
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Referral */}
                                <FormField
                                    control={form.control}
                                    name="referred_by"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Referral</FormLabel>
                                            <FormControl>
                                                <Input readOnly={!!ref} placeholder="Referral code" className="h-12" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Terms Checkbox */}
                                <FormField
                                    control={form.control}
                                    name="terms"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={!!field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="m-0 inline-block"> By creating an account means you agree to the{" "}
                                                <span className="text-gray-800 dark:text-white/90">
                                                    Terms and Conditions,
                                                </span>{" "}
                                                and our{" "}
                                                <span className="text-gray-800 dark:text-white">
                                                    Privacy Policy
                                                </span></FormLabel>
                                        </FormItem>
                                    )}
                                />
                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                                    >
                                        {
                                            loading ?
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2Icon className="animate-spin" />
                                                    Please wait
                                                </div>
                                                : 'Sign Up'
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Already have an account? {' '}
                                <Link
                                    href="/signin"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
