-- Export all data from the main reference tables for migration

-- Export cities
SELECT * FROM cities;

-- Export universities
SELECT * FROM universities;

-- Export english_courses
SELECT * FROM english_courses;

-- Export schools
SELECT * FROM schools;

-- Tip: In psql or Supabase SQL editor, you can use \copy for CSV export:
-- \copy (SELECT * FROM cities) TO 'cities.csv' CSV HEADER;
-- \copy (SELECT * FROM universities) TO 'universities.csv' CSV HEADER;
-- \copy (SELECT * FROM english_courses) TO 'english_courses.csv' CSV HEADER;
-- \copy (SELECT * FROM schools) TO 'schools.csv' CSV HEADER;
