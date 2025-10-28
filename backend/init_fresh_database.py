"""
Initialize Fresh Database
Run this script to create a completely new empty database
"""

import os
from database import init_database, DATABASE_NAME

def init_fresh_database():
    print("🚀 Creating fresh database...")
    
    # Remove old database if exists
    if os.path.exists(DATABASE_NAME):
        os.remove(DATABASE_NAME)
        print(f"🗑️  Removed old database: {DATABASE_NAME}")
    
    # Create new database with tables
    init_database()
    
    print("✅ Fresh database created successfully!")
    print("📝 Database is now ready for use")
    print("💡 You can now start adding your own data")

if __name__ == "__main__":
    init_fresh_database()
