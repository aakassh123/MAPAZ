$srcDir = "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\.user_uploaded"
$dstDir = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images"

Copy-Item (Join-Path $srcDir "media_1792139668169.jpg") (Join-Path $dstDir "real-room-emerald.jpg") -Force
Copy-Item (Join-Path $srcDir "media_1792139668192.jpg") (Join-Path $dstDir "real-room-grey.jpg") -Force
Copy-Item (Join-Path $srcDir "media_1792139668126.jpg") (Join-Path $dstDir "real-room-lounge.jpg") -Force

Add-Type -AssemblyName System.Drawing
Get-ChildItem -Path $dstDir -Filter "real-room-*.jpg" | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    Write-Output "$($_.Name): $($img.Width) x $($img.Height)"
    $img.Dispose()
}
