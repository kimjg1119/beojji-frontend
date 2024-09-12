interface Course {
  id: number; // 1,
  courseId: string; // COSE212;
  name: string; //"Programming Languages";
  term: string; // "Fall 2024",
  description: string; //"Learn the basics of programming languages",
  link: string; // "https://plrg.korea.ac.kr/courses/cose212/2024_2/",
  createdAt: string; //"2024-09-10T06:30:04.100Z",
  updatedAt: string; // "2024-09-10T06:30:04.100Z",
  courseProblem: CourseProblem[];
}
