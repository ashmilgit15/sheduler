"""
Initialize Production Database
Run this ONCE after deploying to create all database tables
"""

from database_postgres import init_database, SessionLocal, Student

def check_database():
    """Check if database is accessible and tables exist"""
    try:
        db = SessionLocal()
        # Try a simple query
        count = db.query(Student).count()
        print(f"✅ Database is accessible!")
        print(f"📊 Current student count: {count}")
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def main():
    print("🚀 Initializing production database...")
    print("=" * 60)
    
    # Create all tables
    try:
        init_database()
        print("\n✅ Database tables created successfully!")
    except Exception as e:
        print(f"\n❌ Error creating tables: {e}")
        return
    
    # Verify database is working
    print("\n🔍 Verifying database connection...")
    if check_database():
        print("\n🎉 Production database is ready!")
        print("\nNext steps:")
        print("1. Go to your frontend application")
        print("2. Upload students and exams")
        print("3. Start generating schedules")
    else:
        print("\n⚠️  Database verification failed")
        print("Please check your DATABASE_URL environment variable")

if __name__ == "__main__":
    main()
