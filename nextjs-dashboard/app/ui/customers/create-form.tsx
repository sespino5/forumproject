
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createCustomer, costumerState } from "@/app/lib/actions";
import { useActionState } from "react";


export default function Form() {
    const initialState: costumerState = { message: null, errors: {} };
    const [, formAction] = useActionState(createCustomer, initialState);

    return (
        <form action={formAction}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Customer Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Please provide the customer&apos;s information.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="name"
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
                                    placeholder="Enter customer name"
                                    required
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
                                    placeholder="Enter customer email"
                                    required
                                />
                            </div>
                        </div>

                        {/* <div className="sm:col-span-3">
                            <label
                                htmlFor="image_url"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Image
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="image_url"
                                    id="image_url"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Enter image URL"
                                />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Link href="/dashboard/customers" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </Link>
                <Button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Create Customer
                </Button>
            </div>

        </form>
    );
}