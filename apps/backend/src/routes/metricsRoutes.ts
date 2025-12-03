import { Request, Response } from 'express';
import { z } from 'zod';
import {
  createMetricsSnapshot,
  listMetricsForPost,
  getSocialPostById,
} from '../repositories';

// ============================================================
// POST /api/social/posts/:postId/metrics
// ============================================================
const CreateMetricsSnapshotInputSchema = z.object({
  views: z.number().int().min(0),
  likes: z.number().int().min(0),
  comments: z.number().int().min(0),
  shares: z.number().int().min(0),
  saves: z.number().int().min(0).optional(),
});

export async function createMetricsSnapshotHandler(
  req: Request,
  res: Response
) {
  try {
    const postId = req.params.postId;

    // Validate postId is UUID
    if (!z.string().uuid().safeParse(postId).success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
    }

    // Verify post exists
    const post = await getSocialPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Social post not found',
      });
    }

    // Validate input
    const input = CreateMetricsSnapshotInputSchema.parse(req.body);

    // Create snapshot
    const snapshot = await createMetricsSnapshot({
      social_post_id: postId,
      views: input.views,
      likes: input.likes,
      comments: input.comments,
      shares: input.shares,
      saves: input.saves || 0,
    });

    res.status(201).json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    console.error('Error creating metrics snapshot:', error);

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
          : 'Failed to create metrics snapshot',
    });
  }
}

// ============================================================
// GET /api/social/posts/:postId/metrics
// ============================================================
export async function listMetricsForPostHandler(req: Request, res: Response) {
  try {
    const postId = req.params.postId;

    // Validate postId is UUID
    if (!z.string().uuid().safeParse(postId).success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
    }

    // Verify post exists
    const post = await getSocialPostById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Social post not found',
      });
    }

    // Get metrics
    const metrics = await listMetricsForPost(postId);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error listing metrics:', error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to list metrics',
    });
  }
}

