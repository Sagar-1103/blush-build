CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "template_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "template_type" SET DEFAULT 'confession'::text;--> statement-breakpoint
DROP TYPE "public"."template_type";--> statement-breakpoint
CREATE TYPE "public"."template_type" AS ENUM('confession', 'valentine', 'proposal');--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "template_type" SET DEFAULT 'confession'::"public"."template_type";--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "template_type" SET DATA TYPE "public"."template_type" USING "template_type"::"public"."template_type";--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;