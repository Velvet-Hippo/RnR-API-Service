DROP TABLE IF EXISTS char_reviews;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS reviews;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR(500) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL DEFAULT false,
  reported BOOLEAN NOT NULL DEFAULT false,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  response VARCHAR(5000) NULL,
  helpfulness INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS char_reviews (
  id SERIAL PRIMARY KEY,
  char_id INT NOT NULL,
  reviews_id INT NOT NULL,
  value INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_characteristics
    FOREIGN KEY(char_id)
      REFERENCES characteristics(id),
  CONSTRAINT fk_reviews_id
    FOREIGN KEY(reviews_id)
      REFERENCES reviews(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  reviews_id INT NOT NULL,
  url VARCHAR(5000) NOT NULL,
  CONSTRAINT fk_photos_reviews_id
    FOREIGN KEY(reviews_id)
	    REFERENCES reviews(id)
);

-- GRANT SELECT, INSERT, UPDATE, DELETE
-- ON reviews, characteristics
-- TO db_controller;

-- ALTER TABLE  reviews
  -- ALTER COLUMN date TYPE TIMESTAMP USING to_timestamp(date / 1000) + ((date % 1000) || ' milliseconds') :: INTERVAL;

  -- create temp table urls as select reviews_id, array_agg(url) as urls from photos group by reviews_id;
-- update reviews set photos = urls from urls where reviews.id = urls.reviews_id

--   update photos
-- set url = url_list
-- from (
-- SELECT reviews_id, array_agg(url) as url_list
-- FROM photos
-- GROUP BY reviews_id
-- ) as a

-- CREATE INDEX ${index name} ON ${table name} (column1, column2, etc.)
-- My in code EX: CREATE INDEX productId_idx ON questions (productId);
-- My in code EX for multicolum: CREATE INDEX answersForQs_idx ON answers (questionId, reported);

-- CREATE TABLE char_agg (
--   id BIGSERIAL PRIMARY KEY,
--   name VARCHAR(7) NOT NULL,
--   value REAL NOT NULL,
--   product_id INT NOT NULL
-- );

-- CREATE TABLE char_agg as SELECT
-- char.name, char.id, AVG(rc.value) AS value, product_id
-- FROM characteristics AS char
-- INNER JOIN char_reviews AS rc
-- ON char.id = rc.char_id
-- GROUP BY char.id;

-- CREATE USER newuser WITH PASSWORD '12345';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO reviews_user;
-- GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO reviews_user;
-- SELECT table_catalog, table_schema, table_name, privilege_type
-- FROM   information_schema.table_privileges
-- WHERE  grantee = 'MY_USER'
-- ALTER SEQUENCE ${table}_${column}_seq RESTART WITH ${newStart}(edited)
-- CREATE INDEX ${index name} ON ${table name} (column1, column2, etc.)
-- My in code EX: CREATE INDEX productId_idx ON questions (productId);
-- My in code EX for multicolum: CREATE INDEX answersForQs_idx ON answers (questionId, reported);
-- Add photos column to answers table, Create temp table to store photo urls in an array per answer id - then reassign the photos column in answers to be these values:
-- ALTER TABLE answers ADD photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
-- CREATE TEMP TABLE urls AS SELECT answer_id, array_agg(url) as url_list FROM answers_photos GROUP BY answer_id;
-- UPDATE answers SET photos = url_list FROM urls WHERE answers.id = urls.answer_id;