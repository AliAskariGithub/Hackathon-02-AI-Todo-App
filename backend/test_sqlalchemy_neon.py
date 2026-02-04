"""
Test script to verify application can connect to Neon using SQLAlchemy
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from urllib.parse import urlparse, parse_qs, urlunparse
import urllib.parse

load_dotenv()

# Get the database URL from environment
original_url = os.getenv('DATABASE_URL')
print(f"Original URL: {original_url}")

# Process the database URL for sync operations (similar to sync_database.py)
if "postgresql" in original_url:
    # Replace postgresql+asyncpg:// with postgresql+psycopg2:// for sync operations
    sync_db_url = original_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
    # Handle case where it might be just postgresql://
    if sync_db_url == original_url:  # No replacement happened
        sync_db_url = original_url.replace("postgresql://", "postgresql+psycopg2://")

    print(f"After driver replacement: {sync_db_url}")

    # Parse the URL to handle query parameters properly
    parsed = urllib.parse.urlparse(sync_db_url)

    # Remove problematic query parameters for psycopg2
    query_params = urllib.parse.parse_qs(parsed.query)

    print(f"Original query params: {dict(query_params)}")

    # Keep only parameters that are compatible with psycopg2
    allowed_params = {}
    for key, value_list in query_params.items():
        # For psycopg2, keep sslmode but remove channel_binding which may cause issues
        if key not in ['channel_binding']:
            # Take first value from the list
            allowed_params[key] = value_list[0] if value_list else ''
            print(f"Including parameter: {key}={allowed_params[key]}")

    new_query = urllib.parse.urlencode(allowed_params)
    sync_db_url = urllib.parse.urlunparse((
        parsed.scheme,
        parsed.netloc,
        parsed.path,
        parsed.params,
        new_query,
        parsed.fragment
    ))

    print(f"Final processed URL: {sync_db_url}")

    try:
        print("Attempting to create engine...")
        sync_engine = create_engine(sync_db_url, pool_pre_ping=True)

        print("Attempting to connect...")
        with sync_engine.connect() as connection:
            print("✓ Successfully connected to Neon database via SQLAlchemy!")

            # Test with a simple query
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()
            print(f"Database version: {version[0][:50]}...")

            # Test if tables exist
            result = connection.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name IN ('user', 'task', 'testimonial');
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"Found tables: {tables}")

            # Test user count
            result = connection.execute(text("SELECT COUNT(*) FROM user;"))
            user_count = result.fetchone()[0]
            print(f"Current user count in Neon: {user_count}")

    except Exception as e:
        print(f"❌ SQLAlchemy connection failed: {e}")
        import traceback
        traceback.print_exc()

from sqlalchemy import text