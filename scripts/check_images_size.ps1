Get-ChildItem -Path "public/images" | ForEach-Object {
    if ($_.PSIsContainer) {
        $sub = Get-ChildItem $_.FullName -Recurse | Measure-Object -Property Length -Sum
        [PSCustomObject]@{ Name = $_.Name; IsDir = $true; SizeMB = [Math]::Round(($sub.Sum / 1MB), 2) }
    } else {
        [PSCustomObject]@{ Name = $_.Name; IsDir = $false; SizeMB = [Math]::Round(($_.Length / 1MB), 2) }
    }
} | Format-Table -AutoSize
