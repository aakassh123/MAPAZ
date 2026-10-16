$testDir = "public/images/test_nauka"
if (Test-Path $testDir) {
    Remove-Item -Path $testDir -Recurse -Force
    Write-Output "Removed $testDir"
}

$tempFiles = @("public/images/ramgarh_tal_lake_wiki.jpg", "public/images/nauka_vihar_wiki.jpg")
foreach ($f in $tempFiles) {
    if (Test-Path $f) {
        Remove-Item -Path $f -Force
        Write-Output "Removed $f"
    }
}
