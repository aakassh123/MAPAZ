$url = "https://upload.wikimedia.org/wikipedia/commons/3/32/Boats_at_the_Ganges_at_sunrise.JPG"
$dest = "public\images\test_nauka\boats_at_sunrise.jpg"

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "MapazHotelBot/1.0 (https://mapazhotel.com; contact@mapazhotel.com)")
$wc.DownloadFile($url, $dest)
$wc.Dispose()

$fi = Get-Item $dest
Write-Output "Downloaded boats_at_sunrise.jpg: $($fi.Length) bytes"
