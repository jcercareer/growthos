import { Router } from 'express';
import {
  createSocialAccountHandler,
  listSocialAccountsHandler,
} from './socialAccountsRoutes';
import {
  createSocialPostHandler,
  listSocialPostsHandler,
} from './socialPostsRoutes';
import {
  createMetricsSnapshotHandler,
  listMetricsForPostHandler,
} from './metricsRoutes';

const router = Router();

// ============================================================
// SOCIAL ACCOUNTS ROUTES
// ============================================================
router.post('/accounts', createSocialAccountHandler);
router.get('/accounts', listSocialAccountsHandler);

// ============================================================
// SOCIAL POSTS ROUTES
// ============================================================
router.post('/posts', createSocialPostHandler);
router.get('/posts', listSocialPostsHandler);

// ============================================================
// METRICS ROUTES
// ============================================================
router.post('/posts/:postId/metrics', createMetricsSnapshotHandler);
router.get('/posts/:postId/metrics', listMetricsForPostHandler);

export default router;

