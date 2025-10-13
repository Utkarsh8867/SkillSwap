'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4"
  >
    <button
      onClick={onToggle}
      className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <h3 className="text-lg font-semibold">{question}</h3>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is SkillSwap?",
      answer: "SkillSwap is a platform where people can exchange skills without money. You can offer your expertise in one area and learn something new from others in return."
    },
    {
      question: "How does skill exchange work?",
      answer: "Simply create a post describing what skills you can offer and what you'd like to learn. Other users can contact you if they're interested in exchanging skills with you."
    },
    {
      question: "Is SkillSwap free to use?",
      answer: "Yes! SkillSwap is completely free. We believe knowledge should be accessible to everyone."
    },
    {
      question: "How do I get started?",
      answer: "Create an account, complete your profile, and start browsing posts or create your own skill exchange post."
    },
    {
      question: "What kinds of skills can I exchange?",
      answer: "Any skill! From programming and design to cooking and music. If you can teach it, you can exchange it."
    },
    {
      question: "How do I contact someone for a skill exchange?",
      answer: "Click the 'Contact for Exchange' button on any post that interests you, and send a message to the poster."
    }
  ];

  return (
    <div className="container-responsive section-padding">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find answers to common questions about SkillSwap and how to get the most out of our platform.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </div>
  );
}