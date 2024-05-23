import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:5002";

  try {
    let response;
    if (req.method === "GET") {
      response = await fetch(`${backendUrl}/satsend/users`);
    } else if (req.method === "POST") {
      response = await fetch(`${backendUrl}/satsend/faucet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
    }

    if (!response.ok) {
      console.log(response);
      throw new Error(
        `Failed to ${req.method === "GET" ? "fetch users" : "perform action"}`
      );
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: `Failed to ${
        req.method === "GET" ? "fetch users" : "perform action"
      } due to ${error}`,
    });
  }
}
