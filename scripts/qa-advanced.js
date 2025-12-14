const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting Advanced QA Check...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to desktop
  await page.setViewport({ width: 1280, height: 800 });

  const results = [];

  const logResult = (name, passed, details = '') => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}${details ? `: ${details}` : ''}`);
    results.push({ name, passed, details });
  };

  try {
    // --- 1. Landing Page Check ---
    console.log('\n--- Checking Landing Page ---');
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    
    const title = await page.title();
    logResult('Page Title', !!title, title);
    
    // Check for Main Heading
    const h1 = await page.$eval('h1', el => el.textContent).catch(() => null);
    logResult('Main Heading (H1)', !!h1, h1);
    
    // Check for Get Started button (should be a link or button)
    const getStartedBtn = await page.$('a[href="/auth/signup"], button');
    logResult('Get Started Button', !!getStartedBtn);

    // Check for Console Errors
    // (We'll check console messages if we hook into 'console' event, but skipping for simplicity unless we see issues)

    // --- 2. Auth Page UI Check ---
    console.log('\n--- Checking Login Page ---');
    await page.goto('http://localhost:3001/auth/login', { waitUntil: 'domcontentloaded' });
    
    // Check split screen layout elements
    const splitScreen = await page.$$('.grid-cols-2');
    logResult('Split Screen Layout', splitScreen.length > 0 || await page.$('.lg\\:grid-cols-2'));
    
    // Check for "Welcome back" or similar text
    const loginText = await page.content();
    logResult('Login Page Text', loginText.includes('Sign in') || loginText.includes('Welcome back'));

    // --- 3. Dashboard Access (Mock Auth) ---
    console.log('\n--- Checking Dashboard (Mock Auth) ---');
    await page.goto('http://localhost:3001/dashboard', { waitUntil: 'domcontentloaded' });
    
    const dashboardContent = await page.content();
    
    // Check for Sidebar
    const sidebar = await page.$('aside');
    logResult('Sidebar Present', !!sidebar);
    
    // Check for "Demo User" (Mock data)
    logResult('Mock User Loaded', dashboardContent.includes('Demo User'));

    // Check for Navigation Links
    const navLinks = await page.$$('nav a');
    logResult('Navigation Links', navLinks.length > 0, `${navLinks.length} links found`);

    // --- 4. Services Page & Components ---
    console.log('\n--- Checking Services Page ---');
    await page.goto('http://localhost:3001/dashboard/services', { waitUntil: 'domcontentloaded' });
    
    // Check for Select Component (Filter)
    const filterBtn = await page.$('button'); 
    // We look for text "Filters"
    const hasFilters = (await page.content()).includes('Filters');
    logResult('Filter Controls', hasFilters);

    // Check for Grid Layout
    const grid = await page.$('.grid');
    logResult('Grid Layout', !!grid);

  } catch (error) {
    console.error('QA Script Fatal Error:', error);
    logResult('Script Execution', false, error.message);
  } finally {
    await browser.close();
    console.log('\nQA Check Complete.');
  }
})();
