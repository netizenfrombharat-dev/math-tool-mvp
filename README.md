# Math Tool MVP

A web-based mathematical computation tool powered by:
- **Bhindi AI** for natural language orchestration
- **Next.js** (React framework)
- **Supabase** for auth & data persistence
- **Client-side CAS**: Algebrite, Nerdamer, math.js
- **Pyodide** for Python/SymPy (lazy-loaded)

## Features

- Natural language math queries via AI chat
- Symbolic computation (derivatives, integrals, simplification)
- Client-side execution (no heavy server compute)
- User authentication & project save/load
- Extensible architecture for plotting & advanced math

## Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier)
- Bhindi AI API key

### Installation

1. **Clone/create project directory:**
   ```bash
   git clone https://github.com/netizenfrombharat-dev/math-tool-mvp.git
   cd math-tool-mvp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env.local` in the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   BHINDI_API_KEY=your-bhindi-api-key
   ```

4. **Set up Supabase:**
   - Create a `projects` table:
     ```sql
     CREATE TABLE projects (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID REFERENCES auth.users(id),
       name TEXT NOT NULL,
       data JSONB,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
   - Enable Google OAuth in Supabase Auth settings

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:** Navigate to `http://localhost:3000`

## Usage

1. **Sign in** with Google (top-right button)
2. **Quick Example**: Test the expression input with `sin(x)*exp(x)` to compute derivative using Algebrite
3. **AI Math Chat**: Ask natural language questions like "differentiate x^2 + 3x" or "solve x^2 - 4 = 0"
4. **Save/Load Projects**: Name your work and persist to Supabase

## Architecture Notes

### Client-Side Compute
- **Algebrite**: Symbolic math (derivatives, integrals, simplification)
- **Nerdamer**: Alternative CAS with equation solving
- **math.js**: Numerical computations
- **Pyodide**: Full Python/SymPy environment (lazy-loaded on demand)

### Bhindi Integration
- `/pages/api/bhindi-proxy.ts` proxies requests to Bhindi API
- Currently returns **mock responses** for immediate testing
- Replace mock with actual Bhindi API call (see TODO comments)
- Expected response format: `{ plan, code, explanation, engine }`

### Supabase
- Auth: Google OAuth (extensible to email/password)
- Database: `projects` table for saving user work
- RLS policies recommended for production

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```
Add environment variables in Vercel dashboard.

### Other Platforms
Standard Next.js deployment works on any Node.js host.

## Extending

- **Add more CAS libraries**: Install via npm, expose in eval scope
- **Plotting**: Integrate plotly.js or use Pyodide matplotlib
- **LaTeX rendering**: Add KaTeX or MathJax
- **Bhindi tools**: Implement actual API integration in `bhindi-proxy.ts`
- **Advanced UI**: Add Monaco editor for code, LaTeX preview, etc.

## License

MIT (or your preferred license)