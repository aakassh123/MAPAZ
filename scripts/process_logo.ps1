Add-Type -AssemblyName System.Drawing

$src = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images\mapaz-logo.jpg"
$dest = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images\mapaz-logo-transparent.png"
$destDark = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images\mapaz-logo-darkbg.png"

$orig = [System.Drawing.Bitmap]::FromFile($src)
$bmp = New-Object System.Drawing.Bitmap($orig.Width, $orig.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bmpDark = New-Object System.Drawing.Bitmap($orig.Width, $orig.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $orig.Height; $y++) {
    for ($x = 0; $x -lt $orig.Width; $x++) {
        $c = $orig.GetPixel($x, $y)
        # Check if pixel is white / background
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            $bmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Compute transparency based on brightness for anti-aliasing
            $brightness = ($c.R + $c.G + $c.B) / (3.0 * 255.0)
            if ($brightness -gt 0.95) {
                $alpha = [int]((1.0 - $brightness) / 0.05 * 255)
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            } else {
                $bmp.SetPixel($x, $y, $c)
            }
            # For dark background version: golden glow / bright gold
            $goldR = [Math]::Min(255, [int]($c.R * 1.25))
            $goldG = [Math]::Min(255, [int]($c.G * 1.25))
            $goldB = [Math]::Min(255, [int]($c.B * 1.25))
            $bmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $goldR, $goldG, $goldB))
        }
    }
}

$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpDark.Save($destDark, [System.Drawing.Imaging.ImageFormat]::Png)

$orig.Dispose()
$bmp.Dispose()
$bmpDark.Dispose()

Write-Host "Processed transparent PNGs successfully!"
