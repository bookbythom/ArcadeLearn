import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const TABLE_NAME = "kv_store_15e718fc";

const client = () =>
  createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  );

export const set = async (key: string, value: unknown): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from(TABLE_NAME).upsert({ key, value });
  if (error) {
    throw new Error(error.message);
  }
};

export const get = async (key: string): Promise<unknown> => {
  const supabase = client();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data?.value;
};

export const del = async (key: string): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from(TABLE_NAME).delete().eq("key", key);
  if (error) {
    throw new Error(error.message);
  }
};

export const mset = async (
  keys: string[],
  values: unknown[],
): Promise<void> => {
  const supabase = client();
  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(keys.map((key, index) => ({ key, value: values[index] })));
  if (error) {
    throw new Error(error.message);
  }
};

export const mget = async (keys: string[]): Promise<unknown[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("value")
    .in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((entry) => entry.value) ?? [];
};

export const mdel = async (keys: string[]): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from(TABLE_NAME).delete().in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
};

export const getByPrefix = async (prefix: string): Promise<unknown[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("key, value")
    .like("key", `${prefix}%`);
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((entry) => entry.value) ?? [];
};