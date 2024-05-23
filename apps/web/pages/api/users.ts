import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const response = await fetch("http://localhost:5002/satsend/users");
    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to fetch users");
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch users due to ${error}` });
  }
}
