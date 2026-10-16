Add-Type -AssemblyName System.Drawing

$files = @(
    "public\images\real-banquet-dining.jpg",
    "public\images\real-banquet-stage.jpg",
    "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\wedding_banquet_real_style_1792143152451.jpg",
    "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\royal_banquet_dining_real_style_1792143171354.jpg",
    "C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\corporate_summit_real_style_1792143194283.jpg"
)

foreach ($filePath in $files) {
    if (Test-Path $filePath) {
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $filePath))
        Write-Output "$filePath : $($img.Width) x $($img.Height)"
        $img.Dispose()
    } else {
        Write-Output "Not found: $filePath"
    }
}
