const express = require('express');
const Joi = require('joi');
const Course = require('../models/Course');

const router = express.Router();

// Validation schemas
const courseQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  category: Joi.string().valid('Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Mobile Development', 'Web Development', 'Other'),
  level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
  featured: Joi.boolean(),
  search: Joi.string().max(100),
  sortBy: Joi.string().valid('newest', 'oldest', 'rating', 'price-low', 'price-high', 'popular').default('newest'),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0)
});

// Get all courses with filtering and pagination
router.get('/', async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = courseQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      page,
      limit,
      category,
      level,
      featured,
      search,
      sortBy,
      minPrice,
      maxPrice
    } = value;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (featured !== undefined) filter.isFeatured = featured;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { publishedAt: -1 };
        break;
      case 'oldest':
        sort = { publishedAt: 1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'popular':
        sort = { enrollmentCount: -1 };
        break;
      default:
        sort = { publishedAt: -1 };
    }

    const skip = (page - 1) * limit;

    // Execute query
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter)
    ]);

    // Get categories and levels for filters
    const [categories, levels] = await Promise.all([
      Course.distinct('category', { isActive: true }),
      Course.distinct('level', { isActive: true })
    ]);

    res.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      filters: {
        categories,
        levels
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// Get featured courses
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const courses = await Course.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .sort({ 'rating.average': -1, enrollmentCount: -1 })
    .limit(limit)
    .lean();

    res.json({ courses });

  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ error: 'Failed to get featured courses' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findOne({ 
      _id: id, 
      isActive: true 
    }).lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Get related courses
    const relatedCourses = await Course.find({
      _id: { $ne: id },
      category: course.category,
      isActive: true
    })
    .sort({ 'rating.average': -1 })
    .limit(4)
    .lean();

    res.json({ 
      course,
      relatedCourses
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
});

// Get course statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalCourses,
      totalEnrollments,
      averageRating,
      categoriesStats
    ] = await Promise.all([
      Course.countDocuments({ isActive: true }),
      Course.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$enrollmentCount' } } }
      ]),
      Course.aggregate([
        { $match: { isActive: true, 'rating.count': { $gt: 0 } } },
        { $group: { _id: null, avgRating: { $avg: '$rating.average' } } }
      ]),
      Course.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      averageRating: averageRating[0]?.avgRating || 0,
      categoriesStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

module.exports = router;