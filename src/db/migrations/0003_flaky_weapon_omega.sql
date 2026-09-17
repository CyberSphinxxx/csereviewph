CREATE TABLE "contact_inquiries" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(120) NOT NULL,
	"category" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'unread' NOT NULL,
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_contact_inquiries_expires_at" ON "contact_inquiries" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "idx_contact_inquiries_ip_created" ON "contact_inquiries" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "idx_contact_inquiries_status" ON "contact_inquiries" USING btree ("status");