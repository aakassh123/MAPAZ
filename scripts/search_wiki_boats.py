import urllib.request
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MapazHotelBot/1.0 (contact@mapazhotel.com)'
}

queries = [
    'Nauka Vihar Gorakhpur',
    'boat Ganges sunrise quality',
    'wooden boat India lake',
    'shikara lake sunset',
    'boats Varanasi sunrise quality',
    'Indian lake boat reflection'
]

for q in queries:
    print(f"\n================ QUERY: {q} ================")
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                title = page.get('title', '')
                info = page.get('imageinfo', [{}])[0]
                w = info.get('width', 0)
                h = info.get('height', 0)
                img_url = info.get('url', '')
                desc = ''
                meta = info.get('extmetadata', {})
                if 'ImageDescription' in meta:
                    raw_desc = meta['ImageDescription'].get('value', '')
                    # clean html tags
                    import re
                    desc = re.sub(r'<[^>]+>', '', raw_desc)[:140]
                print(f"[{w}x{h}] {title}")
                print(f"   Desc: {desc}")
                print(f"   URL: {img_url}")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(1.0)
