// Giithub @BlueSkyXN
// Code: Modified based on the original
// 仅供学习CloudFlare Worker开发使用，违规使用后果自负
// License @GPLv3

addEventListener('fetch', event => {
      event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
      const urlParam = new URL(request.url).searchParams.get('url');

      if (request.method === 'GET' && !urlParam) {
            return new Response(html, {
                  headers: {
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'text/html;charset=UTF-8',
                  },
            })
      } else if (request.method === 'POST') {
            const formData = await request.formData()
            const file = formData.get('file')

            const response = await fetch("https://community.codewave.163.com/gateway/lowcode/api/v1/app/upload", {
                  method: 'POST',
                  headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
                        'Referer': 'https://community.codewave.163.com'
                  },
                  body: formData
            })

            const data = await response.json()

            let uploadUrl = data.result;

            // Calculate the equivalent URL
            const originalBase = "https://lcap-static-saas.nos-eastchina1.126.net/";
            const newBase = "https://community.codewave.163.com/upload/";
            let equivalentUrl = uploadUrl.replace(originalBase, newBase);
            let result = JSON.stringify({ uploadUrl, equivalentUrl });

            return new Response(result, {
                  headers: {
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'application/json',
                  },
            })
      } else if (urlParam && request.method === 'GET') {
            // 构建请求到 cleanuri.com 的 URL
            const apiUrl = 'https://cleanuri.com/api/v1/shorten';
            const requestOptions = {
                  method: 'POST',
                  body: `url=${encodeURIComponent(urlParam)}`,
                  headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                  },
            };

            // 使用 fetch 发送 POST 请求到 cleanuri.com
            const response = await fetch(apiUrl, requestOptions);

            if (response.ok) {
                  const responseData = await response.json();
                  const shortenedUrl = responseData.result_url;

                  // 返回缩短后的 URL
                  return new Response(shortenedUrl, {
                        headers: {
                              'Access-Control-Allow-Origin': '*',
                        },
                  },);
            } else {
                  return new Response('Failed to shorten the URL', { status: 500 });
            }
      }
}

const html = `please use POST.`