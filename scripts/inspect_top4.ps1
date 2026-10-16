Add-Type -AssemblyName System.Drawing
$files = @(
    "public/images/test_nauka/boat_ride_sunrise.jpg",
    "public/images/test_nauka/ghats4_boat.jpg",
    "public/images/test_nauka/candidates/ganga_morning_ride.jpg",
    "public/images/test_nauka/candidates/varanasi_sunrise_tour.jpg"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $item = Get-Item $f
        $img = [System.Drawing.Image]::FromFile($item.FullName)
        [PSCustomObject]@{
            Name = $item.Name
            Width = $img.Width
            Height = $img.Height
            AspectRatio = [Math]::Round(($img.Width / $img.Height), 2)
            SizeKB = [Math]::Round($item.Length / 1024)
        }
        $img.Dispose()
    }
}
