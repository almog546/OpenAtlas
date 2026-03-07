-- CreateEnum
CREATE TYPE "Category" AS ENUM ('technology', 'programming', 'webDevelopment', 'softwareEngineering', 'dataScience', 'artificialIntelligence', 'cyberSecurity', 'devOps', 'mobileDevelopment', 'gameDevelopment', 'startups', 'business', 'marketing', 'finance', 'productivity', 'career', 'education', 'science', 'health', 'lifestyle', 'travel', 'food', 'sports', 'entertainment', 'books');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "category" "Category",
ADD COLUMN     "picture" TEXT;
