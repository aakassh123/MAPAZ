$source = "public/images/test_nauka/previews/crop_test_y0.jpg"
$dest1 = "public/images/ramgarh-tal-lake.jpg"
$dest2 = "dist/images/ramgarh-tal-lake.jpg"

Copy-Item -Path $source -Destination $dest1 -Force
Write-Output "Copied to $dest1 : $((Get-Item $dest1).Length) bytes"

if (Test-Path "dist/images") {
    Copy-Item -Path $source -Destination $dest2 -Force
    Write-Output "Copied to $dest2 : $((Get-Item $dest2).Length) bytes"
}

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path $dest1).Path)
Write-Output "Dimensions: $($img.Width) x $($img.Height)"
$img.Dispose()
