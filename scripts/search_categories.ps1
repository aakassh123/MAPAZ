$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'MapazHotelBot/1.0 (contact@mapazhotel.com)')

$categories = @("Category:Ramgarh_Tal_Lake", "Category:Boats_on_the_Ganges", "Category:Boating_in_Uttar_Pradesh", "Category:Boats_in_India")

foreach ($cat in $categories) {
    Write-Output "`n=== $cat ==="
    $apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=$([uri]::EscapeDataString($cat))&cmtype=file&cmlimit=15&prop=imageinfo&iiprop=url|size&format=json"
    try {
        $res = $wc.DownloadString($apiUrl)
        $data = $res | ConvertFrom-Json
        foreach ($m in $data.query.categorymembers) {
            Write-Output "File: $($m.title)"
        }
    } catch {
        Write-Output "Error: $($_.Exception.Message)"
    }
}
$wc.Dispose()
