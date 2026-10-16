Add-Type -AssemblyName System.Drawing

$src = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images\mapaz-logo-transparent.png"
$dest = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images\mapaz-emblem.png"

$orig = [System.Drawing.Bitmap]::FromFile($src)
# Emblem is in the top center of the 1024x528 image
$rect = New-Object System.Drawing.Rectangle(360, 0, 304, 220)
$crop = $orig.Clone($rect, $orig.PixelFormat)
$crop.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)

$orig.Dispose()
$crop.Dispose()

Write-Host "Emblem cropped successfully!"
