import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const tasks = await sql`SELECT id, title as text, completed as done FROM tasks ORDER BY id DESC`;
      return res.status(200).json(tasks);
    }

    if (req.method === 'POST') {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Text required' });
      const result = await sql`
        INSERT INTO tasks (title) VALUES (${text}) 
        RETURNING id, title as text, completed as done
      `;
      return res.status(201).json(result[0]);
    }

    if (req.method === 'PUT') {
      const { id, done } = req.body;
      await sql`UPDATE tasks SET completed = ${done} WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM tasks WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error' });
  }
}
