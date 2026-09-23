/**
 * Weekly plan template definitions.
 *
 * Kept as data so the Study plan page and Settings render the same picker
 * from one source, and so adding a template later means touching this list
 * plus the generator branch only.
 */

export const PLAN_TEMPLATE_IDS = ["smart", "balanced", "weak-focus", "cram"] as const;

export type PlanTemplateId = (typeof PLAN_TEMPLATE_IDS)[number];

export interface PlanTemplateDef {
  id: PlanTemplateId;
  name: string;
  description: string;
}

export const PLAN_TEMPLATES: PlanTemplateDef[] = [
  {
    id: "smart",
    name: "Smart",
    description: "Weakest subjects first, based on your real accuracy.",
  },
  {
    id: "balanced",
    name: "Balanced rotation",
    description: "Every subject gets its own day; review day closes the week.",
  },
  {
    id: "weak-focus",
    name: "Weak-subject focus",
    description: "Most of the week on your single lowest subject, one mixed review day.",
  },
  {
    id: "cram",
    name: "Cram mode",
    description: "Mostly timed assessments, for when exam day is close.",
  },
];

export function getPlanTemplate(id: string): PlanTemplateDef {
  return PLAN_TEMPLATES.find((t) => t.id === id) ?? PLAN_TEMPLATES[0];
}

export function isPlanTemplateId(value: unknown): value is PlanTemplateId {
  return typeof value === "string" && (PLAN_TEMPLATE_IDS as readonly string[]).includes(value);
}
