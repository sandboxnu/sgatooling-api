import { VercelRequest, VercelResponse } from "@vercel/node";

export default async(req: VercelRequest, res: VercelResponse) => {
  res.status(404).send("Endpoint does not exist")
}