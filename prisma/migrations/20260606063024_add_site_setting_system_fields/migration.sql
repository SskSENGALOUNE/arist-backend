-- AlterTable
ALTER TABLE "site_setting" ADD COLUMN     "date_format" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
ADD COLUMN     "primary_color" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Vientiane';
