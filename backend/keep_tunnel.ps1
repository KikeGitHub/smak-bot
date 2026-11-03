while ($true) {
    Write-Output "Connecting localtunnel on port 8080 (subdomain: great-news-lie)..."
    & npx -p localtunnel lt --port 8080 --subdomain great-news-lie
    Start-Sleep -Seconds 3
}
