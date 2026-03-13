declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(...args: any[]): any;
};

declare module "npm:hono" {
  export type Context = any;
  export class Hono {
    use(...args: any[]): any;
    onError(...args: any[]): any;
    options(...args: any[]): any;
    notFound(...args: any[]): any;
    get(...args: any[]): any;
    post(...args: any[]): any;
    put(...args: any[]): any;
    delete(...args: any[]): any;
    fetch(...args: any[]): Promise<Response>;
  }
}

declare module "npm:hono/cors" {
  export const cors: (...args: any[]) => any;
}

declare module "npm:hono/logger" {
  export const logger: (...args: any[]) => any;
}

declare module "npm:@supabase/supabase-js@2" {
  export const createClient: (...args: any[]) => any;
  export type SupabaseClient = any;
}

declare module "jsr:@supabase/supabase-js@2.49.8" {
  export const createClient: (...args: any[]) => any;
}
