-- Add cancerTypes array (multiple cancer types per article)
ALTER TABLE "Article" ADD COLUMN "cancerTypes" TEXT[] DEFAULT ARRAY[]::TEXT[];
UPDATE "Article" SET "cancerTypes" = ARRAY["cancerType"] WHERE "cancerType" IS NOT NULL;
ALTER TABLE "Article" DROP COLUMN IF EXISTS "cancerType";

-- Add categories array for multiple categories
ALTER TABLE "Article" ADD COLUMN "categories" "ArticleCategory"[] DEFAULT ARRAY[]::"ArticleCategory"[];
UPDATE "Article" SET "categories" = ARRAY["category"]::"ArticleCategory"[] WHERE "category" IS NOT NULL;
ALTER TABLE "Article" DROP COLUMN IF EXISTS "category";

-- Add stages array for multiple stages
ALTER TABLE "Article" ADD COLUMN "stages" "CancerStage"[] DEFAULT ARRAY[]::"CancerStage"[];
UPDATE "Article" SET "stages" = ARRAY["stage"]::"CancerStage"[] WHERE "stage" IS NOT NULL;
ALTER TABLE "Article" DROP COLUMN IF EXISTS "stage";

-- Add treatmentTypes array
ALTER TABLE "Article" ADD COLUMN "treatmentTypes" "TreatmentType"[] DEFAULT ARRAY[]::"TreatmentType"[];
UPDATE "Article" SET "treatmentTypes" = ARRAY["treatmentType"]::"TreatmentType"[] WHERE "treatmentType" IS NOT NULL;
ALTER TABLE "Article" DROP COLUMN IF EXISTS "treatmentType";

-- Remove excerpt
ALTER TABLE "Article" DROP COLUMN IF EXISTS "excerpt";

-- Drop old indexes
DROP INDEX IF EXISTS "Article_cancerType_category_stage_idx";
DROP INDEX IF EXISTS "Article_treatmentType_idx";
