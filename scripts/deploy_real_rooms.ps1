$brainDir = "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275"
$publicImages = "c:\Users\MINAKSHI TRIPATHI\OneDrive\Desktop\hotel\public\images"

# 1. Copy generated matching 16:9 images
Copy-Item (Join-Path $brainDir "deluxe_emerald_real_style_1792140572477.jpg") (Join-Path $publicImages "deluxe-room.jpg") -Force
Copy-Item (Join-Path $brainDir "super_deluxe_grey_real_style_1792140605322.jpg") (Join-Path $publicImages "super-deluxe.jpg") -Force
Copy-Item (Join-Path $brainDir "executive_skyline_lounge_real_style_1792140635862.jpg") (Join-Path $publicImages "executive-skyline.jpg") -Force
Copy-Item (Join-Path $brainDir "maharaja_suite_real_style_1792140521098.jpg") (Join-Path $publicImages "maharaja-suite.jpg") -Force
Copy-Item (Join-Path $brainDir "presidential_penthouse_real_style_1792140551196.jpg") (Join-Path $publicImages "luxury-suite.jpg") -Force

# 2. Also keep named files for explicit reference
Copy-Item (Join-Path $brainDir "deluxe_emerald_real_style_1792140572477.jpg") (Join-Path $publicImages "room-emerald-wide.jpg") -Force
Copy-Item (Join-Path $brainDir "super_deluxe_grey_real_style_1792140605322.jpg") (Join-Path $publicImages "room-grey-wide.jpg") -Force
Copy-Item (Join-Path $brainDir "executive_skyline_lounge_real_style_1792140635862.jpg") (Join-Path $publicImages "room-lounge-wide.jpg") -Force
Copy-Item (Join-Path $brainDir "maharaja_suite_real_style_1792140521098.jpg") (Join-Path $publicImages "room-maharaja-wide.jpg") -Force
Copy-Item (Join-Path $brainDir "presidential_penthouse_real_style_1792140551196.jpg") (Join-Path $publicImages "room-penthouse-wide.jpg") -Force

Get-ChildItem -Path $publicImages -Filter "*suite*.jpg" | Select-Object Name, Length
Get-ChildItem -Path $publicImages -Filter "*deluxe*.jpg" | Select-Object Name, Length
Get-ChildItem -Path $publicImages -Filter "real-room-*.jpg" | Select-Object Name, Length
