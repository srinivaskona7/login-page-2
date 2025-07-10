import React from 'react';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  const {
    title,
    description,
    author,
    category,
    level,
    price,
    originalPrice,
    thumbnail,
    rating,
    enrollmentCount,
    formattedDuration,
    discountPercentage
  } = course;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
          {category}
        </div>
        
        {/* Level indicator */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            level === 'Beginner' ? 'bg-green-100 text-green-800' :
            level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {level}
          </span>
        </div>
      </div>
      
      <div className="card-body">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <BookOpen className="w-4 h-4 mr-1" />
          <span className="mr-4">by {author}</span>
        </div>
        
        {/* Course stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-medium text-gray-700">
              {rating?.average?.toFixed(1) || '0.0'}
            </span>
            <span className="ml-1">({formatNumber(rating?.count || 0)})</span>
          </div>
          
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{formatNumber(enrollmentCount)} students</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formattedDuration || '0h'}</span>
          </div>
        </div>
        
        {/* Price section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          
          <button className="btn btn-primary text-sm px-4 py-2 hover:shadow-md transition-all">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;