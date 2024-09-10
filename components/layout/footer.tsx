import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (      <footer className="bg-card text-card-foreground mt-auto">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm">© 2024 KU-PLRG. All rights reserved.</p>
    </div>


  <div className="flex justify-center space-x-4 py-4 bg-card">
    <div className="flex items-center">
      <a
        href="https://github.com/kimjg1119/beojji-frontend"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 flex items-center"
        aria-label="Frontend GitHub"
      >
        <FaGithub size={24} />
        <span className="ml-2 text-sm">Frontend</span>
      </a>
    </div>
    <div className="flex items-center">
      <a
        href="https://github.com/kimjg1119/beojji-backend"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 flex items-center"
        aria-label="Backend GitHub"
      >
        <FaGithub size={24} />
        <span className="ml-2 text-sm">Backend</span>
      </a>
    </div>
  </div>
  </footer>);
}