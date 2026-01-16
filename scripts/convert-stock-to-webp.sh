#!/bin/bash
# Convert stock images (JPG) to WebP format

INPUT_DIR="attached_assets/stock_images"
OUTPUT_DIR="attached_assets/stock_images_webp"

mkdir -p "$OUTPUT_DIR"

QUALITY=80

echo "Converting stock JPG to WebP..."

total_before=0
total_after=0

for jpg in "$INPUT_DIR"/*.jpg; do
    if [ -f "$jpg" ]; then
        filename=$(basename "$jpg" .jpg)
        webp="$OUTPUT_DIR/${filename}.webp"

        size_before=$(stat -f%z "$jpg" 2>/dev/null || stat -c%s "$jpg")
        cwebp -q $QUALITY -resize 1200 0 "$jpg" -o "$webp" 2>/dev/null
        size_after=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp")

        reduction=$(echo "scale=1; (1 - $size_after / $size_before) * 100" | bc)
        size_before_kb=$((size_before / 1024))
        size_after_kb=$((size_after / 1024))

        total_before=$((total_before + size_before))
        total_after=$((total_after + size_after))

        echo "✓ $filename: ${size_before_kb}KB → ${size_after_kb}KB (-${reduction}%)"
    fi
done

total_before_mb=$(echo "scale=2; $total_before / 1048576" | bc)
total_after_mb=$(echo "scale=2; $total_after / 1048576" | bc)
total_reduction=$(echo "scale=1; (1 - $total_after / $total_before) * 100" | bc)

echo ""
echo "=========================================="
echo "TOTAL: ${total_before_mb}MB → ${total_after_mb}MB (-${total_reduction}%)"
echo "=========================================="
