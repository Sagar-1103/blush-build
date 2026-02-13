import { pgTable, uuid, text, varchar, boolean, timestamp, integer, pgEnum, json } from "drizzle-orm/pg-core";

// Enums
export const templateTypeEnum = pgEnum("template_type", [
    "confession",
    "valentine",
    "proposal",
]);

// Interactive Twist: What happens when user clicks "No" button
export const interactiveTwistEnum = pgEnum("interactive_twist", [
    "none",
    "runaway",
    "heart-puzzle", // DEPRECATED: kept for backward compat, use unlockType "love-captcha" instead
]);

// Page Protection: Lock the entire page with password/nickname/captcha
export const unlockTypeEnum = pgEnum("unlock_type", [
    "none",
    "password",
    "nickname",
    "love-captcha",
]);

// DEPRECATED: Keep for backward compatibility, but use interactiveTwist instead
export const noButtonStyleEnum = pgEnum("no_button_style", [
    "runaway",
    "sweet-message",
]);

// Users table
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Pages table
export const pages = pgTable("pages", {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    templateType: templateTypeEnum("template_type").notNull().default("confession"),
    crushName: varchar("crush_name", { length: 100 }).notNull().default("Someone Special"),
    mainMessage: text("main_message").notNull().default("I have something to tell you..."),
    subMessage: text("sub_message"),
    bgColor: varchar("bg_color", { length: 20 }).notNull().default("#fdf2f8"),
    fontStyle: varchar("font_style", { length: 50 }).notNull().default("Outfit"),
    musicUrl: text("music_url"),
    successMessage: text("success_message").notNull().default("You just made me the happiest person! 💕"),

    // Interactive Twist (Step 2: Content)
    interactiveTwist: interactiveTwistEnum("interactive_twist").notNull().default("runaway"),
    captchaImages: json("captcha_images").$type<string[]>(), // Used when unlockType = "love-captcha"

    // Page Protection (Step 3: Personalize)  
    unlockType: unlockTypeEnum("unlock_type").notNull().default("none"),
    unlockValue: varchar("unlock_value", { length: 100 }), // Password or nickname

    // DEPRECATED: Use interactiveTwist instead
    noButtonStyle: noButtonStyleEnum("no_button_style").notNull().default("runaway"),

    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Page photos
export const pagePhotos = pgTable("page_photos", {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id")
        .notNull()
        .references(() => pages.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    order: integer("order").notNull().default(0),
});

// Page views
export const pageViews = pgTable("page_views", {
    id: uuid("id").defaultRandom().primaryKey(),
    pageId: uuid("page_id")
        .notNull()
        .references(() => pages.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type PagePhoto = typeof pagePhotos.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
