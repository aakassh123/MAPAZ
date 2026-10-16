Add-Type -AssemblyName System.Drawing

$stageImg = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\real-banquet-stage.jpg").Path)
$diningImg = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\real-banquet-dining.jpg").Path)

# Let's inspect different vertical slices of stageImg (577 x 1024)
# Aspect ratio 16:9 means height = 577 * 9 / 16 = 324
# Slice 1: Y=120 to Y=444 (Chandelier + Stage with mustard sofa)
$rectStage = New-Object System.Drawing.Rectangle(0, 100, 577, 325)
$bmpStage = New-Object System.Drawing.Bitmap(1376, 768)
$g1 = [System.Drawing.Graphics]::FromImage($bmpStage)
$g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g1.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g1.DrawImage($stageImg, (New-Object System.Drawing.Rectangle(0, 0, 1376, 768)), $rectStage, [System.Drawing.GraphicsUnit]::Pixel)
$g1.Dispose()
$bmpStage.Save((Resolve-Path "public\images").Path + "\crop-stage-16x9.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpStage.Dispose()

# Slice 2: Dining photo slice Y=150 to Y=475 (Chandelier + fluted columns + tables + backlit arches)
$rectDining = New-Object System.Drawing.Rectangle(0, 120, 576, 324)
$bmpDining = New-Object System.Drawing.Bitmap(1376, 768)
$g2 = [System.Drawing.Graphics]::FromImage($bmpDining)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g2.DrawImage($diningImg, (New-Object System.Drawing.Rectangle(0, 0, 1376, 768)), $rectDining, [System.Drawing.GraphicsUnit]::Pixel)
$g2.Dispose()
$bmpDining.Save((Resolve-Path "public\images").Path + "\crop-dining-16x9.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmpDining.Dispose()

$stageImg.Dispose()
$diningImg.Dispose()

Write-Output "Successfully generated 16x9 crops!"
