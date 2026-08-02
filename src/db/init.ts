import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import { hashPassword } from "@/lib/auth";
import { DEFAULT_SETTINGS } from "@/lib/constants";

async function query(databaseUrl: string, queryText: string, params: any[] = []) {
  if (databaseUrl.includes("neon.tech")) {
    const sql: any = neon(databaseUrl);
    return await sql(queryText, params);
  } else {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    });
    try {
      const res = await pool.query(queryText, params);
      return res.rows;
    } finally {
      await pool.end().catch(() => {});
    }
  }
}

export async function ensureTablesExist() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_mhjnwN9DT8qi@ep-falling-art-aydojaq2.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

  if (!databaseUrl) return;

  try {
    // 1. Create tables matching schema.ts
    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'admin',
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS business_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS medicines (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        name_hi VARCHAR(150),
        generic_name VARCHAR(150),
        manufacturer VARCHAR(150),
        category VARCHAR(50),
        batch_number VARCHAR(50),
        barcode VARCHAR(50),
        quantity INT NOT NULL DEFAULT 0,
        reorder_level INT NOT NULL DEFAULT 10,
        unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        mrp NUMERIC(10, 2) NOT NULL DEFAULT 0,
        gst_percent NUMERIC(5, 2) NOT NULL DEFAULT 12,
        expiry_date DATE,
        requires_prescription BOOLEAN NOT NULL DEFAULT false,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        email VARCHAR(100),
        address TEXT,
        loyalty_points INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS doctor_schedules (
        id SERIAL PRIMARY KEY,
        doctor_name VARCHAR(100) NOT NULL DEFAULT 'Dr. Sharma',
        day_of_week INT NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN NOT NULL DEFAULT true
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(100),
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        doctor_name VARCHAR(100) NOT NULL DEFAULT 'Dr. Sharma',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS prescriptions (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        file_name VARCHAR(255) NOT NULL DEFAULT 'prescription',
        file_data TEXT NOT NULL DEFAULT '',
        file_type VARCHAR(100) NOT NULL DEFAULT 'image/png',
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS delivery_requests (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        delivery_address TEXT NOT NULL,
        medicine_list TEXT,
        prescription_id INT,
        preferred_time VARCHAR(50),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20),
        items JSONB NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        gst_amount NUMERIC(10, 2) NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        payment_method VARCHAR(20) DEFAULT 'cash',
        created_by VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    await query(databaseUrl, `
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INT,
        user_name VARCHAR(100),
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(100) NOT NULL,
        entity_id INT,
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // 2. Safe migration alters for tables created by old SQL scripts
    await query(databaseUrl, `
      DO $$ 
      BEGIN 
        -- business_settings id column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='business_settings' AND column_name='id') THEN
          ALTER TABLE business_settings ADD COLUMN id SERIAL;
        END IF;

        -- appointments
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='patient_name') THEN
          ALTER TABLE appointments RENAME COLUMN patient_name TO customer_name;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='phone') THEN
          ALTER TABLE appointments RENAME COLUMN phone TO customer_phone;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='doctor_name') THEN
          ALTER TABLE appointments ADD COLUMN doctor_name VARCHAR(100) NOT NULL DEFAULT 'Dr. Sharma';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='customer_email') THEN
          ALTER TABLE appointments ADD COLUMN customer_email VARCHAR(100);
        END IF;

        -- prescriptions
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prescriptions' AND column_name='patient_name') THEN
          ALTER TABLE prescriptions RENAME COLUMN patient_name TO customer_name;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prescriptions' AND column_name='phone') THEN
          ALTER TABLE prescriptions RENAME COLUMN phone TO customer_phone;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prescriptions' AND column_name='file_name') THEN
          ALTER TABLE prescriptions ADD COLUMN file_name VARCHAR(255) NOT NULL DEFAULT 'prescription';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prescriptions' AND column_name='file_data') THEN
          ALTER TABLE prescriptions ADD COLUMN file_data TEXT NOT NULL DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prescriptions' AND column_name='file_type') THEN
          ALTER TABLE prescriptions ADD COLUMN file_type VARCHAR(100) NOT NULL DEFAULT 'image/png';
        END IF;

        -- delivery_requests
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delivery_requests' AND column_name='phone') THEN
          ALTER TABLE delivery_requests RENAME COLUMN phone TO customer_phone;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delivery_requests' AND column_name='address') THEN
          ALTER TABLE delivery_requests RENAME COLUMN address TO delivery_address;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delivery_requests' AND column_name='items') THEN
          ALTER TABLE delivery_requests RENAME COLUMN items TO medicine_list;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delivery_requests' AND column_name='prescription_id') THEN
          ALTER TABLE delivery_requests ADD COLUMN prescription_id INT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='delivery_requests' AND column_name='preferred_time') THEN
          ALTER TABLE delivery_requests ADD COLUMN preferred_time VARCHAR(50);
        END IF;

        -- invoices
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='tax_amount') THEN
          ALTER TABLE invoices RENAME COLUMN tax_amount TO gst_amount;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='payment_mode') THEN
          ALTER TABLE invoices RENAME COLUMN payment_mode TO payment_method;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invoices' AND column_name='created_by') THEN
          ALTER TABLE invoices ADD COLUMN created_by VARCHAR(100);
        END IF;

        -- medicines
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medicines' AND column_name='name_hi') THEN
          ALTER TABLE medicines ADD COLUMN name_hi VARCHAR(150);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medicines' AND column_name='barcode') THEN
          ALTER TABLE medicines ADD COLUMN barcode VARCHAR(50);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medicines' AND column_name='reorder_level') THEN
          ALTER TABLE medicines ADD COLUMN reorder_level INT NOT NULL DEFAULT 10;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medicines' AND column_name='active') THEN
          ALTER TABLE medicines ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='medicines' AND column_name='updated_at') THEN
          ALTER TABLE medicines ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
        END IF;
      END $$;
    `);

    // 3. Ensure Default Admin User Exists and has valid credentials!
    const hash = await hashPassword("admin123");
    await query(
      databaseUrl,
      `INSERT INTO admin_users (username, password_hash, full_name, role, active) 
       VALUES ($1, $2, $3, $4, true)
       ON CONFLICT (username) 
       DO UPDATE SET password_hash = $2, active = true;`,
      ["admin", hash, "Sharma Admin", "owner"]
    );

    // 4. Seed Business Settings if empty
    const settings = await query(databaseUrl, `SELECT key FROM business_settings LIMIT 1`);
    if (!settings || settings.length === 0) {
      for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
        await query(
          databaseUrl,
          `INSERT INTO business_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
          [k, String(v)]
        );
      }
    }

    // 5. Seed Doctor Schedules if empty
    const scheds = await query(databaseUrl, `SELECT id FROM doctor_schedules LIMIT 1`);
    if (!scheds || scheds.length === 0) {
      for (let day = 1; day <= 6; day++) {
        await query(
          databaseUrl,
          `INSERT INTO doctor_schedules (doctor_name, day_of_week, start_time, end_time, is_available) VALUES ($1, $2, $3, $4, $5)`,
          ["Dr. Sharma", day, "10:00:00", "14:00:00", true]
        );
      }
    }

    // 6. Seed Sample Medicines if empty
    const meds = await query(databaseUrl, `SELECT id FROM medicines LIMIT 1`);
    if (!meds || meds.length === 0) {
      const sampleMeds = [
        ["Paracetamol 500mg", "Paracetamol", "Cipla", "Pain Relief", 150, "8.50", "10.00", "12", false, "B2024001"],
        ["Amoxicillin 250mg", "Amoxicillin", "Sun Pharma", "Antibiotic", 80, "12.00", "15.00", "12", true, "B2024002"],
        ["Cetirizine 10mg", "Cetirizine", "Dr. Reddy's", "Allergy", 200, "5.00", "7.00", "12", false, "B2024003"],
        ["Omeprazole 20mg", "Omeprazole", "Cipla", "Gastric", 0, "10.00", "14.00", "12", false, "B2024004"],
        ["Metformin 500mg", "Metformin", "USV", "Diabetes", 120, "6.00", "8.00", "5", true, "B2024005"],
        ["Atorvastatin 10mg", "Atorvastatin", "Sun Pharma", "Cholesterol", 5, "15.00", "20.00", "12", true, "B2024006"],
        ["Azithromycin 500mg", "Azithromycin", "Alkem", "Antibiotic", 45, "25.00", "32.00", "12", true, "B2024007"],
        ["Pantoprazole 40mg", "Pantoprazole", "Cipla", "Gastric", 90, "8.00", "12.00", "12", false, "B2024008"],
        ["Dolo 650", "Paracetamol", "Micro Labs", "Pain Relief", 300, "5.50", "7.50", "12", false, "B2024009"],
        ["Crocin Advance", "Paracetamol", "GSK", "Pain Relief", 100, "12.00", "16.00", "12", false, "B2024010"],
      ];

      for (const med of sampleMeds) {
        await query(
          databaseUrl,
          `INSERT INTO medicines (name, generic_name, manufacturer, category, quantity, unit_price, mrp, gst_percent, requires_prescription, batch_number)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          med
        );
      }
    }

    // Done initializing
  } catch (err) {
    console.error("ensureTablesExist error:", err);
  }
}

