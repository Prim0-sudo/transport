# Makes web-sized JPEG copies of the full-size teaching originals.
# Originals stay in artwork/originals (not committed); runtime copies go to site/dist/images.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/make-runtime-images.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$jobs = @(
  @{ From = 'artwork/originals/vocabulary'; To = 'site/dist/images/vocabulary'; Max = 900 },
  @{ From = 'artwork/originals/teaching-scenes'; To = 'site/dist/images/teaching-scenes'; Max = 1600 }
)
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 84L
foreach ($job in $jobs) {
  $from = Join-Path $root $job.From; $to = Join-Path $root $job.To
  New-Item -ItemType Directory -Force $to | Out-Null
  foreach ($file in Get-ChildItem $from -Filter *.png) {
    $out = Join-Path $to ($file.BaseName + '.jpg')
    if ((Test-Path $out) -and (Get-Item $out).LastWriteTime -gt $file.LastWriteTime) { continue }
    $src = [System.Drawing.Image]::FromFile($file.FullName)
    try {
      $scale = [Math]::Min(1, $job.Max / [Math]::Max($src.Width, $src.Height))
      $w = [int][Math]::Round($src.Width * $scale); $h = [int][Math]::Round($src.Height * $scale)
      $bmp = New-Object System.Drawing.Bitmap $w, $h
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($src, 0, 0, $w, $h)
      $bmp.Save($out, $codec, $params)
      $g.Dispose(); $bmp.Dispose()
    } finally { $src.Dispose() }
  }
}
Write-Output 'Runtime images are up to date.'
