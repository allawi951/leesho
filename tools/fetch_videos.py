# يحدّث tools/videos.json بحلقات القناتين (الفيديوهات الطويلة، بدون الشورتس) — بعدها شغّل build_site.py.
# التشغيل:  python tools/fetch_videos.py      (يحتاج: pip install yt-dlp)
import json, os, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHANNELS = [
    ('ali', 'علي وليشو', 'https://www.youtube.com/@ali.wa.leesho'),
    ('world', 'عالم ليشو', 'https://www.youtube.com/@Leesho-world'),
]

def fetch(url):
    env = dict(os.environ, PYTHONIOENCODING='utf-8', PYTHONUTF8='1')
    out = subprocess.run([sys.executable, '-m', 'yt_dlp', '--flat-playlist', '--extractor-args', 'youtube:lang=ar',
                          '--print', '%(id)s\t%(title)s\t%(duration)s', url + '/videos'],
                         capture_output=True, text=True, encoding='utf-8', env=env, check=True).stdout
    vids = []
    for line in out.splitlines():
        parts = line.split('\t')
        if len(parts) == 3 and parts[0]:
            d = parts[2]
            vids.append({'id': parts[0], 'title': parts[1].strip(), 'sec': int(float(d)) if d not in ('NA', '') else 0})
    return vids

data = {key: {'name': name, 'url': url, 'videos': fetch(url)} for key, name, url in CHANNELS}
(ROOT / 'tools' / 'videos.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8', newline='\n')
print({k: len(v['videos']) for k, v in data.items()})
