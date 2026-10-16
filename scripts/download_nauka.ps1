$urls = @{
    "nauka_vihar_wiki.jpg" = "https://upload.wikimedia.org/wikipedia/commons/8/84/Nauka_Vihar.jpg"
    "ramgarh_tal_lake_wiki.jpg" = "https://upload.wikimedia.org/wikipedia/commons/a/ad/Ramgarh_Tal_Lake%2C_Gorakhpur%2C_8_Apr_2019.jpg"
}

$outputDir = (Resolve-Path "public\images").Path

foreach ($name in $urls.Keys) {
    $targetPath = Join-Path $outputDir $name
    $url = $urls[$name]
    Write-Output "Downloading $url to $targetPath..."
    try {
        $wc = New-Object System.Net.WebClient
        $wc.Headers.Add("User-Agent", "MapazHotelBot/1.0 (https://mapazhotel.com; contact@mapazhotel.com)")
        $wc.DownloadFile($url, $targetPath)
        $wc.Dispose()
        $fi = Get-Item $targetPath
        Write-Output "Downloaded $name : $($fi.Length) bytes"
    } catch {
        Write-Output "Error downloading $name : $($_.Exception.Message)"
    }
}
