DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interactive_twist') THEN
        CREATE TYPE "public"."interactive_twist" AS ENUM('none', 'runaway', 'heart-puzzle');
    END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'no_button_style') THEN
        CREATE TYPE "public"."no_button_style" AS ENUM('runaway', 'sweet-message');
    END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_type') THEN
        CREATE TYPE "public"."template_type" AS ENUM('confession', 'valentine', 'birthday', 'proposal', 'just-because');
    END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'unlock_type') THEN
        CREATE TYPE "public"."unlock_type" AS ENUM('none', 'password', 'nickname');
    END IF;
END $$;--> statement-breakpoint
CREATE TABLE "page_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"url" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"template_type" "template_type" DEFAULT 'confession' NOT NULL,
	"crush_name" varchar(100) DEFAULT 'Someone Special' NOT NULL,
	"main_message" text DEFAULT 'I have something to tell you...' NOT NULL,
	"sub_message" text,
	"bg_color" varchar(20) DEFAULT '#fdf2f8' NOT NULL,
	"font_style" varchar(50) DEFAULT 'Outfit' NOT NULL,
	"music_url" text,
	"success_message" text DEFAULT 'You just made me the happiest person! 💕' NOT NULL,
	"interactive_twist" "interactive_twist" DEFAULT 'runaway' NOT NULL,
	"captcha_images" json,
	"unlock_type" "unlock_type" DEFAULT 'none' NOT NULL,
	"unlock_value" varchar(100),
	"no_button_style" "no_button_style" DEFAULT 'runaway' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "page_photos" ADD CONSTRAINT "page_photos_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;