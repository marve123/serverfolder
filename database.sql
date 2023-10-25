CREATE DATABASE morrnaira;


-- CREATE TABLE users (
--     user_index SERIAL,
--     user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     profile_image VARCHAR(600) DEFAULT 'https://res.cloudinary.com/dvcma7mex/image/upload/v1697194883/WhatsApp_Image_2023-10-13_at_12.49.09_AM_to1uao.jpg',
--     first_name VARCHAR(255) NOT NULL,
--     last_name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     user_name VARCHAR(255) UNIQUE NOT NULL,
--     tel VARCHAR(11) NOT NULL,
--     user_password VARCHAR(255) NOT NULL,
--     account_num VARCHAR(11) DEFAULT '00000000000',
--     account_name VARCHAR(255) DEFAULT 'acc_name',
--     bank_name VARCHAR(255) DEFAULT 'bank_name',
--     activity_points INTEGER DEFAULT 3500,
--     referral_earnings INTEGER DEFAULT 0,
--     total_earnings INTEGER DEFAULT 0,
--     total_withdrawn INTEGER DEFAULT 0,
--     referral_code VARCHAR(255), 
--     referrer_id VARCHAR(255),
--     subacc_code VARCHAR(255),
--     rank VARCHAR(255) DEFAULT 'Bronze',
--     referrals INT,
--     is_admin BOOLEAN DEFAULT false,
--     created_at DATE DEFAULT current_date
-- );


CREATE TABLE users (
    user_index INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) DEFAULT '',
    profile_image VARCHAR(600) DEFAULT 'https://res.cloudinary.com/dvcma7mex/image/upload/v1697194883/WhatsApp_Image_2023-10-13_at_12.49.09_AM_to1uao.jpg',
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    tel VARCHAR(11) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    account_num VARCHAR(11) DEFAULT '00000000000',
    account_name VARCHAR(255) DEFAULT 'acc_name',
    bank_name VARCHAR(255) DEFAULT 'bank_name',
    activity_points INT DEFAULT 3500,
    referral_earnings INT DEFAULT 0,
    total_earnings INT DEFAULT 0,
    total_withdrawn INT DEFAULT 0,
    referral_code VARCHAR(255), 
    referrer_id VARCHAR(255),
    subacc_code VARCHAR(255),
    `rank` VARCHAR(255) DEFAULT 'Bronze',
    referrals INT,
    is_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE users ADD last_task_execution timestamp;
-- Assuming you're using PostgreSQL


 


CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) REFERENCES users(user_name),
    referrer VARCHAR(255),
    generation INT
);

CREATE TABLE sponsored_posts (
    post_id serial PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    written_by VARCHAR(255) NOT NULL,
    post_image VARCHAR(600) DEFAULT 'https://res.cloudinary.com/dvcma7mex/image/upload/v1696805589/wrkrqsiphftnzgsvrodj.png'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE comments (
  comment_id SERIAL PRIMARY KEY,
  post_id INT REFERENCES sponsored_posts(post_id),
  author VARCHAR(255) NOT NULL,
  author_pic VARCHAR(600),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);



-- Create an AFTER INSERT trigger to set the users referral_code to the users user_id
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code := NEW.user_name; 
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_referral_code
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION set_referral_code();


WITH RECURSIVE ReferralHierarchy AS (

    SELECT user_name, referrer, generation
    FROM referrals
    WHERE user_name = 'hhhhh'
    UNION ALL

    SELECT r.user_name, r.referrer, rh.generation + 1
    FROM referrals r
    INNER JOIN ReferralHierarchy rh ON r.referrer = rh.user_name
    WHERE rh.generation < 3 
)
SELECT user_name, referrer, generation
FROM ReferralHierarchy;
