const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if not already set
if (!process.env.DATABASE_URL) {
  try {
    const envFile = fs.readFileSync(path.resolve(__dirname, '../../.env.local'), 'utf8');
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...val] = trimmed.split('=');
        if (key && val.length > 0) {
          process.env[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  } catch (e) {
    console.log('No .env.local found or error reading it');
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('ERROR: DATABASE_URL is missing!');
  process.exit(1);
}

const sql = neon(dbUrl);

async function initDatabase() {
  console.log('Connecting to Neon PostgreSQL and initializing schema...');

  try {
    // 1. Create books table
    await sql`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        genre VARCHAR(100) NOT NULL,
        price VARCHAR(50) NOT NULL,
        cover_url TEXT,
        description TEXT NOT NULL,
        takeaways JSONB DEFAULT '[]'::jsonb,
        audience JSONB DEFAULT '[]'::jsonb,
        sample_excerpt TEXT,
        pages VARCHAR(50) DEFAULT '250 Pages',
        reading_time VARCHAR(50) DEFAULT '~4.5 Hours',
        buy_links JSONB DEFAULT '[]'::jsonb,
        is_featured BOOLEAN DEFAULT false,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('✓ Table `books` verified/created.');

    // 2. Create site_settings table (zero hardcoded social links, all editable)
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL
      );
    `;
    console.log('✓ Table `site_settings` verified/created.');

    // 3. Create subscribers table (real browser push & email list)
    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        push_subscription JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('✓ Table `subscribers` verified/created.');

    // Check if author profile exists in site_settings
    const settingsRows = await sql`SELECT key FROM site_settings WHERE key = 'author_profile'`;
    if (settingsRows.length === 0) {
      const authorProfile = {
        name: "Joshua Adeoluwa",
        tagline: "Author & Strategic Thinker",
        bio: "Joshua Adeoluwa is an author, strategist, and visionary teacher dedicated to equipping thinkers, leaders, and entrepreneurs to operate with clarity, unyielding discipline, and spiritual grounding. Through his books and teachings, Joshua breaks down complex principles of personal development, leadership, and purpose into practical, actionable frameworks.",
        photo_url: ""
      };
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES ('author_profile', ${JSON.stringify(authorProfile)}::jsonb);
      `;
      console.log('✓ Seeded initial author profile.');
    }

    // Check if social links exist in site_settings
    const socialRows = await sql`SELECT key FROM site_settings WHERE key = 'social_links'`;
    if (socialRows.length === 0) {
      const defaultSocials = [
        { platform: "Twitter / X", url: "https://twitter.com" },
        { platform: "LinkedIn", url: "https://linkedin.com" },
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "Email", url: "mailto:contact@joshuaadeoluwa.com" }
      ];
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES ('social_links', ${JSON.stringify(defaultSocials)}::jsonb);
      `;
      console.log('✓ Seeded editable social links.');
    }

    // Check if books table is empty, if so, seed initial books
    const bookCount = await sql`SELECT COUNT(*) FROM books`;
    if (parseInt(bookCount[0].count, 10) === 0) {
      console.log('Seeding initial books for Joshua Adeoluwa...');

      // Book 1: Flagship
      await sql`
        INSERT INTO books (
          title, tagline, genre, price, cover_url, description,
          takeaways, audience, sample_excerpt, pages, reading_time,
          buy_links, is_featured, display_order
        ) VALUES (
          'The Architecture of Purpose',
          'Mastering Life, Vision & Generational Legacy',
          'Faith & Sovereignty',
          '$19.99',
          '',
          'In a world that screams for your attention and rewards short-term noise, this book gives you the engineering principles to build a life of lasting consequence. Joshua Adeoluwa systematically uncovers how exceptional leaders discover their authentic mandate, structure their daily habits, and turn private discipline into generational influence.',
          ${JSON.stringify([
            "How to define your authentic life mandate and eliminate borrowed ambitions.",
            "The 4 Pillars of Generational Architecture: Vision, Alignment, Execution, and Legacy.",
            "How to handle seasons of silence and obscurity before your public emergence.",
            "A practical 30-day framework to audit your time, circle of influence, and energy."
          ])}::jsonb,
          ${JSON.stringify([
            "Aspiring & Seasoned Leaders",
            "Entrepreneurs Building Enduring Companies",
            "Believers Seeking Divine Clarity",
            "Creative Thinkers Refusing the Status Quo"
          ])}::jsonb,
          'Most men live in the shadows of borrowed desires. They measure their pace with clocks they never built and pursue milestones they never truly questioned. When you understand what you are commissioned to build, hurry disappears and conviction takes its rightful place.',
          '264 Pages',
          '~4.5 Hours',
          ${JSON.stringify([
            { platform: "Amazon Global", url: "https://amazon.com", note: "Paperback, Hardcover & Kindle" },
            { platform: "Selar / Paystack", url: "https://selar.co", note: "Card, Bank Transfer, Apple Pay" },
            { platform: "Direct Download", url: "https://gumroad.com", note: "Instant PDF & EPUB" }
          ])}::jsonb,
          true,
          1
        );
      `;

      // Book 2
      await sql`
        INSERT INTO books (
          title, tagline, genre, price, cover_url, description,
          takeaways, audience, sample_excerpt, pages, reading_time,
          buy_links, is_featured, display_order
        ) VALUES (
          'Unshakable Focus',
          'Winning the War for Your Attention',
          'Mindset & Habits',
          '$14.99',
          '',
          'Attention is the new currency of sovereignty. Whoever controls your focus controls your destiny. This tactical book breaks down modern psychological warfare, dopamine dependency, and how high-performers construct an impenetrable fortress around their deep work.',
          ${JSON.stringify([
            "The Neurological Cost of Multitasking: Why fragmented attention destroys genius.",
            "The 90-Minute Deep Work Sprint: Achieving in 1.5 hours what others do in 8.",
            "Digital Fasting: How to reset your brain dopamine baseline in 7 days.",
            "Saying No without guilt: Protecting your core creative and strategic hours."
          ])}::jsonb,
          ${JSON.stringify([
            "Knowledge Workers & Creators",
            "Students & Researchers",
            "Executives Juggling Demanding Schedules",
            "Anyone Battling Procrastination & Screen Fatigue"
          ])}::jsonb,
          'Attention is not merely a cognitive resource; it is the boundary you build around what you revere. If your phone has unlimited access to your consciousness, you are not sovereign—you are occupied territory.',
          '218 Pages',
          '~3.5 Hours',
          ${JSON.stringify([
            { platform: "Amazon Global", url: "https://amazon.com", note: "Paperback & Kindle" },
            { platform: "Selar / Paystack", url: "https://selar.co", note: "Card & Transfer" },
            { platform: "Direct E-Book", url: "https://gumroad.com", note: "PDF / EPUB" }
          ])}::jsonb,
          false,
          2
        );
      `;

      // Book 3
      await sql`
        INSERT INTO books (
          title, tagline, genre, price, cover_url, description,
          takeaways, audience, sample_excerpt, pages, reading_time,
          buy_links, is_featured, display_order
        ) VALUES (
          'The Leader''s Crucible',
          'How Enduring Leaders are Forged',
          'Leadership & Vision',
          '$21.50',
          '',
          'Anyone can lead when the waters are calm and applause is plentiful. But true leadership capacity is measured when unexpected crisis strikes, resources run dry, and betrayal tests your resolve. Joshua Adeoluwa shares battlefield-tested principles on moral courage, high-stakes decision-making, and organizational clarity.',
          ${JSON.stringify([
            "Navigating the 3 Leadership Crises: Identity, Resource, and Public Opposition.",
            "How to inspire unshakeable loyalty without manipulation or fear.",
            "The Art of Sovereign Decision-Making under incomplete information.",
            "Developing the next tier of leaders who carry your culture."
          ])}::jsonb,
          ${JSON.stringify([
            "CEOs, Founders & Directors",
            "Church & Ministry Overseers",
            "Community & Civic Organizers",
            "Emerging Young Leaders"
          ])}::jsonb,
          'A leader is not defined during the season of applause, but in the crucible of quiet obscurity and sudden pressure. Character cannot be improvised when the crisis arrives; it must already be forged in secret.',
          '288 Pages',
          '~5 Hours',
          ${JSON.stringify([
            { platform: "Amazon Global", url: "https://amazon.com", note: "Hardcover & Kindle" },
            { platform: "Selar / Paystack", url: "https://selar.co", note: "Instant Checkout" }
          ])}::jsonb,
          false,
          3
        );
      `;

      console.log('✓ Initial books seeded into Neon database.');
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initDatabase();
