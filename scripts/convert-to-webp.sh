#!/bin/bash
# Convert all PNG images to WebP format with optimized size

INPUT_DIR="attached_assets/generated_images"
OUTPUT_DIR="attached_assets/generated_images_webp"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Quality setting (0-100, 80 is good balance of quality/size)
QUALITY=80

echo "Converting PNG to WebP..."
echo "Input: $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

total_before=0
total_after=0

for png in "$INPUT_DIR"/*.png; do
    if [ -f "$png" ]; then
        filename=$(basename "$png" .png)
        webp="$OUTPUT_DIR/${filename}.webp"

        # Get original size
        size_before=$(stat -f%z "$png" 2>/dev/null || stat -c%s "$png")

        # Convert to WebP
        cwebp -q $QUALITY -resize 1200 0 "$png" -o "$webp" 2>/dev/null

        # Get new size
        size_after=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp")

        # Calculate reduction
        reduction=$(echo "scale=1; (1 - $size_after / $size_before) * 100" | bc)

        size_before_kb=$((size_before / 1024))
        size_after_kb=$((size_after / 1024))

        total_before=$((total_before + size_before))
        total_after=$((total_after + size_after))

        echo "✓ $filename: ${size_before_kb}KB → ${size_after_kb}KB (-${reduction}%)"
    fi
done

# Also convert stock_images if exists
STOCK_DIR="attached_assets/stock_images"
STOCK_OUTPUT="attached_assets/stock_images_webp"

if [ -d "$STOCK_DIR" ]; then
    mkdir -p "$STOCK_OUTPUT"
    echo ""
    echo "Converting stock images..."

    for png in "$STOCK_DIR"/*.png; do
        if [ -f "$png" ]; then
            filename=$(basename "$png" .png)
            webp="$STOCK_OUTPUT/${filename}.webp"

            size_before=$(stat -f%z "$png" 2>/dev/null || stat -c%s "$png")
            cwebp -q $QUALITY -resize 1200 0 "$png" -o "$webp" 2>/dev/null
            size_after=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp")

            reduction=$(echo "scale=1; (1 - $size_after / $size_before) * 100" | bc)
            size_before_kb=$((size_before / 1024))
            size_after_kb=$((size_after / 1024))

            total_before=$((total_before + size_before))
            total_after=$((total_after + size_after))

            echo "✓ $filename: ${size_before_kb}KB → ${size_after_kb}KB (-${reduction}%)"
        fi
    done
fi

# Summary
total_before_mb=$(echo "scale=2; $total_before / 1048576" | bc)
total_after_mb=$(echo "scale=2; $total_after / 1048576" | bc)
total_reduction=$(echo "scale=1; (1 - $total_after / $total_before) * 100" | bc)

echo ""
echo "=========================================="
echo "TOTAL: ${total_before_mb}MB → ${total_after_mb}MB (-${total_reduction}%)"
echo "=========================================="
