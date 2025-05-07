'use server';

// mark all the exported functions within the file as Server Actions. 
// These server functions can then be imported and used in Client and Server components. 
// Any functions included in this file that are not used will be automatically removed from the final application bundle.
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { signIn, getUser } from '@/auth';
import { AuthError } from 'next-auth'; 
import bcrypt from 'bcrypt';
import { getServerSession } from '@/auth';



const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });



const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});


const UserFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: 'Please enter a valid  name at least x characters long',
  }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Please enter a valid password at least 6 characters long',
  })
});

export type State = {
    errors?: {
      customerId?: string[];
      amount?: string[];
      status?: string[];
    };
    message?: string | null;
  };
  

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateUser = UserFormSchema.omit({id: true})
const UpdateUser = UserFormSchema.omit({id: true})

export type User = {
  errors?: {
    id?: string[]; 
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};


export async function createUser(prevState: string | undefined, formData: FormData) {
  // safeParse() will return an object containing either a success or error field
    const validatedFields = CreateUser.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // If form validation fails, return errors early as strings. Otherwise, continue.
    if (!validatedFields.success) {
      const errorMessages = Object.entries(validatedFields.error.flatten().fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
        .join("; ");
    
      return `Missing Fields. Failed to Create User. Details: ${errorMessages}`;
    }

  // Prepare data for insertion into the database
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  //check email is unique
  try {
      const existingUser = await getUser(email);
      if (existingUser){
        return 'Database Error: Failed to Create User. Email already exists';
      }
  } catch {
    // in case no user found, proceed with creation
  }
  
  // Insert data into the database
  // uid is auto generated
  try {
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch  {
    // If a database error occurs, return a more specific error.
    return 'Database Error: Failed to Create User.';
  }

 

  await signIn('credentials', {"email": email, "password": password});

}

export async function updateUser(
  id: string,
  prevState: User | undefined,
  formData: FormData,
): Promise<User> {
  const validatedFields = UpdateUser.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const confirmPassword = formData.get("confirm-password") as string;

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.' };
  }
  try {
    
    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, password = ${hashedPassword}
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'Database Error: Failed to Update User.' };
  }

  
  revalidatePath('/dashboard');
  redirect('/dashboard');
  
}

export async function deleteUser(id: string) {  
  await sql`DELETE FROM users WHERE id = ${id}`;
  revalidatePath('/dashboard');
  
}


export async function getUserID(){ 
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      console.warn("No user session found.");
      return null;
    }

    const user = await getUser(session.user.email);
    if (!user || !user.id) {
      console.warn(`No user found for email: ${session.user.email}`);
      return null;
    }
    return user.id;
  } catch (error) {
    console.error("Failed to fetch user ID from session:", error);
    return null;
  }
}






export async function createInvoice(prevState: State | undefined , formData: FormData) {
  // safeParse() will return an object containing either a success or error field
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  const userId = await getUserID();
  
  
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date, user_id) 
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${userId})

    `;

  } catch  {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
  
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

  } catch  {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
await sql`DELETE FROM invoices WHERE id = ${id}`;
revalidatePath('/dashboard/invoices');
}

const costumerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Please enter a customer name.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  // image_url: z.string().url({ message: 'Please enter a valid image URL.' }),
});

export type costumerState = {
  errors?: {
    id?: string[];
    email?: string[];
    image_url?: string[];
    name?: string[];
  };
  message?: string | null;
};

const CreateCustomer = costumerSchema.omit({ id: true  });

export async function createCustomer(
  prevState: costumerState,
  formData: FormData
): Promise<costumerState> {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
     // Default to an empty string if not provided
  });


  const image_url = '/customers/profile.png'

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create customer.",
    };
  }

  const { name, email } = validatedFields.data;
  let userId = await getUserID();
  if (!userId) {
    userId = '00000000-0000-0000-0000-000000000000'; // Default value if userId is not found
  }

  try {
    await sql`
      INSERT INTO customers (name, email, image_url, user_id)
      VALUES (${name}, ${email}, ${image_url}, ${userId})
    `;
  } catch (err) {
    console.error("Database Error:", err);
    return {
      message: "Database Error: Failed to create customer.",
      errors: {},
    };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
  
}

const UpdateCustomer = costumerSchema.omit({ id: true  });

export async function updateCustomer(
  id: string,
  prevState: costumerState,
  formData: FormData
): Promise<costumerState> {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
     // Default to an empty string if not provided
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update customer.",
    };
  }

  const { name, email } = validatedFields.data;

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error("Database Error:", err);
    return {
      message: "Database Error: Failed to update customer.",
      errors: {},
    };
  }
  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  await sql`DELETE FROM invoices WHERE customer_id = ${id}`;
  revalidatePath('/dashboard/customers');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}




