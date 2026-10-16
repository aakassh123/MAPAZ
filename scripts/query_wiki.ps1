$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'MapazHotelBot/1.0 (contact@mapazhotel.com)')

$titles = @("File:Gorkhpur lake RamgarhTaal.jpg", "File:Ramgarh tal.jpg")

foreach ($t in $titles) {
    $apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&titles=$([uri]::EscapeDataString($t))&prop=imageinfo&iiprop=url|size&format=json"
    $res = $wc.DownloadString($apiUrl)
    $data = $res | ConvertFrom-Json
    foreach ($pageId in $data.query.pages.PSObject.Properties.Name) {
        $info = $data.query.pages.$pageId.imageinfo[0]
        Write-Output "$t -> $($info.url) ($($info.width)x$($info.height))"
        # Download
        $filename = "wiki_" + ($t -replace '[^a-zA-Z0-9]', '_') + ".jpg"
        $dest = "public\images\test_nauka\" + $filename
        $wc.DownloadFile($info.url, $dest)
        Write-Output "Downloaded to $dest"
    }
}

$wc.Dispose()
