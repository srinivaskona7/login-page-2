const Course = require('./models/Course');

const sampleCourses = [
  {
    title: "Complete JavaScript Mastery",
    description: "Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.",
    author: "John Smith",
    category: "Programming",
    level: "Intermediate",
    price: 89.99,
    originalPrice: 129.99,
    duration: { hours: 24, minutes: 30 },
    thumbnail: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["JavaScript", "ES6", "Programming", "Web Development"],
    rating: { average: 4.7, count: 1250 },
    enrollmentCount: 5420,
    isFeatured: true
  },
  {
    title: "React.js Complete Guide",
    description: "Build modern web applications with React.js, including hooks, context, and state management.",
    author: "Sarah Johnson",
    category: "Web Development",
    level: "Intermediate",
    price: 79.99,
    originalPrice: 119.99,
    duration: { hours: 18, minutes: 45 },
    thumbnail: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["React", "JavaScript", "Frontend", "Web Development"],
    rating: { average: 4.8, count: 980 },
    enrollmentCount: 3240,
    isFeatured: true
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming specifically for data analysis, machine learning, and data visualization.",
    author: "Dr. Michael Chen",
    category: "Data Science",
    level: "Beginner",
    price: 94.99,
    originalPrice: 149.99,
    duration: { hours: 32, minutes: 15 },
    thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Python", "Data Science", "Machine Learning", "Analytics"],
    rating: { average: 4.6, count: 2100 },
    enrollmentCount: 7890,
    isFeatured: true
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and user experience design with practical projects.",
    author: "Emma Wilson",
    category: "Design",
    level: "Beginner",
    price: 69.99,
    originalPrice: 99.99,
    duration: { hours: 16, minutes: 0 },
    thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["UI Design", "UX Design", "Figma", "Design Thinking"],
    rating: { average: 4.5, count: 750 },
    enrollmentCount: 2340,
    isFeatured: true
  },
  {
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js, Express, and MongoDB.",
    author: "David Rodriguez",
    category: "Programming",
    level: "Intermediate",
    price: 84.99,
    originalPrice: 124.99,
    duration: { hours: 22, minutes: 30 },
    thumbnail: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Node.js", "Express", "MongoDB", "Backend"],
    rating: { average: 4.7, count: 890 },
    enrollmentCount: 2890,
    isFeatured: true
  },
  {
    title: "Digital Marketing Strategy",
    description: "Comprehensive guide to digital marketing including SEO, social media, and content marketing.",
    author: "Lisa Thompson",
    category: "Marketing",
    level: "Beginner",
    price: 59.99,
    originalPrice: 89.99,
    duration: { hours: 14, minutes: 20 },
    thumbnail: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Digital Marketing", "SEO", "Social Media", "Content Marketing"],
    rating: { average: 4.4, count: 650 },
    enrollmentCount: 1890,
    isFeatured: true
  },
  {
    title: "iOS App Development with Swift",
    description: "Create native iOS applications using Swift and Xcode with hands-on projects.",
    author: "Alex Kim",
    category: "Mobile Development",
    level: "Intermediate",
    price: 99.99,
    originalPrice: 149.99,
    duration: { hours: 28, minutes: 45 },
    thumbnail: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["iOS", "Swift", "Mobile Development", "Xcode"],
    rating: { average: 4.6, count: 420 },
    enrollmentCount: 1240,
    isFeatured: false
  },
  {
    title: "Business Analytics with Excel",
    description: "Master advanced Excel techniques for business analysis and data visualization.",
    author: "Robert Davis",
    category: "Business",
    level: "Intermediate",
    price: 49.99,
    originalPrice: 79.99,
    duration: { hours: 12, minutes: 30 },
    thumbnail: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400",
    tags: ["Excel", "Business Analytics", "Data Analysis", "Spreadsheets"],
    rating: { average: 4.3, count: 890 },
    enrollmentCount: 3450,
    isFeatured: false
  }
];

const seedCourses = async () => {
  try {
    const existingCourses = await Course.countDocuments();
    
    if (existingCourses === 0) {
      await Course.insertMany(sampleCourses);
      console.log('Sample courses seeded successfully');
    } else {
      console.log('Courses already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding courses:', error);
  }
};

// Run seed function
seedCourses();

module.exports = seedCourses;