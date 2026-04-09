import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAtColumn } from "@/lib/db/schema/shared";
import { reviewThreads } from "@/lib/db/schema/review-threads";

export const commentTypeEnum = pgEnum("comment_type", [
  "comment",
  "change_request",
  "approval_note",
]);

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => reviewThreads.id, { onDelete: "cascade" }),
    authorId: text("author_id").notNull(),
    body: text("body").notNull(),
    commentType: commentTypeEnum("comment_type").default("comment").notNull(),
    createdAt: createdAtColumn(),
  },
  (table) => ({
    threadIndex: index("comments_thread_idx").on(table.threadId),
  }),
);
