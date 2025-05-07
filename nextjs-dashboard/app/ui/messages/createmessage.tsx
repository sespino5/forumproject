"use client";

import Link from "next/link";
import { Button } from "@/app/ui/button";
import { useActionState } from "react";
import { createMessage, MessageState } from "@/app/lib/actions";


export default function Form() {

    const initialState: MessageState = { message: null, errors: {} };
    const [, formAction] = useActionState(createMessage, initialState);

    return (
        <form action={formAction}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Message Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Please provide the message&apos;s information.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="sender"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Sender
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="sender"
                                    id="sender"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter sender name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label
                                htmlFor="receiver"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Receiver
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="receiver"
                                    id="receiver"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter receiver name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-full">
                            <label
                                htmlFor="message"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Message
                            </label>
                            <div className="mt-2">
                                <textarea
                                    name="message"
                                    id="
                                    message"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter message"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Link
                        href="/messages"
                        className="text-sm font-semibold leading-6 text-gray-900"
                    >
                        Cancel
                    </Link>
                    <Button type="submit">Save</Button>
                </div>
            </div>
        </form>
    );
}
    
