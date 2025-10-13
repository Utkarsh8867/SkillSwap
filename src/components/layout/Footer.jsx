import Link from 'next/link';
import { FaHeart, FaUsers, FaExchangeAlt } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SkillSwap
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Where skills meet opportunity
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm">
                About Us
              </Link>
              <Link href="/faq" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm">
                FAQ
              </Link>
              <Link href="/contact" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Community Stats */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center md:justify-end">
                <FaUsers className="mr-2" />
                <span>Growing Community</span>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <FaExchangeAlt className="mr-2" />
                <span>Skill Exchanges</span>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <FaHeart className="mr-2" />
                <span>Made with Love</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-700 pt-6">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} SkillSwap. A community for creators to collaborate and grow.
          </p>
        </div>
      </div>
    </footer>
  );
};