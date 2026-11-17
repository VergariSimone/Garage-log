export const INTERVENTION_TYPES = [
  "tagliando",
  "cambio_gomme",
  "revisione",
  "freni",
  "carrozzeria",
  "altro",
] as const;

export type InterventionType = (typeof INTERVENTION_TYPES)[number];
