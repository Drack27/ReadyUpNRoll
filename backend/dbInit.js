const db = require('./dbConfig');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(async () => { // Use async/await inside serialize
      try {
        console.log("Initializing Database Schema...");

        // Use Promise.all to run migrations in parallel if you want
        await Promise.all([
          new Promise((resolveTable, rejectTable) => {
            db.run(`
              CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                profileImage TEXT 
              )
            `, (err) => err ? rejectTable(err) : resolveTable());
          }),
          new Promise((resolveTable, rejectTable) => {
            const createWorldsTableSql = `CREATE TABLE IF NOT EXISTS worlds (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              gm_id INTEGER NOT NULL, 
              name TEXT NOT NULL,
              tagline TEXT,
              description TEXT,
              visibility TEXT CHECK (visibility IN ('public', 'private')), 
              thumbnailImages TEXT, 
              disclaimers TEXT,
              players_needed INTEGER,
              require_all_players_for_session_zero INTEGER,
              game_system TEXT,
              game_system_description TEXT,
              modules TEXT,
              FOREIGN KEY (gm_id) REFERENCES users(id));`;

            db.run(createWorldsTableSql, (err) => err ? rejectTable(err) : resolveTable());
          }),
          // ... other table creation promises here
        ]);

        console.log('Database schema initialized');
        resolve(); // Resolve the main promise after all tables are created
      } catch (err) {
        console.error("Database initialization failed:", err);
        reject(err); // Reject the main promise if any table creation fails
      }
    });
  });
}

module.exports = initializeDatabase;