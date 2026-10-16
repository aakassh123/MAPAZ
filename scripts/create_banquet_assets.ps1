Add-Type -AssemblyName System.Drawing

# 1. Copy the 3 generated images directly to replace non-real banquet images
$genWedding = "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\wedding_banquet_real_style_1792143152451.jpg"
$genDining = "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\royal_banquet_dining_real_style_1792143171354.jpg"
$genSummit = "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\corporate_summit_real_style_1792143194283.jpg"

Copy-Item $genWedding "public\images\wedding-banquet.jpg" -Force
Copy-Item $genDining "public\images\royal-banquet-catering.jpg" -Force
Copy-Item $genSummit "public\images\corporate-banquet.jpg" -Force

Write-Output "Copied 3 generated images to public/images/"

# 2. Create Sheesh Mahal / Palatial Mirror Sanctuary 16:9 image from the real stage & dining photos
# Let's create an elegant widescreen 1376x768 composition featuring the authentic real photos
$stageImg = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\real-banquet-stage.jpg"))
$diningImg = [System.Drawing.Image]::FromFile((Resolve-Path "public\images\real-banquet-dining.jpg"))

$canvasWidth = 1376
$canvasHeight = 768

$bmp = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Background: Fill dark luxury slate
$brushBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 10, 8))
$g.FillRectangle($brushBg, 0, 0, $canvasWidth, $canvasHeight)

# Fit Stage photo on the left half (with slight margin), Dining photo on the right half
# Each photo has 577x1024 (aspect ratio 0.563)
# In 768 height, width will be 768 * (577/1024) = 433 px
$pw = [int](768.0 * 577.0 / 1024.0) # ~433
$ph = 768

# Or we can scale to fill height and center each in its half (half width = 688)
$x1 = [int]((688 - $pw) / 2) # ~127
$x2 = 688 + [int]((688 - $pw) / 2) # 688 + 127 = 815

# Draw subtle blurred background fill behind each
$g.DrawImage($stageImg, 0, 0, 688, $canvasHeight)
$g.DrawImage($diningImg, 688, 0, 688, $canvasHeight)

# Apply semi-transparent luxury dark overlay on the background
$brushOverlay = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 10, 8, 7))
$g.FillRectangle($brushOverlay, 0, 0, $canvasWidth, $canvasHeight)

# Draw sharp authentic photos in the centers of each half with gold borders
$destRect1 = New-Object System.Drawing.Rectangle($x1, 0, $pw, $ph)
$destRect2 = New-Object System.Drawing.Rectangle($x2, 0, $pw, $ph)

$g.DrawImage($stageImg, $destRect1)
$g.DrawImage($diningImg, $destRect2)

# Draw gold accent dividing line and luxury border accents
$goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(212, 175, 55), 2)
$g.DrawLine($goldPen, 688, 0, 688, $canvasHeight)

# Draw subtle gold border around the images
$g.DrawRectangle($goldPen, $x1, 0, $pw - 1, $ph - 1)
$g.DrawRectangle($goldPen, $x2, 0, $pw - 1, $ph - 1)

$g.Dispose()
$stageImg.Dispose()
$diningImg.Dispose()

$outputPath = "public\images\sheesh-mahal-banquet.jpg"
$bmp.Save((Resolve-Path "public\images").Path + "\sheesh-mahal-banquet.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$bmp.Dispose()

Write-Output "Successfully generated sheesh-mahal-banquet.jpg dual authentic view!"
