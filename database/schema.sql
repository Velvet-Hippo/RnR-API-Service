DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS char_reviews;
DROP TABLE IF EXISTS photos;

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  value INT NOT NULL DEFAULT 0,
  char_id INT NOT NULL,
  reviews_id INT NOT NULL,
  CONSTRAINT fk_characteristics_id
    FOREIGN KEY(char_id)
      REFERENCES characteristics(id),
  CONSTRAINT fk_reviews_id
    FOREIGN KEY(reviews_id)
      REFERENCES reviews(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(5000) NOT NULL,
  reviews_id INT NOT NULL,
  CONSTRAINT fk_photo_reviews
    FOREIGN KEY(reviews_id)
	    REFERENCES reviews(id)
);