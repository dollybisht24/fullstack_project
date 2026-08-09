import React from 'react';
import { motion } from 'framer-motion';

export default function JourneyTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  const typeIcons = {
    milestone: '🎯',
    certification: '🎓',
    award: '🏆',
    event: '🎭',
    collaboration: '🤝'
  };

  const typeColors = {
    milestone: 'from-pink-500 to-rose-500',
    certification: 'from-blue-500 to-indigo-500',
    award: 'from-yellow-500 to-orange-500',
    event: 'from-purple-500 to-pink-500',
    collaboration: 'from-green-500 to-teal-500'
  };

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            My Journey
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A timeline of milestones, achievements, and growth in the beauty industry
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300" />

          {/* Timeline Events */}
          <div className="space-y-12">
            {timeline.map((event, index) => {
              const isEven = index % 2 === 0;
              const Icon = typeIcons[event.type] || '✨';
              const colorClass = typeColors[event.type] || 'from-pink-500 to-purple-500';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-100"
                    >
                      {/* Year Badge */}
                      <div className={`inline-block bg-gradient-to-r ${colorClass} text-white px-6 py-2 rounded-full font-bold text-lg mb-4`}>
                        {event.year}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {Icon} {event.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                      
                      {event.image && (
                        <div className="mt-4 rounded-xl overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Center Node */}
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${colorClass} shadow-lg flex items-center justify-center text-3xl z-10`}
                    >
                      {Icon}
                    </motion.div>
                  </div>

                  {/* Spacer for alignment */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-white rounded-2xl shadow-xl p-8">
            <p className="text-2xl font-semibold text-gray-900 mb-4">
              Want to be part of this journey? ✨
            </p>
            <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition transform hover:scale-105">
              Book a Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
