Add-Type -AssemblyName System.Drawing
$srcPath = "public/images/test_nauka/candidates/shikara_sunset_5184.jpg"
$destPath = "public/images/test_nauka/previews/preview_shikara_sunset.jpg"
$targetWidth = 1440
$targetHeight = 810

$src = [System.Drawing.Image]::FromFile((Resolve-Path $srcPath).Path)
$srcAspect = $src.Width / $src.Height
$targetAspect = 16.0 / 9.0

if ($srcAspect -gt $targetAspect) {
    $cropH = $src.Height
    $cropW = [int]($src.Height * $targetAspect)
    $cropX = [int](($src.Width - $cropW) / 2)
    $cropY = 0
} else {
    $cropW = $src.Width
    $cropH = [int]($src.Width / $targetAspect)
    $cropX = 0
    $cropY = [int](($src.Height - $cropH) / 2)
}

$bmp = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$destRect = New-Object System.Drawing.Rectangle 0, 0, $targetWidth, $targetHeight
$srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH

$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]92)

$bmp.Save($destPath, $codec, $encParams)
$bmp.Dispose()
Write-Output "Preview saved."
