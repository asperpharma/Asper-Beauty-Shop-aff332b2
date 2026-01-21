# Luxury Beauty Background Image Prompts

##c Primary Prompt for Hero Section Background

**For Stable Diffusion / Midjourney / DALL-E:**

```
A stunningly beautiful woman's face in profile, elegant and sophisticated, soft focus cinematic photography, muted luxury color palette: warm cream tones (#F3E5DC), subtle gold highlights (#D4AF37), deep burgundy accents (#4A0E19), ambient studio lighting, dramatic side lighting, high fashion beauty editorial style, shallow depth of field, bokeh background, premium cosmetic advertisement aesthetic, ethereal and graceful, minimal makeup with perfect skin, flowing hair subtly visible, soft shadows, professional beauty photography, 8k resolution, shot on medium format camera, golden hour lighting tones, luxury beauty brand aesthetic, elegant and refined, subtle texture overlay, premium magazine quality
```

## Alternative Prompt (More Detailed)

**For AI Image Generators:**

```
Portrait of an elegant beautiful woman in profile view, luxury beauty editorial photography, soft natural lighting from the side, warm cream and gold color grading, subtle burgundy accent lighting, professional beauty shot, high-end cosmetic advertisement style, shallow depth of field with creamy bokeh background, perfect skin texture, minimal elegant makeup, hair flowing gracefully, sophisticated expression, cinematic composition, muted luxury palette: cream #F3E5DC, gold #D4AF37, burgundy #4A0E19, warm tones, ambient studio setting, high fashion beauty magazine aesthetic, ethereal quality, professional retouching, 8k ultra high resolution, shot on Hasselblad medium format, golden hour inspired lighting, luxury brand campaign style, elegant and refined atmosphere
```

## Simplified Prompt (For Quick Generation)

```
Beautiful elegant woman profile portrait, luxury beauty style, cream and gold color palette, soft lighting, high fashion editorial photography, muted tones, sophisticated aesthetic
```

## Styling Guidelines

### Image Specifications:

- **Aspect Ratio:** 16:9 or 21:9 (wide format for hero section)
- **Resolution:** Minimum 3840x2160 (4K), ideally 7680x4320 (8K)
- **Format:** JPG or WebP (optimized)
- **File Size:** Optimized to under 500KB for web performance
- **Placement:** Left or right side of hero (opposite to text content)

### Color Matching:

- **Base Tones:** Warm cream/ivory (#F3E5DC)
- **Highlights:** Subtle gold shimmer (#D4AF37 at 20-30% opacity)
- **Accents:** Deep burgundy hints (#4A0E19 at 10-15% opacity)
- **Overall Tone:** Warm, muted, sophisticated

### Composition:

- **Position:** Profile or 3/4 profile view
- **Focus:** Eyes and face should be sharp
- **Background:** Soft, blurred, with matching color tones
- **Lighting:** Dramatic side lighting creating elegant shadows
- **Mood:** Serene, luxurious, sophisticated, elegant

### Post-Processing Notes:

- Apply subtle sepia filter (20-30%)
- Reduce saturation slightly (60-70%)
- Add warm color grading
- Soft blur on edges (vignette effect)
- Ensure background opacity can be adjusted (8-12% in CSS)

## Integration Instructions

### Step 1: Generate or Prepare Image

Use the prompts above to generate your image, or use a high-quality stock photo.

### Step 2: Save Image

Save the image as: `public/luxury-beauty-background.jpg`

- Format: JPG or WebP
- Recommended size: 3840x2160px (4K) or larger
- File size: Optimize to under 500KB for web

### Step 3: Enable Background (Two Options)

**Option A: Full Page Background (Very Subtle - 3% opacity)**

1. Open `src/index.css`
2. Find `body::before` section (around line 430)
3. Uncomment the `background-image` line
4. The background will appear subtly across the entire website

**Option B: Hero Section Only (More Subtle - 4% opacity)**

1. Open `src/components/ui/animated-shader-hero.tsx`
2. Find the `hero-portrait-background` div (around line 515)
3. The class is already there and will automatically use the image
4. The portrait will only appear in the hero section

### Step 4: Adjust Opacity (Optional)

If you want to make it more or less visible:

- Full page: Adjust `opacity: 0.03` in `src/index.css` (body::before)
- Hero only: Adjust `opacity: 0.04` in `src/index.css`
  (.hero-portrait-background)

### Current Settings:

- **Full page background**: 3% opacity (very subtle, elegant texture)
- **Hero background**: 4% opacity (slightly more visible on hero)
- **Color filters**: Sepia, saturation, and brightness adjusted to match palette
- **Blend mode**: Multiply for seamless integration

## Alternative: Use Stock Photo

If generating AI images is not possible, search for stock photos with these
keywords:

- "beautiful woman profile portrait luxury beauty"
- "elegant female portrait warm tones editorial"
- "cosmetic beauty model profile warm lighting"
- "luxury beauty campaign portrait cream gold"

Apply the same color grading and filters as specified above.
