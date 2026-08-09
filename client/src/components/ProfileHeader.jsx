import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaYoutube, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  const socialIcons = {
    instagram: <FaInstagram />,
    facebook: <FaFacebook />,
    youtube: <FaYoutube />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedin />
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="h-64 md:h-96 relative overflow-hidden">
        <img
          src={profile.bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-32 md:-mt-40">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verified Badge */}
              <div className="absolute bottom-4 right-4 bg-pink-600 text-white rounded-full p-3 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>

            {/* Name and Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-1 text-center md:text-left bg-white rounded-2xl p-6 shadow-xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h1>
              <p className="text-2xl text-pink-600 font-semibold mb-3">
                {profile.brandName}
              </p>
              <p className="text-lg text-gray-600 mb-4">
                {profile.tagline}
              </p>

              {/* Statistics */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-yellow-500 text-xl mb-1">
                    {'⭐'.repeat(Math.floor(profile.statistics.averageRating))}
                    <span className="text-gray-900 font-bold ml-2">
                      {profile.statistics.averageRating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {profile.statistics.totalReviews.toLocaleString()} Reviews
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-pink-600">
                    {profile.statistics.totalClients.toLocaleString()}+
                  </p>
                  <p className="text-sm text-gray-600">Happy Clients</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {profile.statistics.yearsOfExperience}+
                  </p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {profile.statistics.certificationsCount}
                  </p>
                  <p className="text-sm text-gray-600">Certifications</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 text-sm text-gray-600">
                {profile.contactInfo.email && (
                  <a href={`mailto:${profile.contactInfo.email}`} className="flex items-center gap-2 hover:text-pink-600">
                    <FaEnvelope /> {profile.contactInfo.email}
                  </a>
                )}
                {profile.contactInfo.phone && (
                  <a href={`tel:${profile.contactInfo.phone}`} className="flex items-center gap-2 hover:text-pink-600">
                    <FaPhone /> {profile.contactInfo.phone}
                  </a>
                )}
                {profile.contactInfo.location && (
                  <span className="flex items-center gap-2">
                    <FaMapMarkerAlt /> {profile.contactInfo.location}
                  </span>
                )}
              </div>

              {/* Social Links */}
              {profile.socialLinks && (
                <div className="flex justify-center md:justify-start gap-4">
                  {Object.entries(profile.socialLinks).map(([platform, url]) => url && (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center text-xl hover:shadow-lg transition"
                    >
                      {socialIcons[platform]}
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
