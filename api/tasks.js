import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    const tasks = await sql`SELECT * FROM tasks ORDER BY id DESC`;
    return res.status(200).json(tasks);
  }

  if (req.method === 'POST') {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const result = await sql`INSERT INTO tasks (title) VALUES (${title}) RETURNING *`;
    return res.status(201).json(result[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
