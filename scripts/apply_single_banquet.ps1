Add-Type -AssemblyName System.Drawing

$src = (Resolve-Path "public\images\slice-stage-200.jpg").Path
$dest = (Resolve-Path "public\images").Path + "\sheesh-mahal-banquet.jpg"

Copy-Item $src $dest -Force
Write-Output "Successfully updated sheesh-mahal-banquet.jpg with single unified stage image!"

# Verify size
$img = [System.Drawing.Image]::FromFile($dest)
Write-Output "Final sheesh-mahal-banquet.jpg: $($img.Width) x $($img.Height)"
$img.Dispose()
