// "use server";

// import { eq, and, gte, lte, desc } from "drizzle-orm";
// import { db } from "./drizzle";
// import { events, users } from "./schema";
// import type { NewEvent, Event, EventWithCreator } from "./schema";

// // Event functions
// export async function createEvent(data: NewEvent): Promise<Event> {
//   const [event] = await db.insert(events).values(data).returning();
//   return event;
// }

// export async function getEventById(
//   id: string
// ): Promise<EventWithCreator | null> {
//   const result = await db
//     .select()
//     .from(events)
//     .innerJoin(users, eq(events.creatorId, users.id))
//     .where(eq(events.id, id))
//     .limit(1);

//   if (result.length === 0) return null;

//   const { events: event, users: creator } = result[0];

//   return { ...event, creator };
// }

// export async function getUpcomingEvents(
//   limit = 10
// ): Promise<EventWithCreator[]> {
//   const now = new Date();
//   const results = await db
//     .select()
//     .from(events)
//     .innerJoin(users, eq(events.creatorId, users.id))
//     .where(and(eq(events.isPublished, true), gte(events.startAt, now)))
//     .orderBy(events.startAt)
//     .limit(limit);

//   return results.map(({ events: event, users: creator }) => ({
//     ...event,
//     creator,
//   }));
// }

// export async function getEvents(): Promise<Event[]> {
//   const now = new Date();

//   const results = await db
//     .select()
//     .from(events)
//     .where(and(eq(events.isPublished, true), gte(events.endAt, now)))
//     .orderBy(events.startAt);

//   return results;
// }

// export async function getEventsByDateRange(
//   startDate: Date,
//   endDate: Date
// ): Promise<Event[]> {
//   return db
//     .select()
//     .from(events)
//     .where(
//       and(
//         eq(events.isPublished, true),
//         gte(events.startAt, startDate),
//         lte(events.startAt, endDate)
//       )
//     )
//     .orderBy(events.startAt);
// }

// export async function getUserEvents(userId: string): Promise<Event[]> {
//   return db
//     .select()
//     .from(events)
//     .where(eq(events.creatorId, userId))
//     .orderBy(desc(events.createdAt));
// }
