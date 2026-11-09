# Builds the four A4 picture-flashcard layouts (1, 2, 4 and 8 per sheet) for every word group,
# following the Plants blueprint layouts. Windows built-ins only: no network, no extra installs.
# Usage:
#   node scripts/export-printable-source.mjs <source.json>
#   powershell -ExecutionPolicy Bypass -File scripts/create-flashcards.ps1 -Source <source.json>
param([Parameter(Mandatory=$true)][string]$Source)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Text;

public static class Flashcards {
  static readonly Color Band = Color.FromArgb(29, 79, 115);   // Transport navy
  static readonly Color Gold = Color.FromArgb(216, 189, 125);  // Transport gold border
  static readonly Dictionary<string, byte[]> cards = new Dictionary<string, byte[]>();
  static ImageCodecInfo jpeg;

  static GraphicsPath Rounded(RectangleF r, float radius) {
    var p = new GraphicsPath(); float d = radius * 2;
    p.AddArc(r.X, r.Y, d, d, 180, 90); p.AddArc(r.Right - d, r.Y, d, d, 270, 90);
    p.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90); p.AddArc(r.X, r.Bottom - d, d, d, 90, 90);
    p.CloseFigure(); return p;
  }

  // One card as a JPEG at the given size in points and resolution.
  public static byte[] Card(string id, string name, string image, double wPt, double hPt, int dpi) {
    string key = id + "|" + wPt.ToString("F1") + "|" + hPt.ToString("F1");
    if (cards.ContainsKey(key)) return cards[key];
    double s = dpi / 72.0; int w = (int)Math.Round(wPt * s), h = (int)Math.Round(hPt * s);
    using (var bmp = new Bitmap(w, h))
    using (var g = Graphics.FromImage(bmp)) {
      g.SmoothingMode = SmoothingMode.AntiAlias; g.InterpolationMode = InterpolationMode.HighQualityBicubic;
      g.PixelOffsetMode = PixelOffsetMode.HighQuality; g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
      g.Clear(Color.White);
      float frame = (float)(5 * s);
      var r = new RectangleF(frame, frame, w - 2 * frame, h - 2 * frame);
      float radius = (float)Math.Min(13 * s, r.Width * .055);
      float band = (float)Math.Max(32 * s, Math.Min(86 * s, r.Height * .16));
      using (var path = Rounded(r, radius)) {
        g.SetClip(path);
        using (var b = new SolidBrush(Band)) g.FillRectangle(b, r.X, r.Y, r.Width, band);
        g.ResetClip();
        using (var pen = new Pen(Band, (float)((wPt > 240 ? 2.4 : 2) * s))) g.DrawPath(pen, path);
      }
      using (var pen = new Pen(Gold, (float)(1.4 * s))) g.DrawLine(pen, r.X, r.Y + band, r.Right, r.Y + band);
      // Word, as large as the band and card width allow.
      float size = (float)Math.Min(Math.Min(52 * s, band * .54), r.Width * .14);
      using (var probe = new Font("Arial", size, FontStyle.Bold, GraphicsUnit.Pixel)) {
        float measured = g.MeasureString(name, probe).Width;
        if (measured > r.Width - 24 * s) size *= (float)((r.Width - 24 * s) / measured);
      }
      using (var font = new Font("Arial", size, FontStyle.Bold, GraphicsUnit.Pixel))
      using (var fmt = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
        g.DrawString(name, font, Brushes.White, new RectangleF(r.X, r.Y, r.Width, band), fmt);
      // Picture, kept whole and centred below the band.
      using (var pic = Image.FromFile(image)) {
        float top = r.Y + band + (float)(12 * s), bottom = r.Bottom - (float)(14 * s);
        float availW = r.Width - (float)(22 * s), availH = bottom - top;
        float scale = Math.Min(availW / pic.Width, availH / pic.Height);
        float dw = pic.Width * scale, dh = pic.Height * scale;
        g.DrawImage(pic, r.X + (r.Width - dw) / 2, top + (availH - dh) / 2, dw, dh);
      }
      if (jpeg == null) foreach (var c in ImageCodecInfo.GetImageEncoders()) if (c.MimeType == "image/jpeg") jpeg = c;
      var ep = new EncoderParameters(1); ep.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 86L);
      using (var ms = new MemoryStream()) { bmp.Save(ms, jpeg, ep); cards[key] = ms.ToArray(); }
      return cards[key];
    }
  }

  static string N(double v) { return v.ToString("0.###", CultureInfo.InvariantCulture); }

  // Minimal PDF: one JPEG XObject per card, vector cut guides, print scaling off.
  public static int Pack(string outPath, string title, string subject, string[] ids, string[] names, string[] images, int count) {
    int columns = count == 8 ? 4 : count == 4 ? 2 : 1, rows = count == 1 ? 1 : 2;
    bool land = count == 8;
    double W = land ? 841.89 : 595.28, H = land ? 595.28 : 841.89;
    double mm = 72 / 25.4, margin = 7 * mm, gutter = (count == 2 ? 14 : 4) * mm;
    double cw = (W - 2 * margin - (columns - 1) * gutter) / columns, ch = (H - 2 * margin - (rows - 1) * gutter) / rows;
    int dpi = count == 1 ? 120 : count == 2 ? 140 : count == 4 ? 160 : 180;
    var objects = new List<byte[]>();
    Func<string, int> add = text => { objects.Add(Encoding.ASCII.GetBytes(text)); return objects.Count; };
    var pageIds = new List<int>();
    int pagesId = 2; objects.Add(null); objects.Add(null); // 1 catalog, 2 pages
    int pages = 0;
    for (int start = 0; start < ids.Length; start += count) {
      pages++;
      var content = new StringBuilder(); var resources = new StringBuilder();
      for (int i = 0; i < count && start + i < ids.Length; i++) {
        int k = start + i, row = i / columns, col = i % columns;
        double x = margin + col * (cw + gutter), y = H - margin - ch - row * (ch + gutter);
        byte[] jpg = Card(ids[k], names[k], images[k], cw, ch, dpi);
        int pw, ph; using (var ms = new MemoryStream(jpg)) using (var im = Image.FromStream(ms)) { pw = im.Width; ph = im.Height; }
        var head = Encoding.ASCII.GetBytes("<< /Type /XObject /Subtype /Image /Width " + pw + " /Height " + ph + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpg.Length + " >>\nstream\n");
        var tail = Encoding.ASCII.GetBytes("\nendstream");
        var obj = new byte[head.Length + jpg.Length + tail.Length];
        Buffer.BlockCopy(head, 0, obj, 0, head.Length); Buffer.BlockCopy(jpg, 0, obj, head.Length, jpg.Length); Buffer.BlockCopy(tail, 0, obj, head.Length + jpg.Length, tail.Length);
        objects.Add(obj); int imgId = objects.Count;
        resources.Append("/C" + i + " " + imgId + " 0 R ");
        content.Append("q " + N(cw) + " 0 0 " + N(ch) + " " + N(x) + " " + N(y) + " cm /C" + i + " Do Q\n");
        if (count >= 4) content.Append("q 0.41 0.46 0.41 RG 0.45 w [3 2] 0 d " + N(x) + " " + N(y) + " " + N(cw) + " " + N(ch) + " re S Q\n");
      }
      if (count == 2) content.Append("q 0.41 0.46 0.41 RG 0.65 w [4 3] 0 d " + N(margin) + " " + N(H / 2) + " m " + N(W - margin) + " " + N(H / 2) + " l S Q\n");
      string stream = content.ToString();
      int contentId = add("<< /Length " + stream.Length + " >>\nstream\n" + stream + "endstream");
      pageIds.Add(add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + N(W) + " " + N(H) + "] /Resources << /XObject << " + resources + ">> >> /Contents " + contentId + " 0 R >>"));
    }
    objects[0] = Encoding.ASCII.GetBytes("<< /Type /Catalog /Pages 2 0 R /ViewerPreferences << /PrintScaling /None >> >>");
    var kids = new StringBuilder(); foreach (int id in pageIds) kids.Append(id + " 0 R ");
    objects[pagesId - 1] = Encoding.ASCII.GetBytes("<< /Type /Pages /Kids [" + kids + "] /Count " + pageIds.Count + " >>");
    Func<string, string> esc = t => t.Replace("\\", "\\\\").Replace("(", "\\(").Replace(")", "\\)");
    int infoId = add("<< /Title (" + esc(title) + ") /Author (Transport learning collection) /Subject (" + esc(subject) + ") >>");
    using (var fs = new FileStream(outPath, FileMode.Create)) {
      var offsets = new List<long>();
      Action<string> write = t => { var b = Encoding.ASCII.GetBytes(t); fs.Write(b, 0, b.Length); };
      write("%PDF-1.4\n%âãÏÓ\n");
      for (int i = 0; i < objects.Count; i++) { offsets.Add(fs.Position); write((i + 1) + " 0 obj\n"); fs.Write(objects[i], 0, objects[i].Length); write("\nendobj\n"); }
      long xref = fs.Position;
      write("xref\n0 " + (objects.Count + 1) + "\n0000000000 65535 f \n");
      foreach (long o in offsets) write(o.ToString("D10") + " 00000 n \n");
      write("trailer\n<< /Size " + (objects.Count + 1) + " /Root 1 0 R /Info " + infoId + " 0 R >>\nstartxref\n" + xref + "\n%%EOF\n");
    }
    return pages;
  }
}
'@
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -Raw -Encoding UTF8 $Source | ConvertFrom-Json
$out = Join-Path $root 'site/dist/printables'
New-Item -ItemType Directory -Force $out | Out-Null
Get-ChildItem $out -Filter 'transport-flashcards-*.pdf' | Remove-Item
$instructions = @{ 1 = 'Print the full A4 sheet at actual size.'; 2 = 'Print at actual size and cut along the dashed midpoint.'; 4 = 'Print at actual size and trim along the dashed card edges.'; 8 = 'Print at actual size and trim along the dashed card edges.' }
$scopes = @([pscustomobject]@{ id = 'all'; label = 'All Transport words' }) + @($data.categories)
$packs = foreach ($count in 1, 2, 4, 8) {
  foreach ($scope in $scopes) {
    $words = @($data.words | Where-Object { $scope.id -eq 'all' -or $_.categoryId -eq $scope.id })
    $file = "transport-flashcards-$($scope.id)-a4-$count.pdf"
    $pages = [Flashcards]::Pack((Join-Path $out $file), "Transport flashcards - $($scope.label) - $count per A4 sheet", $instructions[$count], [string[]]($words.id), [string[]]($words.name), [string[]]($words.image), $count)
    [ordered]@{ scopeId = $scope.id; title = $scope.label; cardsPerSheet = $count; paper = 'A4'; orientation = $(if ($count -eq 8) { 'landscape' } else { 'portrait' }); wordCount = $words.Count; pageCount = $pages; bytes = (Get-Item (Join-Path $out $file)).Length; path = "printables/$file" }
  }
}
$json = $packs | ConvertTo-Json -Depth 4
$manifest = "// Generated by scripts/create-flashcards.ps1 from content $($data.contentHash.Substring(0,12)).`nglobalThis.TransportFlashcards = $json;`n"
[System.IO.File]::WriteAllText((Join-Path $out 'flashcards.js'), $manifest, (New-Object System.Text.UTF8Encoding $false))
Write-Output "Created $(@($packs).Count) A4 flashcard packs."
