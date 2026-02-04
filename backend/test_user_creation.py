"""
Script to test database connection and create a new user
"""
import asyncio
from sqlmodel import Session, select
from src.models import User
from src.config import settings
from src.utils.sync_database import sync_engine
from werkzeug.security import generate_password_hash
import uuid


def test_db_connection_and_create_user():
    print("Testing database connection and creating a new user...")

    # Process the database URL for sync operations (similar to sync_database.py)
    original_url = settings.database_url
    if "postgresql" in original_url:
        # Replace postgresql+asyncpg:// with postgresql+psycopg2:// for sync operations
        sync_db_url = original_url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
        # Handle case where it might be just postgresql://
        if sync_db_url == original_url:  # No replacement happened
            sync_db_url = original_url.replace("postgresql://", "postgresql+psycopg2://")

        # Parse the URL to handle query parameters properly
        import urllib.parse
        parsed = urllib.parse.urlparse(sync_db_url)

        # Remove problematic query parameters for psycopg2
        query_params = urllib.parse.parse_qs(parsed.query)

        # Keep only parameters that are compatible with psycopg2
        allowed_params = {}
        for key, value_list in query_params.items():
            # For psycopg2, keep sslmode but remove channel_binding which may cause issues
            if key != 'channel_binding':
                allowed_params[key] = value_list

        new_query = urllib.parse.urlencode(allowed_params, doseq=True)
        sync_db_url = urllib.parse.urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            new_query,
            parsed.fragment
        ))

        print(f"Processed sync DB URL: {sync_db_url[:50]}...")  # Show first 50 chars

        from sqlalchemy import create_engine
        sync_engine = create_engine(sync_db_url, pool_pre_ping=True)
    elif "sqlite" in original_url:
        sync_engine = create_engine(original_url, connect_args={"check_same_thread": False})
    else:
        sync_engine = create_engine(original_url)

    try:
        # Test the connection
        with sync_engine.connect() as connection:
            print("✓ Successfully connected to the database!")

            # Create a new user
            with Session(sync_engine) as session:
                # Check if user already exists
                existing_user = session.exec(select(User).where(User.email == "test@example.com")).first()

                if existing_user:
                    print(f"⚠ User with email test@example.com already exists (ID: {existing_user.id})")
                    return existing_user

                # Create a new user
                hashed_password = generate_password_hash("password123")
                new_user = User(
                    id=str(uuid.uuid4()),
                    email="test@example.com",
                    username="testuser",
                    password_hash=hashed_password,
                    is_active=True
                )

                session.add(new_user)
                session.commit()
                session.refresh(new_user)

                print(f"✓ Successfully created new user: {new_user.username} (ID: {new_user.id})")
                return new_user

    except Exception as e:
        print(f"✗ Error connecting to database: {str(e)}")
        print("\nThis might be due to an invalid or expired Neon database connection.")
        print("Please check your DATABASE_URL in backend/.env file.")
        return None


if __name__ == "__main__":
    user = test_db_connection_and_create_user()
    if user:
        print(f"\nUser created successfully! ID: {user.id}")
    else:
        print("\nFailed to create user due to database connection error.")