// This API endpoint is not used in the current implementation.
// The functionality has been integrated into the ROI Calculator page and its API.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(404).json({ error: 'This endpoint is deprecated.' });
}
