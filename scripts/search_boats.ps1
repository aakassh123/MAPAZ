# Search Wikimedia Commons for boat / nauka queries
$queries = @("Nauka Vihar", "Nauka", "Ramgarh lake", "Ramgarh Tal boat", "Indian boat sunrise", "Varanasi wooden boat", "shikara lake sunrise", "boats Ganga")

$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'MapazHotelBot/1.0 (contact@mapazhotel.com)')

foreach ($q in $queries) {
    Write-Output "=== QUERY: $q ==="
    $apiUrl = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$([uri]::EscapeDataString($q))&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    try {
        $res = $wc.DownloadString($apiUrl)
        $data = $res | ConvertFrom-Json
        if ($data.query -and $data.query.pages) {
            foreach ($pageId in $data.query.pages.PSObject.Properties.Name) {
                $page = $data.query.pages.$pageId
                $info = $page.imageinfo[0]
                $desc = ""
                if ($info.extmetadata -and $info.extmetadata.ImageDescription) {
                    $desc = ($info.extmetadata.ImageDescription.value -replace '<[^>]+>', '').Trim()
                    if ($desc.Length -gt 120) { $desc = $desc.Substring(0, 120) + "..." }
                }
                Write-Output "[$($info.width)x$($info.height)] $($page.title) :: $desc"
                Write-Output "   URL: $($info.url)"
            }
        } else {
            Write-Output "No results."
        }
    } catch {
        Write-Output "Error: $($_.Exception.Message)"
    }
}
$wc.Dispose()
