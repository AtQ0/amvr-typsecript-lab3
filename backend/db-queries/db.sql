CREATE TABLE address (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	country VARCHAR(50) NOT NULL,
	city VARCHAR(50) NOT NULL,
	street VARCHAR(100) NOT NULL,
	street_number INT NOT NULL,
	postal_code INT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app_user (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	email_address VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) UNIQUE NOT NULL,
	date_of_birth DATE,
	address uuid,
	FOREIGN KEY(address) REFERENCES address(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	title VARCHAR(100) NOT NULL,
	content TEXT NOT NULL,
	app_user_id uuid,
	FOREIGN KEY(app_user_id) REFERENCES app_user(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	content TEXT NOT NULL,
	app_user_id uuid,
	post_id uuid,
	FOREIGN KEY(app_user_id) REFERENCES app_user(id) ON DELETE CASCADE,
	FOREIGN KEY(post_id) REFERENCES post(id) ON DELETE CASCADE,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

/* Create function to update modified_at timestamp */
CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* Add triggers to all tables */
CREATE TRIGGER address_modified_at_trigger
BEFORE UPDATE ON address
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER app_user_modified_at_trigger
BEFORE UPDATE ON app_user
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER post_modified_at_trigger
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();

CREATE TRIGGER comment_modified_at_trigger
BEFORE UPDATE ON comment
FOR EACH ROW
EXECUTE FUNCTION update_modified_at();



/* Remember to change the UUID's to what you have your database */
INSERT INTO address (country, city, street, street_number, postal_code)
VALUES ('Sweden', 'Gothenburg', 'Drottninggatan', 28, 41340);

INSERT INTO app_user (role, first_name, last_name, email_address, password, date_of_birth, address)
VALUES ('admin', 'George', 'Clooney', 'test@test.com', 'secret', '1968-04-21', '57d919ef-2073-4f0e-aa84-efca42f0a436');

INSERT INTO app_user (role, first_name, last_name, email_address, password, date_of_birth)
VALUES ('user', 'Martin', 'Berg', 'test2@test.com', 'secret2', '1995-04-21');

/* This query will only show the first names of users that has added an address */
SELECT first_name FROM app_user INNER JOIN address ON app_user.address = address.id;

INSERT INTO post (title, content, app_user_id)
VALUES ('About dogs', 'Dogs bark and have four legs. Dogs like food.', '3ea3b01f-1fad-4a31-8175-21df55db8f29');

INSERT INTO comment (content, app_user_id, post_id)
VALUES ('Good post about dogs! Very informative.', '6eb84bf6-b399-46b2-926b-e95b9ac03f48', 'cbbdb724-6afa-4702-8ac8-1e788bfc1b24');

INSERT INTO comment (content, app_user_id, post_id)
VALUES ('Dogs are cool.', '6eb84bf6-b399-46b2-926b-e95b9ac03f48', 'cbbdb724-6afa-4702-8ac8-1e788bfc1b24');


/* Example query to get all comments tied to a post */
SELECT comment.id, comment.content FROM comment INNER JOIN post ON post.id = comment.post_id;

/* Example query to get comments tied to a specific post */
SELECT comment.id, comment.content FROM comment WHERE comment.post_id = 'cbbdb724-6afa-4702-8ac8-1e788bfc1b24';

/* Remove a user */
DELETE FROM app_user WHERE app_user.id = '6eb84bf6-b399-46b2-926b-e95b9ac03f48';

/* Drop all tables */
DROP TABLE comment, post, app_user, address;
