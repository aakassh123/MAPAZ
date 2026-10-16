Add-Type -AssemblyName System.Drawing
$srcPath = "public/images/test_nauka/boat_ride_sunrise.jpg"
$src = [System.Drawing.Image]::FromFile((Resolve-Path $srcPath).Path)

$targetW = 1600
$targetH = 900 # 16:9 HD

$cropW = $src.Width # 3888
$cropH = [int]($src.Width / (16.0 / 9.0)) # 2187

$offsets = @(0, 80, 150)

foreach ($y in $offsets) {
    $bmp = New-Object System.Drawing.Bitmap $targetW, $targetH
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $destRect = New-Object System.Drawing.Rectangle 0, 0, $targetW, $targetH
    $srcRect = New-Object System.Drawing.Rectangle 0, $y, $cropW, $cropH
    
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    
    $destPath = "public/images/test_nauka/previews/crop_test_y$y.jpg"
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]95)
    
    $bmp.Save($destPath, $codec, $encParams)
    $bmp.Dispose()
    Write-Output "Saved crop_test_y$y.jpg"
}
$src.Dispose()
