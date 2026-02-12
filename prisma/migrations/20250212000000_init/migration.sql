-- CreateEnum
CREATE TYPE "CancerStage" AS ENUM ('STAGE_0', 'STAGE_I', 'STAGE_II', 'STAGE_III', 'STAGE_IV', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('DIAGNOSTICS', 'TREATMENT', 'SIDE_EFFECTS', 'LIFE_DURING_TREATMENT', 'PREVENTION', 'MENTAL_SUPPORT', 'SOCIAL_SUPPORT', 'GENERAL_INFO', 'STAGE_SPECIFIC', 'CLINICAL_TRIALS', 'FAQ', 'SUPPORT_SERVICES');

-- CreateEnum
CREATE TYPE "TreatmentType" AS ENUM ('DIAGNOSTICS', 'BIOPSY', 'SURGERY', 'CHEMOTHERAPY', 'RADIOTHERAPY', 'IMMUNOTHERAPY', 'TARGETED_THERAPY', 'HORMONE_THERAPY', 'FOLLOW_UP', 'REMISSION');

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "cancerType" TEXT NOT NULL,
    "stage" "CancerStage",
    "category" "ArticleCategory" NOT NULL,
    "treatmentType" "TreatmentType",
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "Article_cancerType_category_stage_idx" ON "Article"("cancerType", "category", "stage");

-- CreateIndex
CREATE INDEX "Article_treatmentType_idx" ON "Article"("treatmentType");

-- CreateIndex
CREATE INDEX "Article_isPublished_publishedAt_idx" ON "Article"("isPublished", "publishedAt");
