import { pgTable, text, serial, integer, boolean, timestamp, date, time, numeric, jsonb } from "drizzle-orm/pg-core";

// ─── Business Settings ───
export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Admin Users ───
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("staff"), // owner, staff
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Medicines / Inventory ───
export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHi: text("name_hi"),
  genericName: text("generic_name"),
  manufacturer: text("manufacturer"),
  category: text("category"),
  batchNumber: text("batch_number"),
  barcode: text("barcode"),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull().default(10),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().default("0"),
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull().default("0"),
  gstPercent: numeric("gst_percent", { precision: 5, scale: 2 }).notNull().default("12"),
  expiryDate: date("expiry_date"),
  requiresPrescription: boolean("requires_prescription").notNull().default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Customers ───
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  address: text("address"),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Doctor Schedule ───
export const doctorSchedules = pgTable("doctor_schedules", {
  id: serial("id").primaryKey(),
  doctorName: text("doctor_name").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 6=Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

// ─── Appointments ───
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  doctorName: text("doctor_name").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Prescriptions ───
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  fileName: text("file_name").notNull(),
  fileData: text("file_data").notNull(), // base64-encoded
  fileType: text("file_type").notNull(),
  status: text("status").notNull().default("pending"), // pending, reviewed, fulfilled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Invoices ───
export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  items: jsonb("items").notNull(), // array of {name, qty, unitPrice, gst, total}
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  gstAmount: numeric("gst_amount", { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").default("cash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: text("created_by"),
});

// ─── Delivery Requests ───
export const deliveryRequests = pgTable("delivery_requests", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  medicineList: text("medicine_list"),
  prescriptionId: integer("prescription_id"),
  preferredTime: text("preferred_time"),
  status: text("status").notNull().default("pending"), // pending, assigned, in_transit, delivered, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Audit Logs ───
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userName: text("user_name"),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: integer("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
