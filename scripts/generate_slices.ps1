Add-Type -AssemblyName System.Drawing

$stageImg = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\real-banquet-stage.jpg").Path)
$diningImg = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\real-banquet-dining.jpg").Path)

# In real-banquet-stage (577 x 1024):
# Target aspect ratio is 16:9, height for width 577 is 577 * 9 / 16 = 325 px
# Let's test slice A: Y = 200, Height = 325 (includes chandeliers, stage, mustard sofa, top of aisle chairs/sofas)
# Slice B: Y = 280, Height = 325 (centered on stage, mustard sofa, floral arch, VIP sofas, and aisle)

function Save-Slice($srcImg, $y, $outName) {
    $rect = New-Object System.Drawing.Rectangle(0, $y, $srcImg.Width, [int]($srcImg.Width * 9.0 / 16.0))
    $bmp = New-Object System.Drawing.Bitmap(1376, 768)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($srcImg, (New-Object System.Drawing.Rectangle(0, 0, 1376, 768)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save((Resolve-Path "public\images").Path + "\" + $outName, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $bmp.Dispose()
}

Save-Slice $stageImg 200 "slice-stage-200.jpg"
Save-Slice $stageImg 280 "slice-stage-280.jpg"
Save-Slice $diningImg 300 "slice-dining-300.jpg"
Save-Slice $diningImg 380 "slice-dining-380.jpg"

$stageImg.Dispose()
$diningImg.Dispose()
Write-Output "Generated slices 200, 280, 300, 380"
