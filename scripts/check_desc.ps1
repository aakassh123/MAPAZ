$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'MapazHotelBot/1.0 (contact@contact.com)')
$apiUrl = 'https://commons.wikimedia.org/w/api.php?action=query&titles=File:Boat_ride_at_Sunrise,_on_the_Ganges,_Varanasi.jpg|File:Varanasi_2010_ghats4.JPG&prop=imageinfo&iiprop=extmetadata|size&format=json'
$res = $wc.DownloadString($apiUrl)
$wc.Dispose()
$data = $res | ConvertFrom-Json
foreach ($p in $data.query.pages.PSObject.Properties.Name) {
    $page = $data.query.pages.$p
    Write-Output "Title: $($page.title)"
    if ($page.imageinfo[0].extmetadata.ImageDescription) {
        Write-Output "Description: $($page.imageinfo[0].extmetadata.ImageDescription.value)"
    }
}
