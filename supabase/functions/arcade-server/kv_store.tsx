import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const TABLE_NAME = "kv_store";

// model jedneho riadku v KV tabulke
type KVRow = {
  key: string;
  value: unknown;
};

// Guard na env pre backend - nech padne hned a citatelne
const getRequiredEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const client = () =>
  createClient(
    getRequiredEnv("SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );

// Zakladne CRUD operacie nad KV store tabulkou
// Ulozi alebo prepise hodnotu pod klucom
export const set = async (key: string, value: unknown): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from(TABLE_NAME).upsert({ key, value });
  if (error) {
    throw new Error(error.message);
  }
};

// Nacita jednu hodnotu pod klucom
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

// Vymaze jeden kluc
export const del = async (key: string): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from(TABLE_NAME).delete().eq("key", key);
  if (error) {
    throw new Error(error.message);
  }
};

// Hromadne ulozenie viacerych klucov
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

// Hromadne nacitanie viacerych klucov
export const mget = async (keys: string[]): Promise<unknown[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("value")
    .in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
  return (data as Array<{ value: unknown }> | null)?.map((entry) => entry.value) ?? [];
};

// Hromadne zmazanie klucov
export const mdel = async (keys: string[]): Promise<void> => {
  const supabase = client();
  const { error } = await supabase.from(TABLE_NAME).delete().in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
};

// Vrati hodnoty vsetkych klucov s danym prefixom
export const getByPrefix = async (prefix: string): Promise<unknown[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("key, value")
    .like("key", `${prefix}%`);
  if (error) {
    throw new Error(error.message);
  }
  return (data as KVRow[] | null)?.map((entry) => entry.value) ?? [];
};

// Vrati cele zaznamy (key + value) pre dany prefix
export const getEntriesByPrefix = async (
  prefix: string,
): Promise<Array<{ key: string; value: unknown }>> => {
  const supabase = client();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("key, value")
    .like("key", `${prefix}%`);
  if (error) {
    throw new Error(error.message);
  }
  return (data as KVRow[] | null) ?? [];
};