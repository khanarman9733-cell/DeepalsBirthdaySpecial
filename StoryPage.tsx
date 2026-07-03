import React from 'react';
import { motion } from 'motion/react';

interface StoryPageProps {
  imageSrc: string;
  title: string;
  content: string;
}

const StoryPage: React.FC<StoryPageProps> = ({ imageSrc, title, content }) => {
  if (!imageSrc) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-white/5 rounded-2xl border border-white/10"
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full max-w-sm rounded-lg shadow-2xl mb-6 border border-white/20"
      />
      <h2 className="text-2xl font-serif text-white mb-4">{title}</h2>
      <p className="font-sans text-white/70 leading-relaxed text-center max-w-lg">
        {content}
      </p>
    </motion.div>
  );
};

export default StoryPage;
