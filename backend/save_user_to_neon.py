"""
Test script to directly save user data to Neon database
"""
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
import psycopg2
from urllib.parse import urlparse
from werkzeug.security import generate_password_hash

load_dotenv()

# Get the database URL from environment
db_url = os.getenv('DATABASE_URL')

if 'neon.tech' in db_url:
    # Parse the URL manually to extract components
    parsed = urlparse(db_url)

    # Connect directly without using SQLAlchemy
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path.lstrip('/'),
        user=parsed.username,
        password=parsed.password,
        sslmode='require'  # This is needed for Neon
    )

    cursor = conn.cursor()

    # Create a test user directly in Neon database
    user_id = str(uuid.uuid4())
    email = "neontest@example.com"
    user_name = "neontest"
    password_hash = generate_password_hash("securepassword123")
    created_at = datetime.utcnow()
    updated_at = datetime.utcnow()

    try:
        # Insert user into Neon database
        cursor.execute("""
            INSERT INTO user (id, email, user_name, password_hash, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (user_id, email, user_name, password_hash, created_at, updated_at))

        result = cursor.fetchone()
        print(f"✅ Successfully inserted user into Neon database!")
        print(f"User ID: {result[0]}")
        print(f"Email: {email}")
        print(f"Username: {user_name}")

        # Verify the user was inserted by counting total users
        cursor.execute("SELECT COUNT(*) FROM user;")
        user_count_after = cursor.fetchone()[0]
        print(f"Total user count in Neon database: {user_count_after}")

        # Fetch and display the newly created user
        cursor.execute("SELECT id, email, user_name, created_at FROM user WHERE email = %s;", (email,))
        user_record = cursor.fetchone()
        print(f"Fetched user from Neon: {user_record}")

        conn.commit()
        print("✅ Transaction committed successfully!")

    except Exception as e:
        print(f"❌ Error inserting user: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
else:
    print("Not a Neon database URL")