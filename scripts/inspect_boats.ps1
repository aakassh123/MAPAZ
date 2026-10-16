Add-Type -AssemblyName System.Drawing
Get-ChildItem -Path "public/images/test_nauka/*.jpg" | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    [PSCustomObject]@{
        Name = $_.Name
        Width = $img.Width
        Height = $img.Height
        AspectRatio = [Math]::Round(($img.Width / $img.Height), 2)
        SizeKB = [Math]::Round($_.Length / 1024)
    }
    $img.Dispose()
} | Format-Table -AutoSize
