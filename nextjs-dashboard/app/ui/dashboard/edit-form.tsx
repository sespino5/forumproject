"use client";
import { User } from "@/app/lib/definitions";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateUser} from "@/app/lib/actions";
import { useActionState } from "react";
import { DeleteUserButton } from "./button";

export default function UpdateUserForm({ user }: { user: User }) {

    const initialState = { message: null, errors: {} };
    const updateUserWithId = updateUser.bind(null, user.id);
    const [, formAction] = useActionState(updateUserWithId, initialState);
    return (
        <form action={formAction}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        User Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Please provide the user&apos;s information.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="first-name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter user name"
                                    defaultValue={user.name}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter user email"
                                    defaultValue={user.email}
                                />
                            </div>


                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                New Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter user password"
                                    
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Confirm Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="confirm-password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Confirm user password"
                                    
                                />
                            </div>
                        </div>

                        
                    </div>
                </div>

                <div className="flex items-center gap-x-6">
                    <Button type="submit" >Save</Button>
                    <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900
                        hover:text-gray-500">
                        Cancel
                    </Link>

                    <DeleteUserButton  />
                </div>
            </div>
        </form>
    );
    

}