const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
const { TIME_OUT } = require('./const')

const scrapeAliExpress = async (productId) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  // Ngụy trang Puppeteer
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })

  // Chặn tải các tài nguyên không cần thiết
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const blockedResources = ['image', 'stylesheet', 'font', 'media']
    if (blockedResources.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })

  // Set User-Agent để giả lập trình duyệt thật
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  )

  const productUrl = `https://www.aliexpress.com/item/${productId}.html`

  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' })

    // Chờ các phần tử cần thiết xuất hiện
    await page.waitForSelector('.title--wrap--UUHae_g', { timeout: TIME_OUT })
    await page.waitForSelector('.product-price-value', { timeout: TIME_OUT })

    // Lấy thông tin sản phẩm
    const productDetails = await page.evaluate(() => {
      const title =
        document.querySelector('.title--wrap--UUHae_g')?.innerText || 'N/A'
      const price =
        document.querySelector('.product-price-value')?.innerText || 'N/A'
      const originalPrice =
        document.querySelector('.product-price-original')?.innerText || price // Giá gốc nếu có

      return {
        title,
        originalPrice,
        promotionalPrice: price !== originalPrice ? price : 'N/A', // Nếu giá khuyến mãi khác giá gốc, hiển thị giá khuyến mãi
      }
    })

    console.log('Product Details:', productDetails)
    return productDetails
  } catch (error) {
    console.error('Error fetching product details:', error.message)
  }

  await browser.close()
}

const getTitle = async (productId) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  // Ngụy trang Puppeteer
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })

  // Chặn tải các tài nguyên không cần thiết
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const blockedResources = ['image', 'stylesheet', 'font', 'media']
    if (blockedResources.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })

  // Set User-Agent để giả lập trình duyệt thật
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  )

  const productUrl = `https://www.aliexpress.com/item/${productId}.html`

  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' })

    // Chờ các phần tử cần thiết xuất hiện
    await page.waitForSelector('.title--wrap--UUHae_g', { timeout: TIME_OUT })
    // await page.waitForSelector('.product-price-value', { timeout })

    // Lấy thông tin sản phẩm
    const productDetails = await page.evaluate(() => {
      const title =
        document.querySelector('.title--wrap--UUHae_g')?.innerText || 'N/A'
      // const price =
      //   document.querySelector('.product-price-value')?.innerText || 'N/A'
      // const originalPrice =
      //   document.querySelector('.product-price-original')?.innerText || price // Giá gốc nếu có

      return title
    })

    console.log('title:', productDetails)
    return productDetails
  } catch (error) {
    console.error('Error fetching product details:', error.message)
  }

  await browser.close()
}

const getOriginalPrice = async (productId) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: await chromium.executablePath, // Sử dụng trình duyệt từ chrome-aws-lambda
    args: chromium.args, // Tham số cấu hình cần thiết cho môi trường serverless
    defaultViewport: chromium.defaultViewport,
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()

  // Ngụy trang Puppeteer
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })

  // Chặn tải các tài nguyên không cần thiết
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const blockedResources = ['image', 'stylesheet', 'font', 'media']
    if (blockedResources.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })

  // Set User-Agent để giả lập trình duyệt thật
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  )

  const productUrl = `https://www.aliexpress.com/item/${productId}.html`

  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' })

    // Chờ các phần tử cần thiết xuất hiện
    await page.waitForSelector('.product-price-value', { timeout: 30000 })

    // Lấy thông tin sản phẩm
    const productDetails = await page.evaluate(() => {
      const price =
        document.querySelector('.product-price-value')?.innerText || 'N/A'
      const originalPrice =
        document.querySelector('.product-price-original')?.innerText || price // Giá gốc nếu có

      return originalPrice
    })

    console.log('originalPrice:', productDetails)
    return productDetails
  } catch (error) {
    console.error('getOriginalPrice:', error.message)
    return null
  } finally {
    await browser.close()
  }
}

const getPromotionalPrice = async (productId) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  // Ngụy trang Puppeteer
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  })

  // Chặn tải các tài nguyên không cần thiết
  await page.setRequestInterception(true)
  page.on('request', (req) => {
    const blockedResources = ['image', 'stylesheet', 'font', 'media']
    if (blockedResources.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })

  // Set User-Agent để giả lập trình duyệt thật
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  )

  const productUrl = `https://www.aliexpress.com/item/${productId}.html`

  try {
    await page.goto(productUrl, { waitUntil: 'domcontentloaded' })

    // Chờ các phần tử cần thiết xuất hiện
    await page.waitForSelector('.product-price-value', { timeout: TIME_OUT })

    // Lấy thông tin sản phẩm
    const productDetails = await page.evaluate(() => {
      const price =
        document.querySelector('.product-price-value')?.innerText || 'N/A'
      const originalPrice =
        document.querySelector('.product-price-original')?.innerText || price // Giá gốc nếu có

      return price !== originalPrice ? price : 'N/A' // Nếu giá khuyến mãi khác giá gốc, hiển thị giá khuyến mãi
    })

    console.log('getPromotionalPrice', productDetails)
    return productDetails
  } catch (error) {
    console.error('Error fetching product details:', error.message)
  }

  await browser.close()
}

module.exports = { getTitle, getOriginalPrice, getPromotionalPrice }
