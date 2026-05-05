# Kinetic Fitness Web Application

Kinetic is a comprehensive, production-ready vanilla web application tailored for a high-performance gym. It features an interactive UI, an AI-powered chatbot, lead capture with Supabase integration, and native booking functionality via Calendly.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Build Tool**: Vite (for environment variable support and optimized bundling).
- **Database Backend**: Supabase (PostgreSQL) via REST API.
- **AI Integration**: OpenRouter API (`meta-llama/llama-3-8b-instruct`).
- **Scheduling**: Calendly Inline Widget Embed.

---

## 1. Local Setup & Environment Variables

### Prerequisites
- Node.js (v18+)

### Installation
1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your API keys inside `.env`:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 2. Database Schema (Supabase)

To enable the Lead Capture functionality on the `contact.html` page, you must create a table in your Supabase project.

1. Go to your Supabase Dashboard -> **SQL Editor**.
2. Run the following SQL command to create the `leads` table:

```sql
CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    fitness_goal text NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so your website can submit forms without requiring user login)
CREATE POLICY "Allow public inserts" ON public.leads
    FOR INSERT WITH CHECK (true);
```

---

## 3. Booking API Setup (Calendly)

The `schedule.html` page includes an embedded Calendly widget.

**To link your own Calendly:**
1. Open `schedule.html`.
2. Locate the Calendly div around line `70`:
   ```html
   <div class="calendly-inline-widget" data-url="https://calendly.com/your-calendly-link/30min" style="min-width:320px;height:700px;"></div>
   ```
3. Replace `https://calendly.com/your-calendly-link/30min` with your actual Calendly event link.

---

## 4. Deployment Instructions

This project is configured to deploy seamlessly to platforms like **Vercel** or **Netlify**.

### Deploying to Vercel
1. Push your code to a GitHub repository.
2. Log in to Vercel and click **Add New Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect the **Vite** framework.
5. In the **Environment Variables** section, add your three keys:
   - `VITE_OPENROUTER_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Vercel will run `npm run build` and publish your site.

### Deploying to Netlify
1. Connect your GitHub repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add your Environment Variables in the **Site settings > Environment variables** menu.
5. Click **Deploy Site**.
