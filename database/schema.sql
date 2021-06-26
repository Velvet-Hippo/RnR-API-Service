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