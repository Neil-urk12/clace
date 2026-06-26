ALTER TABLE "events" ADD COLUMN "type" text DEFAULT 'GeneralActivity';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "subject" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "course" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" text DEFAULT 'Scheduled';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "color" text DEFAULT '#3b82f6';