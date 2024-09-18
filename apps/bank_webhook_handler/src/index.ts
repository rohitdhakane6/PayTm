import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '@repo/db/client';
import { z } from 'zod';

// Create the Express app
const app = express();

// Directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to serve the HTML file
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

// Define a schema for validation using Zod
const webhookSchema = z.object({
  token: z.string(),
  userId: z.string().regex(/^\d+$/, 'User ID should be a number'),
});

// Route to handle the HDFC webhook
app.get('/hdfcWebhook/:token/:userId', async (req: Request, res: Response) => {
  // Extract and validate the data from the request
  const validationResult = webhookSchema.safeParse({
    token: req.params.token,
    userId: req.params.userId,
  });

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Invalid data',
      errors: validationResult.error.errors,
    });
  }

  const paymentInformation = validationResult.data;

  try {
    // Verify the request is coming from HDFC bank using a secret token
    const hdfcSecret = req.headers['x-hdfc-secret'] as string;
    if (hdfcSecret !== process.env.HDFC_SECRET) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: 100, // Example increment, replace with actual logic
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: 'Success',
        },
      }),
    ]);

    console.log(paymentInformation);

    res.json({
      message: 'Captured',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: 'Error while processing webhook',
    });
  }
});

// Start the server
app.listen(3003, () => {
  console.log('Listening on port 3003');
});
