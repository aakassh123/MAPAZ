Add-Type -AssemblyName System.Drawing

$stagePath = (Resolve-Path "public\images\real-banquet-stage.jpg").Path
$diningPath = (Resolve-Path "public\images\real-banquet-dining.jpg").Path

$stageImg = [System.Drawing.Image]::FromFile($stagePath)
$diningImg = [System.Drawing.Image]::FromFile($diningPath)

Write-Output "Stage: $($stageImg.Width) x $($stageImg.Height)"
Write-Output "Dining: $($diningImg.Width) x $($diningImg.Height)"

# Test Crop 1: Stage photo cropped to 16:9 (top/middle focused so chandeliers + stage are visible)
# Width = 577, Height for 16:9 = 577 * 9 / 16 = 324 px
# But let's see if 577x324 scaled to 1376x768 is good or if direct file is better
$targetW = 1376
$targetH = 768

# Method A: Take real-banquet-stage.jpg and save directly as sheesh-mahal-banquet.jpg
Copy-Item $stagePath "public\images\sheesh-mahal-banquet-stage-direct.jpg" -Force

# Method B: Smart seamless wide composition of Stage photo:
# Expand the background smoothly from the edges without any divider line or second photo!
# A single unified image of the stage hall.
$bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Fill the entire canvas with a scaled-to-fill blurred ambient version of the stage photo
# (covers 100% of the canvas with the exact colors, lights, and warmth of the hall)
$g.DrawImage($stageImg, 0, 0, $targetW, $targetH)

# Apply a smooth semi-transparent dark luxury gradient to softly feather the background
$brushGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($targetW, 0)),
    [System.Drawing.Color]::FromArgb(230, 15, 12, 10),
    [System.Drawing.Color]::FromArgb(0, 15, 12, 10)
)
$g.FillRectangle($brushGrad, 0, 0, [int]($targetW * 0.4), $targetH)

$brushGrad2 = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point([int]($targetW * 0.6), 0)),
    (New-Object System.Drawing.Point($targetW, 0)),
    [System.Drawing.Color]::FromArgb(0, 15, 12, 10),
    [System.Drawing.Color]::FromArgb(230, 15, 12, 10)
)
$g.FillRectangle($brushGrad2, [int]($targetW * 0.6), 0, [int]($targetW * 0.4), $targetH)

# Now draw the sharp authentic stage photo centered, filling full height (768px):
$sharpW = [int](768.0 * $stageImg.Width / $stageImg.Height) # ~433px
$sharpX = [int](($targetW - $sharpW) / 2) # ~471px
$destRect = New-Object System.Drawing.Rectangle($sharpX, 0, $sharpW, $targetH)

# Draw soft feathered edge or draw directly
$g.DrawImage($stageImg, $destRect)

$g.Dispose()
$bmp.Save((Resolve-Path "public\images").Path + "\sheesh-mahal-banquet-ambient.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

$stageImg.Dispose()
$diningImg.Dispose()

Write-Output "Created test images successfully!"
