// This API endpoint is not used in the current implementation.
// The functionality has been integrated into the Media Studio.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(404).json({ error: 'This endpoint is deprecated.' });
}
