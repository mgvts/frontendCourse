import fetch from "node-fetch";

async function crawl(url, depth, concurrency) {
  const getData = async (url, currDepth) => {
    if (currDepth > depth) {
      return []
    }
    const getLinks = (input) => {
      const regex = /href="(http.*?)"/g;
      const matches = input.match(regex) || [];
      return matches.map(match => match.replace('href="', '').replace('"', ''));
    }

    try {
      const impl = await fetch(url)

      const text = await impl.text()
      const o = {
        url: url,
        depth: currDepth,
        content: text,
        links: getLinks(text)
      }
      let list = [o]
      let subList = [...o.links]

      while (subList.length > 0) {
        const ind = Math.min(concurrency, subList.length)
        const s = subList.splice(0, ind)
        ;(await Promise.all(s.map(u => getData(u, currDepth + 1))))
            .forEach(l => list.push(...l.flat(1)))
      }
      return list
    } catch (Error) {
      return []
    }
  }
  return await getData(url, 1)
}

// module.exports = crawl;

let example = {
  url: "https://example.com/page",  // URL страницы
  depth: 3,  // Глубина, на которой была найдена страница
  content: "<html>...</html>",  // содержимое страницы
  links: ["https://example.com/another-page",]  // массив ссылок, найденных на странице
}


let foo = async () => {
  const startingUrl = 'https://example.com'
  const depth = 3;
  const concurrency = 1;

  const result = await crawl(startingUrl, depth, concurrency);
  result.map(o => {
    console.log({
      url: o.url,
      d: o.depth
    })
  })
}
foo()