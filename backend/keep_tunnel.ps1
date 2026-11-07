while ($true) {
    Write-Output "Connecting localtunnel on port 8080 (subdomain: great-news-lie)..."
    npx localtunnel --port 8080 --subdomain great-news-lie
    Start-Sleep -Seconds 3
}
