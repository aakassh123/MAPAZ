import urllib.request
import os
import subprocess

candidates = {
    "dal_lake_hobo.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/24/Dal_lake_by_Ahanger_HOBO.jpg",
    "traditional_river_boat.jpg": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Traditional_Fishing_Boat_on_Indian_River.jpg"
}

out_dir = r"public\images\test_nauka\candidates"

for name, url in candidates.items():
    dest = os.path.join(out_dir, name)
    print(f"Downloading {name}...")
    cmd = [
        "curl.exe", "-A",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "-L", "-o", dest, url
    ]
    subprocess.run(cmd)
    if os.path.exists(dest):
        print(f"-> {name}: {os.path.getsize(dest)} bytes")
