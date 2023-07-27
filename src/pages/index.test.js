// import 'jsdom-global/register';

const timeout = 5000;

describe('/ (Home Page)', () => {
  let page;
  beforeAll(async () => {
    page = await global.__BROWSER_GLOBAL__.newPage();
    await page.goto('https://www.bing.com');
  }, timeout);
  afterAll(async () => {
    await page.close();
  });
  it('should load without error', async () => {
    let text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('必应');
  });
});

test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});
