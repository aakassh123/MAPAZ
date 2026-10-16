$images = @{
    "nauka_vihar_real.jpg" = "https://upload.wikimedia.org/wikipedia/commons/8/84/Nauka_Vihar.jpg"
    "sun_rising_nauka.jpg" = "https://upload.wikimedia.org/wikipedia/commons/c/cb/Sun_rising.jpg"
}

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $dest = "public\images\test_nauka\$name"
    $cmd = "curl.exe -A `"MapazHotelBot/1.0 (contact@mapazhotel.com)`" -L -o `"$dest`" `"$url`""
    Invoke-Expression $cmd
    if (Test-Path $dest) {
        $item = Get-Item $dest
        Write-Output "$name : $($item.Length) bytes"
    }
}
