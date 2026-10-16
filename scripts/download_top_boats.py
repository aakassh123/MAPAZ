import urllib.request
import os
import subprocess

candidates = {
    "ganga_morning_ride.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/22/Morning_boat_ride_on_the_Ganges_River.jpg",
    "varanasi_sunrise_tour.jpg": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Varanasi%2C_India_%2840394627473%29.jpg",
    "varanasi_kedar_ghat_tour.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/26/Varanasi%2C_India_%2833483934528%29.jpg",
    "rowing_boat_ganges.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Varanasi%2C_India%2C_Rowing_the_boat_on_river_Ganges.jpg",
    "shikara_sunset_tour.jpg": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Dal_Lake%27s_sunset_tour_on_a_shikara_-_Srinagar_%289967020595%29.jpg",
    "color_boats_lake.jpg": "https://upload.wikimedia.org/wikipedia/commons/d/df/Color_Boats.jpg"
}

out_dir = r"public\images\test_nauka\candidates"
os.makedirs(out_dir, exist_ok=True)

for name, url in candidates.items():
    dest = os.path.join(out_dir, name)
    print(f"Downloading {name}...")
    cmd = [
        "curl.exe", "-A",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MapazHotelBot/1.0",
        "-L", "-o", dest, url
    ]
    subprocess.run(cmd)
    if os.path.exists(dest):
        size = os.path.getsize(dest)
        print(f"-> {name}: {size} bytes")
    else:
        print(f"-> Failed: {name}")
