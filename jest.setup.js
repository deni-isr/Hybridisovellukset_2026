const fs = require('fs');
const path = require('path');

// Clean up database file before running tests
beforeAll(() => {
  const dbFile = path.join(process.cwd(), 'example.sqlite');
  if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('Cleaned up database file before tests');
  }
});
