-- CreateTable
CREATE TABLE "site_setting" (
    "id" UUID NOT NULL,
    "logo_url" TEXT,
    "brand_name" TEXT,
    "description" TEXT,
    "footer_text" TEXT,
    "links_heading" TEXT,
    "footer_links" JSONB NOT NULL DEFAULT '[]',
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "contact_address" TEXT,
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "whatsapp_url" TEXT,
    "linkedin_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "site_setting_pkey" PRIMARY KEY ("id")
);
