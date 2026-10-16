$candidates = @{
    "bharatsair_1.jpg" = "https://bharatsair.com/wp-content/uploads/2021/10/places-to-visit-in-india-bharat-sair-1.jpg"
    "bharatsair_3.jpg" = "https://bharatsair.com/wp-content/uploads/2021/10/places-to-visit-in-india-bharat-sair-3.jpg"
    "bharatsair_4.jpg" = "https://bharatsair.com/wp-content/uploads/2021/10/places-to-visit-in-india-bharat-sair-4.jpg"
    "bharatsair_natural.jpg" = "https://bharatsair.com/wp-content/uploads/2021/10/natural-places-to-visit-in-india-bharat-sair.jpg"
    "lake_queen_cruise.jpg" = "https://cruiselakequeen.com/assets/about.jpg"
    "lake_queen_jd.jpg" = "https://content.jdmagicbox.com/v2/comp/gorakhpur/c8/9999px551.x551.240228101226.f3c8/catalogue/lake-queen-cruise-gorakhpur-restaurants-3jdcl5c1sh.jpg"
}

$destDir = "public\images\test_nauka"
if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

foreach ($name in $candidates.Keys) {
    $url = $candidates[$name]
    $dest = Join-Path $destDir $name
    try {
        $wc = New-Object System.Net.WebClient
        $wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        $wc.DownloadFile($url, $dest)
        $wc.Dispose()
        $item = Get-Item $dest
        Write-Output "$name downloaded: $($item.Length) bytes"
    } catch {
        Write-Output "Error downloading $name : $($_.Exception.Message)"
    }
}
