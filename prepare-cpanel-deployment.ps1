# Deploy to cPanel - Preparation Script
# This script creates a ZIP file ready for cPanel upload

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  cPanel Deployment Package Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set paths
$projectRoot = $PSScriptRoot
$distFolder = Join-Path $projectRoot "dist"
$htaccessSource = Join-Path $projectRoot ".htaccess"
$deploymentZip = Join-Path $projectRoot "cpanel-deployment.zip"

# Check if dist folder exists
if (-Not (Test-Path $distFolder)) {
    Write-Host "❌ Error: 'dist' folder not found!" -ForegroundColor Red
    Write-Host "   Please run 'npm run build' first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found dist folder" -ForegroundColor Green

# Check if .htaccess exists
if (-Not (Test-Path $htaccessSource)) {
    Write-Host "⚠️  Warning: .htaccess file not found!" -ForegroundColor Yellow
    Write-Host "   The deployment will work but without URL rewriting." -ForegroundColor Yellow
} else {
    Write-Host "✅ Found .htaccess file" -ForegroundColor Green
    
    # Copy .htaccess to dist folder
    Copy-Item $htaccessSource -Destination $distFolder -Force
    Write-Host "✅ Copied .htaccess to dist folder" -ForegroundColor Green
}

# Remove old deployment zip if exists
if (Test-Path $deploymentZip) {
    Remove-Item $deploymentZip -Force
    Write-Host "🗑️  Removed old deployment package" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan

# Create ZIP file
try {
    Compress-Archive -Path "$distFolder\*" -DestinationPath $deploymentZip -Force
    Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Location: $deploymentZip" -ForegroundColor White
    Write-Host ""
    
    # Get file size
    $zipSize = (Get-Item $deploymentZip).Length / 1MB
    Write-Host "📊 Package size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Next Steps:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "1. Login to your cPanel" -ForegroundColor White
    Write-Host "2. Open File Manager" -ForegroundColor White
    Write-Host "3. Navigate to public_html" -ForegroundColor White
    Write-Host "4. Upload cpanel-deployment.zip" -ForegroundColor White
    Write-Host "5. Right-click → Extract" -ForegroundColor White
    Write-Host "6. Delete the ZIP file after extraction" -ForegroundColor White
    Write-Host "7. Visit your domain to test!" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 For detailed instructions, see CPANEL_DEPLOYMENT.md" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ Error creating deployment package: $_" -ForegroundColor Red
    exit 1
}

Write-Host "✨ Done! Your site is ready for deployment." -ForegroundColor Green
Write-Host ""
