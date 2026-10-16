import subprocess

url = "https://upload.wikimedia.org/wikipedia/commons/6/6a/Dal_Lake%27s_sunset_tour_on_a_shikara_-_Srinagar_%289967020595%29.jpg"
dest = r"public\images\test_nauka\candidates\shikara_sunset_5184.jpg"

cmd = [
    "curl.exe", "-A",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "-L", "-o", dest, url
]
subprocess.run(cmd)
