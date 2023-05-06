import { NextApiRequest, NextApiResponse } from "next";
import cors from "nextjs-cors";

// cors proxy
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  if (req.method !== "GET") {
    return res.status(404).json({
      error: "Not found",
    });
  }
  const { url } = req.query;
  if (!url) {
    return res.status(404).json({
      error: "No url provided",
    });
  }
  const response = await fetch(url as string);
  const text = await response.text();
  return res.status(200).send(text);
};

export default handler;
