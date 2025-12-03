import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePersonaHandler } from './routes/generatePersona';
import { generateMessagingHandler } from './routes/generateMessaging';
import { generateScriptHandler } from './routes/generateScript';
import { generateBlogOutlineHandler } from './routes/generateBlogOutline';
import { listPersonasHandler } from './routes/listPersonas';
import { listMessagingHandler } from './routes/listMessaging';
import { listScriptsHandler } from './routes/listScripts';
import { listBlogOutlinesHandler } from './routes/listBlogOutlines';
import { validateGlobalHandler } from './routes/validateGlobal';
import { validateAutoFixHandler } from './routes/validateAutoFix';
import socialRouter from './routes/socialRouter';

// Growth OS new module routes
import { generateFunnelHandler } from './routes/generateFunnel';
import { listFunnelsHandler } from './routes/listFunnels';
import { generateLeadMagnetHandler } from './routes/generateLeadMagnet';
import { listLeadMagnetsHandler } from './routes/listLeadMagnets';
import { generateEmailSmsSequenceHandler } from './routes/generateEmailSmsSequence';
import { listEmailSmsSequencesHandler } from './routes/listEmailSmsSequences';
import { generateSocialPackHandler } from './routes/generateSocialPack';
import { listSocialPacksHandler } from './routes/listSocialPacks';
import { generatePaidAdsPackHandler } from './routes/generatePaidAdsPack';
import { listPaidAdsPacksHandler } from './routes/listPaidAdsPacks';
import { generatePricingPagePackHandler } from './routes/generatePricingPagePack';
import { listPricingPagePacksHandler } from './routes/listPricingPagePacks';
import { generateSocialProofPackHandler } from './routes/generateSocialProofPack';
import { listSocialProofPacksHandler } from './routes/listSocialProofPacks';
import { generateViralShortFormScriptHandler } from './routes/generateViralShortFormScript';
import { listViralShortFormScriptsHandler } from './routes/listViralShortFormScripts';
import { generateLinkedInViralPackHandler } from './routes/generateLinkedInViralPack';
import { listLinkedInViralPacksHandler } from './routes/listLinkedInViralPacks';

// Campaign assets (generate-only, no DB)
import { generateAdsPackHandler } from './routes/generateCampaignAdsPack';
import { generateSocialProofPackHandler as generateCampaignSocialProofHandler } from './routes/generateCampaignSocialProof';
import { generatePricingPackHandler as generateCampaignPricingHandler } from './routes/generateCampaignPricingPack';

// Analytics & Niche Variant (generate-only)
import { analyzeAnalyticsHandler } from './routes/analyzeAnalytics';
import { generateNicheVariantHandler } from './routes/generateNicheVariant';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'growth-os-backend',
  });
});

// API Routes - AI Generation Endpoints (Original)
app.post('/api/generate/persona', generatePersonaHandler);
app.post('/api/generate/messaging', generateMessagingHandler);
app.post('/api/generate/script', generateScriptHandler);
app.post('/api/generate/blog-outline', generateBlogOutlineHandler);

// API Routes - AI Generation Endpoints (Growth OS New Modules)
app.post('/api/generate/funnel', generateFunnelHandler);
app.post('/api/generate/lead-magnet', generateLeadMagnetHandler);
app.post('/api/generate/email-sms-sequence', generateEmailSmsSequenceHandler);
app.post('/api/generate/social-pack', generateSocialPackHandler);
app.post('/api/generate/paid-ads-pack', generatePaidAdsPackHandler);
app.post('/api/generate/pricing-page-pack', generatePricingPagePackHandler);
app.post('/api/generate/social-proof-pack', generateSocialProofPackHandler);
app.post('/api/generate/viral-short-form-script', generateViralShortFormScriptHandler);
app.post('/api/generate/linkedin-viral-pack', generateLinkedInViralPackHandler);

// API Routes - Campaign Assets (Generate-Only)
app.post('/api/generate-ads-pack', generateAdsPackHandler);
app.post('/api/generate-social-proof', generateCampaignSocialProofHandler);
app.post('/api/generate-pricing-pack', generateCampaignPricingHandler);

// API Routes - Analytics & Niche Variant
app.post('/api/analyze-analytics', analyzeAnalyticsHandler);
app.post('/api/generate-niche-variant', generateNicheVariantHandler);

// API Routes - List Endpoints (Original)
app.get('/api/personas', listPersonasHandler);
app.get('/api/messaging', listMessagingHandler);
app.get('/api/scripts', listScriptsHandler);
app.get('/api/blog-outlines', listBlogOutlinesHandler);

// API Routes - List Endpoints (Growth OS New Modules)
app.get('/api/funnels', listFunnelsHandler);
app.get('/api/lead-magnets', listLeadMagnetsHandler);
app.get('/api/email-sms-sequences', listEmailSmsSequencesHandler);
app.get('/api/social-packs', listSocialPacksHandler);
app.get('/api/paid-ads-packs', listPaidAdsPacksHandler);
app.get('/api/pricing-page-packs', listPricingPagePacksHandler);
app.get('/api/social-proof-packs', listSocialProofPacksHandler);
app.get('/api/viral-short-form-scripts', listViralShortFormScriptsHandler);
app.get('/api/linkedin-viral-packs', listLinkedInViralPacksHandler);

// API Routes - Validation
app.post('/api/validate/global', validateGlobalHandler);
app.post('/api/validate/auto-fix', validateAutoFixHandler);

// API Routes - Social Analytics
app.use('/api/social', socialRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Growth OS Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Generation endpoints ready at /api/generate/*`);
  console.log(`   - Original: persona, messaging, script, blog-outline`);
  console.log(`   - New: funnel, lead-magnet, email-sms-sequence, social-pack, paid-ads-pack`);
  console.log(`   - New: pricing-page-pack, social-proof-pack, viral-short-form-script, linkedin-viral-pack`);
  console.log(`📈 Campaign Assets: /api/generate-ads-pack, /api/generate-social-proof, /api/generate-pricing-pack`);
  console.log(`📊 Analytics: /api/analyze-analytics`);
  console.log(`🎯 Niche Variants: /api/generate-niche-variant`);
  console.log(`✅ Global Validation endpoint ready at /api/validate/global`);
  console.log(`📱 Social Analytics endpoints ready at /api/social/*`);
});

