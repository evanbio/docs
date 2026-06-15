const BLOG = require('./blog.config')

/**
 * 通常没啥用，sitemap交给 /pages/sitemap.xml.js 动态生成
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // 屏蔽 AI / 高频抓取爬虫，降低无效访问带来的 ISR Reads 与流量消耗
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // 常见 AI / LLM 数据采集爬虫，直接全站禁止
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'OAI-SearchBot', disallow: '/' },
      { userAgent: 'ChatGPT-User', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'Claude-Web', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'Applebot-Extended', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'PerplexityBot', disallow: '/' },
      { userAgent: 'meta-externalagent', disallow: '/' }
    ]
  }
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
