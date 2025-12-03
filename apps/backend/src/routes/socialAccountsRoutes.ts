import { Request, Response } from 'express';
import { z } from 'zod';
import { SocialAccountSchema } from '../aiSchemas';
import { createSocialAccount, listSocialAccounts } from '../repositories';

// ============================================================
// POST /api/social/accounts
// ============================================================
const CreateSocialAccountInputSchema = SocialAccountSchema.extend({
  profileUrl: z.string().url().max(500),
  brand: z.enum(['JCER', 'CareerScaleUp', 'Zevaux']),
});

export async function createSocialAccountHandler(
  req: Request,
  res: Response
) {
  try {
    // Validate input
    const input = CreateSocialAccountInputSchema.parse(req.body);

    // Map camelCase to snake_case for database
    const account = await createSocialAccount({
      platform: input.platform,
      handle: input.handle,
      profile_url: input.profileUrl,
      label: input.label,
      brand: input.brand,
    });

    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error('Error creating social account:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create social account',
    });
  }
}

// ============================================================
// GET /api/social/accounts
// ============================================================
export async function listSocialAccountsHandler(req: Request, res: Response) {
  try {
    const platform = req.query.platform as string | undefined;
    const brand = req.query.brand as string | undefined;
    
    const accounts = await listSocialAccounts(platform, brand);

    res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error('Error listing social accounts:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list social accounts',
    });
  }
}

