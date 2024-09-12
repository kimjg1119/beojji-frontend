interface CourseProblem {
  id: number;
  courseId: number;
  problemId: number;
  dueDate: string; // "2024-06-30T23:59:59.000Z",
  createdAt: string; // "2024-09-10T06:30:04.104Z",
  updatedAt: string; // "2024-09-10T06:30:04.104Z",
  problem: Problem;
}
