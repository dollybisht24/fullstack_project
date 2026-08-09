import React from 'react';
import { motion } from 'framer-motion';

export default function SkillsShowcase({ skills, achievements }) {
  if (!skills && !achievements) return null;

  const levelColors = {
    master: 'from-pink-600 to-rose-600',
    expert: 'from-purple-600 to-indigo-600',
    intermediate: 'from-blue-600 to-cyan-600',
    beginner: 'from-green-600 to-teal-600'
  };

  const levelBadgeColors = {
    master: 'bg-gradient-to-r from-pink-500 to-rose-500',
    expert: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    intermediate: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    beginner: 'bg-gradient-to-r from-green-500 to-teal-500'
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Expertise & Skills
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Professional skills honed over years of dedication and practice
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition border-2 border-pink-100"
                >
                  {/* Icon */}
                  <div className="text-5xl mb-4 text-center">
                    {skill.icon}
                  </div>
                  
                  {/* Skill Name */}
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    {skill.name}
                  </h3>
                  
                  {/* Category */}
                  {skill.category && (
                    <p className="text-sm text-gray-600 text-center mb-3">
                      {skill.category}
                    </p>
                  )}
                  
                  {/* Level Badge */}
                  <div className="text-center">
                    <span className={`inline-block ${levelBadgeColors[skill.level]} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
                      {skill.level}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: skill.level === 'master' ? '100%' : skill.level === 'expert' ? '90%' : skill.level === 'intermediate' ? '70%' : '50%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                      className={`h-full bg-gradient-to-r ${levelColors[skill.level]}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Awards & Achievements
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Recognition and milestones that mark my journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => {
                const typeColors = {
                  certificate: 'from-blue-500 to-indigo-500',
                  award: 'from-yellow-500 to-orange-500',
                  achievement: 'from-green-500 to-teal-500',
                  milestone: 'from-pink-500 to-rose-500'
                };

                const typeIcons = {
                  certificate: '🎓',
                  award: '🏆',
                  achievement: '⭐',
                  milestone: '🎯'
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100 hover:border-pink-300 transition"
                  >
                    {/* Image */}
                    {achievement.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-full h-full object-cover hover:scale-110 transition duration-500"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Type Badge & Year */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`bg-gradient-to-r ${typeColors[achievement.type]} text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}>
                          {typeIcons[achievement.type]} {achievement.type}
                        </span>
                        <span className="text-2xl font-bold text-gray-400">
                          {achievement.year}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {achievement.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {achievement.description}
                      </p>
                      
                      {/* Organization */}
                      {achievement.organization && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5.5 9.923L7 14.146V17a1 1 0 001 1h4a1 1 0 001-1v-2.854l2.5-2.223a1 1 0 00.364-.843 1 1 0 00-.364-.843l-2.5-2.224V6a1 1 0 00-1-1H7a1 1 0 00-1 1v3.013L3.5 11.237a1 1 0 000 1.686z" clipRule="evenodd" />
                          </svg>
                          {achievement.organization}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
