CREATE TYPE "public"."event_location_type" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TABLE "events" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"thumbnail_url" text,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"location_type" "event_location_type" NOT NULL,
	"location_name" varchar(255),
	"location_address" text,
	"location_url" text,
	"max_attendees" integer DEFAULT 0 NOT NULL,
	"current_attendees" integer DEFAULT 0 NOT NULL,
	"address" varchar NOT NULL,
	"transaction_hash" text NOT NULL,
	"creator_id" varchar NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_address_unique" UNIQUE("address"),
	CONSTRAINT "events_transaction_hash_unique" UNIQUE("transaction_hash")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"privy_id" varchar NOT NULL,
	"wallet" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_privy_id_unique" UNIQUE("privy_id")
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;