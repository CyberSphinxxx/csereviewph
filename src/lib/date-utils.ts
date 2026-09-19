export interface ExamCountdownInfo {
  days: number;
  formattedDate: string;
  isPast: boolean;
  label: string;
}

export function getExamCountdown(targetDateStr: string = "2027-03-14"): ExamCountdownInfo {
  const target = new Date(`${targetDateStr}T00:00:00`);
  const now = new Date();
  
  // Strip time for accurate day count
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = targetMidnight.getTime() - nowMidnight.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const isPast = diffDays < 0;

  const formattedDate = target.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    days: Math.max(0, diffDays),
    formattedDate,
    isPast,
    label: isPast ? "Exam date passed, check new schedule" : `${diffDays} days until the exam`,
  };
}
