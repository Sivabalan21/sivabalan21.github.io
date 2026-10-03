import HealthcareAI from './HealthcareAI.astro';
import Recommendations from './Recommendations.astro';
import FlashAttention3 from './FlashAttention3.astro';
import LLMReasoners from './LLMReasoners.astro';

// Keyed by project file name (without .md).
export const diagrams: Record<string, any> = {
  healthcareai: HealthcareAI,
  'recommendation-platform': Recommendations,
  'flashattention-3': FlashAttention3,
  'llm-reasoners': LLMReasoners,
};
