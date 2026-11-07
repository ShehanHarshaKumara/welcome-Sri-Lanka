# Welcome Sri Lanka

## Supabase setup

1. Create a Supabase project, then open its **Connect** dialog.
2. Copy `.env.example` to `.env.local`.
3. Replace the example values with the project's URL and publishable key.
4. Import the shared client where needed:

```ts
import { supabase } from "./lib/supabase"
```

Use only a publishable (or legacy anon) key in this frontend. Never expose a
Supabase secret or service-role key. Protect browser-accessible tables with Row
Level Security policies.
