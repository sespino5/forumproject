import postgres from 'postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  CustomerForm,
  User,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { getUserID } from './actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
export const dynamic = "force-dynamic";

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue[]>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  const userId = await getUserID();
  
  try {
    const data = await sql<LatestInvoiceRaw[]>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id AND invoices.user_id = customers.user_id
      WHERE invoices.user_id = ${userId}
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  const userId = await getUserID();
  
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices WHERE user_id = ${userId}`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers WHERE user_id = ${userId}`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices
         WHERE user_id = ${userId}`;

        //  fetch data in parallel
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? '0');
    const numberOfCustomers = Number(data[1][0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const userId = await getUserID();
  

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id AND invoices.user_id = customers.user_id
      WHERE
        invoices.user_id = ${userId} AND (
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      )
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}


export async function getMessages(){
  const userId = await getUserID();

  try {
    const data = await sql`SELECT * FROM messages
    WHERE messages.sender = ${userId}
    OR messages.receiver = ${userId}
    `;

    // iterate over messages 
    // find the sender/receiver that is != userid
    // add to dictionary where key is the sender/receiver != userid
    // the value should be a list of the messages
    // if the key does not exist, make the key and if it exists, add the message to that key's messages
    // Create a dictionary to group messages
    const groupedMessages = await data.reduce(async (accPromise, message) => {
      const acc = await accPromise;

      // Find the sender/receiver that is not the current user
      const otherUserId =
        message.sender === userId ? message.receiver : message.sender;

      const otherUser = await sql<User[]>`SELECT * FROM users WHERE id=${otherUserId}`;
      const otherUserName = otherUser[0].name;

      // If the key does not exist, initialize it with an empty array
      if (!acc[otherUserId]) {
        acc[otherUserId] = [];
      }

      const updatedMessage = {
        ...message,
        mesagee: otherUserName,
      };

      // Add the message to the corresponding group
      acc[otherUserId].push(updatedMessage);

      return acc;
    }, Promise.resolve({} as Record<string, typeof data>));
   
    return groupedMessages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch messages');
  }
}

export async function fetchInvoicesPages(query: string) {
  const userId = await getUserID();
  
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id AND invoices.user_id = customers.user_id
    WHERE
      invoices.user_id = ${userId} AND (
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
    )
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchCustomersPages(query: string) {
  const userId = await getUserID();
  
  try {
    const data = await sql`SELECT COUNT(*)
    FROM customers
    WHERE
      customers.user_id = ${userId} AND (
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`}
    )
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchInvoiceById(id: string) {
  const userId = await getUserID();
 
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id} AND invoices.user_id = ${userId}

    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  const userId = await getUserID();
  
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      WHERE user_id = ${userId}
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomerById(id: string) {
  const userId = await getUserID();
 
  try {
    const data = await sql<CustomerForm[]>`
      SELECT
        id,
        name,
        email
      FROM customers
      WHERE id = ${id} AND user_id = ${userId}
    `;

    return data[0];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer.');
  }
}



export async function fetchFilteredCustomers(query: string , currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const userId = await getUserID();
  
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id AND customers.user_id = invoices.user_id
		WHERE
      customers.user_id = ${userId} AND (
		  customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`}
      )
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchUserById(id: string ) {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE id=${id}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
