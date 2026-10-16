$title = "File:Varanasi 2010 ghats4.JPG"
$apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&titles=$([uri]::EscapeDataString($title))&prop=imageinfo&iiprop=url|size&format=json"

$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'MapazHotelBot/1.0 (contact@mapazhotel.com)')
$res = $wc.DownloadString($apiUrl)
$wc.Dispose()

$data = $res | ConvertFrom-Json
foreach ($pageId in $data.query.pages.PSObject.Properties.Name) {
    $info = $data.query.pages.$pageId.imageinfo[0]
    Write-Output "URL: $($info.url)"
    $cmd = "curl.exe -A `"MapazHotelBot/1.0 (contact@mapazhotel.com)`" -o `"public\images\test_nauka\ghats4_boat.jpg`" `"$($info.url)`""
    Invoke-Expression $cmd
}
