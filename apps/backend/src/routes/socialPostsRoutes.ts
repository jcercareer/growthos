import { Request, Response } from 'express';
import { z } from 'zod';
import { createSocialPost, listSocialPosts } from '../repositories';

// ============================================================
// POST /api/social/posts
// ============================================================
const CreateSocialPostInputSchema = z.object({
  socialAccountId: z.string().uuid(),
  product: z.enum(['CareerScaleUp', 'Zevaux']),
  audienceType: z.enum(['jobseeker', 'recruiter', 'smb_owner', 'other']),
  sourceType: z.enum(['script', 'blog', 'other']),
  sourceId: z.string().uuid().optional(),
  platformPostId: z.string().max(200).optional(),
  url: z.string().url().max(1000),
  postedAt: z.string().datetime(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export async function createSocialPostHandler(req: Request, res: Response) {
  try {
    // Validate input
    const input = CreateSocialPostInputSchema.parse(req.body);

    // Map camelCase to snake_case for database
    const post = await createSocialPost({
      social_account_id: input.socialAccountId,
      product: input.product,
      audience_type: input.audienceType,
      source_type: input.sourceType,
      source_id: input.sourceId || null,
      platform_post_id: input.platformPostId || null,
      url: input.url,
      posted_at: input.postedAt,
      tags: input.tags || [],
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error creating social post:', error);

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
        error instanceof Error ? error.message : 'Failed to create social post',
    });
  }
}

// ============================================================
// GET /api/social/posts
// ============================================================
const ListSocialPostsQuerySchema = z.object({
  product: z.enum(['CareerScaleUp', 'Zevaux']).optional(),
  audienceType: z.enum(['jobseeker', 'recruiter', 'smb_owner', 'other']).optional(),
  accountId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  tag: z.string().optional(),
});

export async function listSocialPostsHandler(req: Request, res: Response) {
  try {
    // Validate query params
    const query = ListSocialPostsQuerySchema.parse(req.query);

    // Build filters
    const filters: any = {};
    if (query.product) filters.product = query.product;
    if (query.audienceType) filters.audienceType = query.audienceType;
    if (query.accountId) filters.socialAccountId = query.accountId;
    if (query.tag) filters.tag = query.tag;

    // Get posts
    let posts = await listSocialPosts(filters);

    // Apply date filtering if provided
    if (query.dateFrom) {
      posts = posts.filter(
        (p) => new Date(p.posted_at) >= new Date(query.dateFrom!)
      );
    }
    if (query.dateTo) {
      posts = posts.filter(
        (p) => new Date(p.posted_at) <= new Date(query.dateTo!)
      );
    }

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Error listing social posts:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to list social posts',
    });
  }
}

