# Package generated originals with measured registration. This does not touch the app.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$rgba = Join-Path $PSScriptRoot 'rgba'
New-Item -ItemType Directory -Force -Path $rgba | Out-Null
$data = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'registration.json') | ConvertFrom-Json

function Original($name) { Join-Path $PSScriptRoot "originals/$name.png" }
function Master($name) { Join-Path $rgba "$name.png" }
function Paint($graphics, $path, $dest, $crop) {
  $image = [Drawing.Bitmap]::new($path)
  try {
    if (!$crop) { $crop = @(0,0,$image.Width,$image.Height) }
    $from = [Drawing.RectangleF]::new($crop[0],$crop[1],$crop[2],$crop[3])
    $to = [Drawing.RectangleF]::new($dest[0],$dest[1],$dest[2],$dest[3])
    $graphics.DrawImage($image,$to,$from,[Drawing.GraphicsUnit]::Pixel)
  } finally { $image.Dispose() }
}
function Render($path, $size, $draw) {
  $bitmap = [Drawing.Bitmap]::new($size[0],$size[1],[Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    $g = [Drawing.Graphics]::FromImage($bitmap)
    try {
      $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
      & $draw $g
    } finally { $g.Dispose() }
    $bitmap.Save($path,[Drawing.Imaging.ImageFormat]::Png)
  } finally { $bitmap.Dispose() }
}
foreach ($item in $data.packaging.PSObject.Properties) {
  $name = $item.Name
  $frame = $item.Value
  if ($frame.copy) {
    Copy-Item -LiteralPath (Original $name) -Destination (Master $name) -Force
  } else {
    Render (Master $name) $frame.size {
      param($g)
      Paint $g (Original $name) $frame.destinationRect $frame.sourceRect
    }
  }
}

$lamps = $data.lamps
$actor = $data.train
$s = $actor.sceneWidth / $actor.canvas[0]
$d = $actor.wheelSpriteWidth * $s
$frame = @(0,0,$data.canvas[0],$data.canvas[1])
$stage = 'layer-3-track-and-gantry'
$unlit = 'lamp-unlit'
$lampScale = $lamps.lensDiameter / (2 * $lamps.spriteLensRadius)
$lampSize = 512 * $lampScale
$lx, $ly = $lamps.spriteLensCenter
Render (Master $stage) $data.canvas {
  param($g)
  Paint $g (Original $stage) $frame
  if ($lamps.mountUnlitOnStage) {
    foreach ($center in $lamps.centers) {
      Paint $g (Master $unlit) @(
        ($center[0] - $lx * $lampScale), ($center[1] - $ly * $lampScale), $lampSize, $lampSize
      )
    }
  }
}

Render (Join-Path $PSScriptRoot 'review-composite.png') $data.canvas {
  param($g)
  foreach ($plane in 'layer-1-sky','layer-2-background',$stage) {
    Paint $g (Master $plane) $frame
  }
  foreach ($wheel in $actor.wheelCenters) {
    Paint $g (Master 'wheel') @(
      ($actor.sceneOrigin[0] + $wheel[0] * $s - $d/2),
      ($actor.sceneOrigin[1] + $wheel[1] * $s - $d/2), $d, $d
    )
  }
  Paint $g (Master 'train-body') @($actor.sceneOrigin[0],$actor.sceneOrigin[1],$actor.sceneWidth,($actor.canvas[1] * $s))
  foreach ($center in $lamps.centers) {
    $clip = [Drawing.Drawing2D.GraphicsPath]::new()
    $saved = $g.Save()
    try {
      $diameter = $lamps.lensDiameter
      $clip.AddEllipse([Drawing.RectangleF]::new(($center[0] - $diameter/2),($center[1] - $diameter/2),$diameter,$diameter))
      $g.SetClip($clip)
      Paint $g (Master 'lamp-green') @(
        ($center[0] - $lx * $lampScale), ($center[1] - $ly * $lampScale), $lampSize, $lampSize
      )
    } finally {
      $g.Restore($saved)
      $clip.Dispose()
    }
  }
  Paint $g (Master 'layer-4-foreground') $frame
}
