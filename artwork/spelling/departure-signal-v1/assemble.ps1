# Asset packaging only. Originals are untouched ImageGen paintings.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$rgba = Join-Path $PSScriptRoot 'rgba'
$magenta = Join-Path $PSScriptRoot 'magenta'
New-Item -ItemType Directory -Force -Path $rgba,$magenta | Out-Null

function Write-Png($name, $width, $height, $paint, $folder = $rgba) {
  $bitmap = [Drawing.Bitmap]::new($width, $height, [Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      & $paint $graphics
    } finally { $graphics.Dispose() }
    $bitmap.Save((Join-Path $folder "$name.png"), [Drawing.Imaging.ImageFormat]::Png)
  } finally { $bitmap.Dispose() }
}
function Place-Png($graphics, $path, $x, $y, $width, $height, $crop = $null) {
  $original = [Drawing.Bitmap]::new($path)
  try {
    if (!$crop) { $crop = [Drawing.RectangleF]::new(0,0,$original.Width,$original.Height) }
    $dest = [Drawing.RectangleF]::new($x,$y,$width,$height)
    $graphics.DrawImage($original,$dest,$crop,[Drawing.GraphicsUnit]::Pixel)
  } finally { $original.Dispose() }
}
function Original($name) { Join-Path $PSScriptRoot "originals/$name.png" }
function Master($name) { Join-Path $rgba "$name.png" }

foreach ($name in 'layer-1-sky','layer-2-background','layer-3-track-and-gantry') {
  Copy-Item -LiteralPath (Original $name) -Destination (Master $name) -Force
}
# Give the gravel and verge real overlap without moving the stage or changing the camera.
Write-Png 'layer-4-foreground' 1536 1024 {
  param($g)
  Place-Png $g (Original 'layer-4-foreground') 0 805 1536 219 ([Drawing.RectangleF]::new(0,820,1536,204))
}
# Preserve the draft train's frame and register the painted arches and roof inside it.
Write-Png 'train-body' 1315 379 {
  param($g)
  Place-Png $g (Original 'train-body') 0 -26.7 1315 420.5
}
# Circular 404px visible rim, with a centered hub for independent rotation.
Write-Png 'wheel' 512 512 {
  param($g)
  Place-Png $g (Original 'wheel') 54 54 404 404 ([Drawing.RectangleF]::new(71,84,1099,1123))
}
$geometry = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'registration.json') -Raw | ConvertFrom-Json
foreach ($state in $geometry.lamps.states.PSObject.Properties) {
  $name = 'lamp-' + $state.Name
  $lamp = $state.Value
  Write-Png $name 512 512 {
    param($g)
    $scale = 142 / $lamp.sourceLensRadius
    Place-Png $g (Original $name) (256 - $lamp.sourceLensCenter[0] * $scale) (286 - $lamp.sourceLensCenter[1] * $scale) ($lamp.sourceSize[0] * $scale) ($lamp.sourceSize[1] * $scale)
  }
}
Copy-Item -LiteralPath (Master 'layer-1-sky') -Destination (Join-Path $magenta 'layer-1-sky.png') -Force
foreach ($name in 'layer-2-background','layer-3-track-and-gantry','layer-4-foreground','train-body','wheel','lamp-unlit','lamp-red','lamp-green') {
  $asset = [Drawing.Bitmap]::new((Master $name))
  $width = $asset.Width
  $height = $asset.Height
  $asset.Dispose()
  Write-Png $name $width $height {
    param($g)
    $g.Clear([Drawing.Color]::Magenta)
    Place-Png $g (Master $name) 0 0 $width $height
  } $magenta
}

# Static composite for approval, using the exact shipping PNGs.
Write-Png 'review-composite' 1536 1024 {
  param($g)
  foreach ($name in 'layer-1-sky','layer-2-background','layer-3-track-and-gantry') {
    Place-Png $g (Master $name) 0 0 1536 1024
  }
  $actor = $geometry.train
  $s = $actor.sceneWidth / $actor.canvas[0]
  $d = $actor.wheelSpriteWidth * $s
  foreach ($wheel in $actor.wheelCenters) {
    Place-Png $g (Master 'wheel') ($actor.sceneOrigin[0] + $wheel[0] * $s - $d/2) ($actor.sceneOrigin[1] + $wheel[1] * $s - $d/2) $d $d
  }
  Place-Png $g (Master 'train-body') $actor.sceneOrigin[0] $actor.sceneOrigin[1] $actor.sceneWidth ($actor.canvas[1] * $s)
  Place-Png $g (Master 'layer-4-foreground') 0 0 1536 1024
} $PSScriptRoot
