# PowerShell Deployment Script for GitHub Pages
# This script copies the latest changes from client folder to docs folder

Write-Host "🚀 Starting deployment to docs folder..." -ForegroundColor Green

# Set source and destination directories
$SourceDir = "."
$DocsDir = "./docs"

# Create docs directory if it doesn't exist
if (!(Test-Path $DocsDir)) {
    New-Item -ItemType Directory -Path $DocsDir -Force | Out-Null
    Write-Host "📁 Created docs directory" -ForegroundColor Yellow
}

try {
    # Copy HTML files
    Write-Host "📄 Copying HTML files..." -ForegroundColor Cyan
    Get-ChildItem -Path "$SourceDir\*.html" -ErrorAction SilentlyContinue | Copy-Item -Destination $DocsDir -Force
    
    # Copy root files
    Write-Host "📋 Copying configuration files..." -ForegroundColor Cyan
    @("*.json", "*.txt", "*.xml", "sw.js", ".htaccess") | ForEach-Object {
        Get-ChildItem -Path "$SourceDir\$_" -ErrorAction SilentlyContinue | Copy-Item -Destination $DocsDir -Force
    }
    
    # Copy directories
    Write-Host "📂 Copying directories..." -ForegroundColor Cyan
    
    $directories = @("js", "styles", "data", "assets", "images", "icons")
    
    foreach ($dir in $directories) {
        if (Test-Path "$SourceDir\$dir") {
            # Remove existing directory in docs if it exists
            if (Test-Path "$DocsDir\$dir") {
                Remove-Item "$DocsDir\$dir" -Recurse -Force
            }
            # Copy directory
            Copy-Item -Path "$SourceDir\$dir" -Destination $DocsDir -Recurse -Force
            Write-Host "✅ Copied $dir directory" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $dir directory not found" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "🎉 Deployment complete!" -ForegroundColor Green
    Write-Host "📁 Files copied to: $DocsDir" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Commit and push changes to GitHub" -ForegroundColor White
    Write-Host "2. Enable GitHub Pages in repository settings" -ForegroundColor White
    Write-Host "3. Select 'main branch /docs folder' as source" -ForegroundColor White
    Write-Host "4. Your site will be available at: https://[username].github.io/[repository]/" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ Error during deployment: $($_.Exception.Message)" -ForegroundColor Red
}

# Pause to allow user to read the output
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")