export type ArrayValues<T extends Array> = T[number];

export type DeepArrayValues<T extends Array> = T[number] extends Array ? DeepArrayValues<T[number]> : T[number];

export type ObjectKeys<T extends Record<string, unknown>> = keyof T;
export type ObjectValues<T extends Record<string, unknown>> = T[keyof T];

export type DeepObjectKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? FlattenObject<T[K]> : T[K];
    }[keyof T]
  : never;

export type DeepObjectValues<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? DeepObjectValues<T[K]> : T[K];
    }
  : never;
