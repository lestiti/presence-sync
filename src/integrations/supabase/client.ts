// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://utwzgxqrhmxozhtftajy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0d3pneHFyaG14b3podGZ0YWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzOTgyODcsImV4cCI6MjA0NTk3NDI4N30.PrWYGR86N9lChwWCLs5wqmoLGk0FselE-u4d4mb5K_k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);