import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-12">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4 md:mb-0">
            SkillSwap
          </p>
          <div className="flex space-x-6 text-gray-600 dark:text-gray-400">
            <Link href="/about" className="hover:text-primary-600 transition-colors">About Us</Link>
            <Link href="/faq" className="hover:text-primary-600 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">Contact</Link>
          </div>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 border-t dark:border-gray-700 pt-6">
          <p>&copy; {new Date().getFullYear()} SkillSwap. A community for creators to collaborate and grow.</p>
        </div>
      </div>
    </footer>
  );
};