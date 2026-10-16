$title = "File:Boat ride at Sunrise, on the Ganges, Varanasi.jpg"
$apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&titles=$([uri]::EscapeDataString($title))&prop=imageinfo&iiprop=url|size&format=json"

$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'MapazHotelBot/1.0 (contact@mapazhotel.com)')
$res = $wc.DownloadString($apiUrl)
$wc.Dispose()

$data = $res | ConvertFrom-Json
foreach ($pageId in $data.query.pages.PSObject.Properties.Name) {
    $info = $data.query.pages.$pageId.imageinfo[0]
    Write-Output "URL: $($info.url)"
    Write-Output "Dimensions: $($info.width) x $($info.height)"
    
    # Download with curl
    $cmd = "curl.exe -A `"MapazHotelBot/1.0 (contact@mapazhotel.com)`" -o `"public\images\test_nauka\boat_ride_sunrise.jpg`" `"$($info.url)`""
    Invoke-Expression $cmd
}
