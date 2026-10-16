$content = Get-Content 'C:\Users\MINAKSHI TRIPATHI\.gemini\antigravity-ide\brain\e0bb4d9f-15e8-4c00-929e-f4303ad35275\.system_generated\steps\1186\content.md' -Raw
$matches = [regex]::Matches($content, 'https://bharatsair\.com/wp-content/uploads/[^"\s>]+')
foreach ($m in $matches) {
    Write-Output $m.Value
}
