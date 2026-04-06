<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <!-- ── Sitemap Index ─────────────────────────────────────────────────── -->
  <xsl:template match="/sm:sitemapindex">
    <html lang="sr">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — GoldInvest.rs</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f9f9f7; color: #1a1a1a; }
          header { background: #1a1a1a; color: #c9a84c; padding: 20px 40px; display: flex; align-items: center; gap: 12px; }
          header h1 { font-size: 1.2rem; font-weight: 600; color: #fff; }
          header span { font-size: 0.85rem; color: #888; }
          .container { max-width: 860px; margin: 40px auto; padding: 0 20px; }
          h2 { font-size: 1rem; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          th { background: #f0ebe0; text-align: left; padding: 12px 16px; font-size: 0.8rem; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em; }
          td { padding: 12px 16px; font-size: 0.9rem; border-top: 1px solid #f0f0f0; }
          a { color: #b8860b; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .date { color: #999; font-size: 0.82rem; }
        </style>
      </head>
      <body>
        <header>
          <h1>GoldInvest.rs</h1>
          <span>/ Sitemap Index</span>
        </header>
        <div class="container">
          <h2>Pod-sitemapovi (<xsl:value-of select="count(sm:sitemap)"/>)</h2>
          <table>
            <tr>
              <th>URL</th>
              <th>Poslednja izmena</th>
            </tr>
            <xsl:for-each select="sm:sitemap">
              <tr>
                <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                <td class="date"><xsl:value-of select="sm:lastmod"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>

  <!-- ── URL Set ───────────────────────────────────────────────────────── -->
  <xsl:template match="/sm:urlset">
    <html lang="sr">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Sitemap — GoldInvest.rs</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f9f9f7; color: #1a1a1a; }
          header { background: #1a1a1a; color: #c9a84c; padding: 20px 40px; display: flex; align-items: center; gap: 12px; }
          header h1 { font-size: 1.2rem; font-weight: 600; color: #fff; }
          header a { font-size: 0.85rem; color: #c9a84c; text-decoration: none; }
          header a:hover { text-decoration: underline; }
          .container { max-width: 860px; margin: 40px auto; padding: 0 20px; }
          h2 { font-size: 1rem; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          th { background: #f0ebe0; text-align: left; padding: 12px 16px; font-size: 0.8rem; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.04em; }
          td { padding: 12px 16px; font-size: 0.9rem; border-top: 1px solid #f0f0f0; }
          a { color: #b8860b; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .meta { color: #999; font-size: 0.82rem; }
          .priority { display: inline-block; background: #f0ebe0; color: #7a6030; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; }
        </style>
      </head>
      <body>
        <header>
          <h1>GoldInvest.rs</h1>
          <a href="/sitemap.xml">← Sitemap Index</a>
        </header>
        <div class="container">
          <h2>URLovi (<xsl:value-of select="count(sm:url)"/>)</h2>
          <table>
            <tr>
              <th>URL</th>
              <th>Poslednja izmena</th>
              <th>Frekvencija</th>
              <th>Prioritet</th>
            </tr>
            <xsl:for-each select="sm:url">
              <tr>
                <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                <td class="meta"><xsl:value-of select="sm:lastmod"/></td>
                <td class="meta"><xsl:value-of select="sm:changefreq"/></td>
                <td><span class="priority"><xsl:value-of select="sm:priority"/></span></td>
              </tr>
            </xsl:for-each>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>
