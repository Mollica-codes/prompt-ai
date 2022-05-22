import React from 'react';

const fs = require('fs')
const path = `./.env`
const vars = `
REACT_APP_OPENAI_SECRET=${process.env.REACT_APP_OPENAI_SECRET}
`
fs.writeFileSync(path, vars)