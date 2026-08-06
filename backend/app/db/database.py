from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create SQLAlchemy engine connected to Supabase PostgreSQL
# Note: For production with Supabase, you might want to use the connection pooler URL (port 6543)
engine = create_engine(
    settings.DATABASE_URL, 
    pool_pre_ping=True,  # Automatically check if connection is alive before using it
    pool_size=10,        # Number of connections to keep open
    max_overflow=20      # Max extra connections if pool is full
)

# SessionLocal class will be a database session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to yield database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
