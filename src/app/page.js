'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FaUsers, FaExchangeAlt, FaLightbulb } from 'react-icons/fa';
import { PostCard } from '@/components/posts/PostCard';
import { usePosts } from '@/context/PostsContext';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
  >
    <div className="flex justify-center items-center mb-4 text-primary-500">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  const { posts, loading } = usePosts();
  const examplePosts = Array.isArray(posts) ? posts.slice(0, 3) : [];

  return (
    <div className="container-responsive">
      {/* Hero Section */}
      <div className="text-center section-padding">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight
                     bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                     bg-clip-text text-transparent mb-6"
        >
          Share Your Spark.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Ignite Your Project.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 px-4"
        >
          Welcome to a creative ecosystem where your passion is the ultimate currency.
          Trade your expertise and bring your vision to life—together.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register">
            <Button size="lg" className="btn-primary w-full sm:w-auto">
              Get Started for Free
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Posts
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="section-padding">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={<FaLightbulb size={32} />}
            title="Post a Skill"
            description="Share what you're an expert in, or post a skill you need help with."
            delay={0.2}
          />
          <FeatureCard
            icon={<FaExchangeAlt size={32} />}
            title="Find a Match"
            description="Browse posts from our talented community and find the perfect partner for your project."
            delay={0.4}
          />
          <FeatureCard
            icon={<FaUsers size={32} />}
            title="Collaborate & Grow"
            description="Connect with your match, collaborate on projects, and grow your skills together."
            delay={0.6}
          />
        </div>
      </div>

      {/* Example Posts Section */}
      <div className="section-padding">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Latest Skill Swaps</h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : examplePosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {examplePosts.map((post, index) => (
              <motion.div
                key={post.postId || post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="w-full"
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">No posts available yet.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="btn-primary w-full sm:w-auto">Be the first to post!</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto">Login to Explore</Button>
              </Link>
            </div>
          </div>
        )}
        <div className="text-center mt-8 sm:mt-12">
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore More Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}