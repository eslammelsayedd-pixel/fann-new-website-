// This API endpoint is not used in the current implementation.
// The FANN Studio pages now have their own specialized API endpoints.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(404).json({ error: 'This endpoint is deprecated.' });
}
