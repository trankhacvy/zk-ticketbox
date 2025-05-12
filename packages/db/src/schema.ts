import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { nanoid } from "./utils";

export const eventLocationTypeEnum = pgEnum("event_location_type", [
  "online",
  "offline",
]);

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  privyId: varchar("privy_id").notNull().unique(),
  wallet: varchar("wallet"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),

  // Event basic info
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  // Event timing
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),

  // Event location
  locationType: eventLocationTypeEnum("location_type").notNull(),
  locationName: varchar("location_name", { length: 255 }), // Optional name for the location
  locationAddress: text("location_address"), // For offline events
  locationUrl: text("location_url"), // For online events (Zoom, Discord links)

  // Attendance
  maxAttendees: integer("max_attendees").notNull().default(0), // 0 means unlimited
  currentAttendees: integer("current_attendees").notNull().default(0),

  address: varchar("address").notNull().unique(),
  transactionHash: text("transaction_hash").notNull().unique(),

  // Meta info
  creatorId: varchar("creator_id")
    .notNull()
    .references(() => users.id),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  createdEvents: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  creator: one(users, {
    fields: [events.creatorId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Event = typeof events.$inferSelect;
export type EventWithCreator = Event & {
  creator: User;
};
export type NewEvent = typeof events.$inferInsert;

export type LocationType = (typeof eventLocationTypeEnum.enumValues)[number];
