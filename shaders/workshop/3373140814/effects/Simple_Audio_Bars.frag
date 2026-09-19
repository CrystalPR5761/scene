
attribute vec2 a_TexCoord;

varying vec4 v_TexCoord;

uniform vec4 g_Texture0Resolution;

#if MASK
uniform vec4 g_Texture2Resolution;
varying vec2 v_TexCoordMask;
#endif

void main() {
#if VERTICAL
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
#else
	gl_Position = vec4(a_Position, 1.0);
#endif
	
	v_TexCoord.xy = a_TexCoord;
	
#if VERTICAL
	v_TexCoord.z = 0;
	v_TexCoord.w = g_Scale.y / g_Texture0Resolution.w;
#else
	v_TexCoord.z = g_Scale.x / g_Texture0Resolution.z;
	v_TexCoord.w = 0;
#endif

#if MASK
	v_TexCoordMask.xy = vec2(v_TexCoord.x * g_Texture2Resolution.z / g_Texture2Resolution.x,
						v_TexCoord.y * g_Texture2Resolution.w / g_Texture2Resolution.y);
#endif
}
{
	"passes" : 
	[
		{
			"blending" : "normal",
			"cullmode" : "nocull",
			"depthtest" : "disabled",
			"depthwrite" : "disabled",
			"shader" : "workshop/3732231168/effects/blur_precise_gaussian"
		}
	]
}uniform mat4 g_ModelViewProjectionMatrix;

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

void main() {
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);

	v_TexCoord = a_TexCoord;
}

// [COMBO] {"material":"ui_editor_properties_blur_alpha","combo":"BLURALPHA","type":"options","default":1}

#include "common_blur.h"

varying vec4 v_TexCoord;

uniform sampler2D g_Texture0; // {"hidden":true}
uniform sampler2D g_Texture1; // {"hidden":true}
uniform sampler2D g_Texture2; // {"label":"ui_editor_properties_opacity_mask","mode":"opacitymask","combo":"MASK","paintdefaultcolor":"0 0 0 1","require":{"ENABLEMASK":1}}

#if MASK
varying vec2 v_TexCoordMask;
#endif

void main() {
#if KERNEL == 0
	vec4 albedo = blur13a(v_TexCoord.xy, v_TexCoord.zw);
#endif
#if KERNEL == 1
	vec4 albedo = blur7a(v_TexCoord.xy, v_TexCoord.zw);
#endif
#if KERNEL == 2
	vec4 albedo = blur3a(v_TexCoord.xy, v_TexCoord.zw);
#endif

#if MASK || BLURALPHA == 0
	vec4 prev = texSample2D(g_Texture1, v_TexCoord.xy);
#endif

#if MASK
	albedo = mix(prev, albedo, texSample2D(g_Texture2, v_TexCoordMask.xy).r);
#endif

#if BLURALPHA == 0
	albedo.a = prev.a;
#endif

	gl_FragColor = albedo;
}
{
	"height" : 485,
	"material" : "materials/workshop/2927204211/1962955_3b845.json",
	"nopadding" : true,
	"width" : 380
}{
	"passes" : 
	[
		{
			"blending" : "normal",
			"combos" : 
			{
				"ENABLEMASK" : 1,
				"VERTICAL" : 1
			},
			"cullmode" : "nocull",
			"depthtest" : "disabled",
			"depthwrite" : "disabled",
			"shader" : "workshop/3732231168/effects/blur_precise_gaussian"
		}
	]
}// [COMBO] {"material":"Position","combo":"SHAPE","type":"options","default":0,"options":{"Bottom":0,"Top":1,"Left":2,"Right":3,"Circle - Inner":4,"Circle - Outer":5,"Center - L/R":6,"Center - U/D":7,"Stereo - L/R":8,"Stereo - U/D":9}}
// [COMBO] {"material":"Transparency","combo":"TRANSPARENCY","type":"options","default":1,"options":{"Preserve original":0,"Replace original":1,"Add to original":2,"Subtract from original":3,"Intersect original":4,"Fully opaque":5}}
// [COMBO] {"material":"Frequency Resolution","combo":"RESOLUTION","type":"options","default":32,"options":{"16":16,"32":32,"64":64}}
// [COMBO] {"material":"ui_editor_properties_blend_mode","combo":"BLENDMODE","type":"imageblending","default":0}
// [COMBO] {"material":"Smooth curve","combo":"A_SMOOTH_CURVE","type":"options","default":0}
// [COMBO] {"material":"Anti-aliasing","combo":"ANTIALIAS","type":"options","default":0}
// [COMBO] {"material":"Hide Below Lower Bounds","combo":"CLIP_LOW","type":"options","default":0}
// [COMBO] {"material":"Hide Above Upper Bounds","combo":"CLIP_HIGH","type":"options","default":0}

#include "common.h"
#include "common_blending.h"

#define DEG2RAD 2 * M_PI / 360.0
#define DEG2PCT 1 / 360.0

// Same as GLSL's modulo function. Return value's sign is equivalent to the y value's sign.
float mod2(float x, float y) { return x - y * floor(x/y); }

varying vec2 v_TexCoord;

uniform float u_BarCount; // {"material":"Bar Count","default":32,"range":[1, 200]}
uniform vec2 u_BarBounds; // {"default":"0.0, 1.0","linked":true,"material":"Lower/Upper Bar Bounds","range":[0,1]}
uniform vec2 u_CircleAngles; // {"default":"0.0, 360.0","linked":true,"material":"Circle Start/End Angles","range":[0,360]}
uniform vec3 u_BarColor; // {"default":"1 1 1","material":"Bar Color","type":"color"}
uniform float u_BarOpacity; // {"default":"1","material":"ui_editor_properties_opacity"}
uniform float u_BarSpacing; // {"default":"0.1","material":"Bar Spacing"}
uniform vec2 u_AASmoothness; // {"default":"0.02, 0.02","linked":true,"material":"Anti-alias blurring","range":[0.01,0.1]}


uniform sampler2D g_Texture0; // {"material":"previous","label":"Prev","hidden":true}


#if RESOLUTION == 16
uniform float g_AudioSpectrum16Left[16];
uniform float g_AudioSpectrum16Right[16];
#endif

#if RESOLUTION == 32
uniform float g_AudioSpectrum32Left[32];
uniform float g_AudioSpectrum32Right[32];
#endif

#if RESOLUTION == 64
uniform float g_AudioSpectrum64Left[64];
uniform float g_AudioSpectrum64Right[64];
#endif



// Position
#define BOTTOM 0
#define TOP 1
#define LEFT 2
#define RIGHT 3
#define CIRCLE_INNER 4
#define CIRCLE_OUTER 5
#define CENTER_H 6
#define CENTER_V 7
#define STEREO_H 8
#define STEREO_V 9


// Transparency
#define PRESERVE 0
#define REPLACE 1
#define ADD 2
#define SUBTRACT 3
#define INTERSECT 4
#define REMOVE 5







void main() {
	
	// Define the audio sample arrays
#if RESOLUTION == 16
#define u_AudioSpectrumLeft g_AudioSpectrum16Left
#define u_AudioSpectrumRight g_AudioSpectrum16Right
#endif
#if RESOLUTION == 32
#define u_AudioSpectrumLeft g_AudioSpectrum32Left
#define u_AudioSpectrumRight g_AudioSpectrum32Right
#endif
#if RESOLUTION == 64
#define u_AudioSpectrumLeft g_AudioSpectrum64Left
#define u_AudioSpectrumRight g_AudioSpectrum64Right
#endif



	// Map the coordinates to the selected shape
#if SHAPE == BOTTOM
	vec2 shapeCoord = v_TexCoord;
#endif
#if SHAPE == TOP
	vec2 shapeCoord = v_TexCoord;
	shapeCoord.y = 1 - shapeCoord.y;
#endif
#if SHAPE == LEFT
	vec2 shapeCoord = v_TexCoord.yx;
	shapeCoord.y = 1 - shapeCoord.y;
#endif
#if SHAPE == RIGHT
	vec2 shapeCoord = v_TexCoord.yx;
#endif
#if SHAPE == CENTER_H
	vec2 shapeCoord = v_TexCoord.yx;
	shapeCoord.y = frac(0.5 - shapeCoord.y);
#endif
#if SHAPE == CENTER_V
	vec2 shapeCoord = v_TexCoord.xy;
	shapeCoord.y = frac(0.5 - shapeCoord.y);
#endif
#if SHAPE == STEREO_H
	vec2 shapeCoord = v_TexCoord.yx;
#endif
#if SHAPE == STEREO_V
	vec2 shapeCoord = v_TexCoord.xy;
#endif
#if SHAPE == CIRCLE_INNER || SHAPE == CIRCLE_OUTER
	vec2 circleCoord = (v_TexCoord - 0.5) * 2;
	vec2 shapeCoord;
	float startAngle = u_CircleAngles.x * DEG2PCT;
	float endAngle = u_CircleAngles.y * DEG2PCT;
	shapeCoord.x = (atan2(circleCoord.y, circleCoord.x) + M_PI) / M_PI_2;
	// Shift to start angle
	shapeCoord.x = mod2(shapeCoord.x - min(startAngle, endAngle), 1.0);
	// Scale to area between start and end angles
	// y = 1 / (abs((x - 1) % 4 - 2) - 1)
	shapeCoord.x = shapeCoord.x / (abs(mod2(endAngle - startAngle - 1.0, 4.0) - 2.0) - 1.0);
	// Keep coordinates in 
	shapeCoord.x += endAngle - startAngle < 0.0;
	shapeCoord.y = sqrt(circleCoord.x * circleCoord.x + circleCoord.y * circleCoord.y);
#if SHAPE == CIRCLE_INNER
	shapeCoord.y = 1.0 - shapeCoord.y;
#endif
#endif



	// Get the frequency for this pixel, ie where we will sample from in the audio spectrum array. 0 == lowest frequency, RESOLUTION == highest frequency.
#if A_SMOOTH_CURVE == 1
	float frequency = shapeCoord.x * RESOLUTION;
#else
	// BarDist == How far this pixel is from the center of the bar that it belongs to. 0 = right in the middle, 1 = right on the edge.
	float barDist = abs(frac(shapeCoord.x * u_BarCount) * 2 - 1);
	float frequency = floor(shapeCoord.x * u_BarCount) / u_BarCount * RESOLUTION;
#endif
	uint barFreq1 = frequency % RESOLUTION;
	uint barFreq2 = (barFreq1 + 1) % RESOLUTION;


	
	// Get the height of the bar
// STEREO ****** STEREO ****** STEREO ****** STEREO ****** STEREO ****** STEREO ****** STEREO ****** STEREO ****** STEREO ****** STEREO ******
#if SHAPE == STEREO_H || SHAPE == STEREO_V || SHAPE == CENTER_H || SHAPE == CENTER_V
	float barVolume1L = u_AudioSpectrumLeft[barFreq1];
	float barVolume2L = u_AudioSpectrumLeft[barFreq2];
	float barVolume1R = u_AudioSpectrumRight[barFreq1];
	float barVolume2R = u_AudioSpectrumRight[barFreq2];
	float barVolumeLeft = lerp(barVolume1L, barVolume2L, smoothstep(0, 1, frac(frequency)));
	float barVolumeRight = lerp(barVolume1R, barVolume2R, smoothstep(0, 1, frac(frequency)));

	bool isLeftChannel = shapeCoord.y < 0.49;
	bool isRightChannel = shapeCoord.y > 0.51;
	
	// bar = 1 if this pixel is inside a bar, 0 if outside
	float barHeightLeft = 0.5 * lerp(u_BarBounds.x, u_BarBounds.y, barVolumeLeft);
	float barHeightRight = 0.5 * lerp(u_BarBounds.x, u_BarBounds.y, barVolumeRight);
#if ANTIALIAS == 1
	float verticalSmoothingLeft = u_AASmoothness.y * 0.05, verticalSmoothingRight = verticalSmoothingLeft;
	verticalSmoothingLeft *= saturate(lerp(0, 1, barVolumeLeft * 100.0)); // Don't blur when near 0 volume
	verticalSmoothingRight *= saturate(lerp(0, 1, barVolumeRight * 100.0));
	float barLeft = smoothstep(shapeCoord.y - verticalSmoothingLeft, shapeCoord.y + verticalSmoothingLeft, barHeightLeft);
	float barRight = smoothstep(1 - shapeCoord.y - verticalSmoothingRight, 1 - shapeCoord.y + verticalSmoothingRight, barHeightRight);
#else
	int barLeft = step(shapeCoord.y, barHeightLeft);
	int barRight = step(1 - shapeCoord.y, barHeightRight);
#endif
#if SHAPE == CENTER_H || SHAPE == CENTER_V
	// Clip the L/R channels for center, so they don't wrap around.
	barLeft *= isLeftChannel; barRight *= isRightChannel;
#endif

	// Bounds Clipping (Stereo)
#if CLIP_LOW == 1
#if ANTIALIAS == 1
	barLeft *= 1.0 - smoothstep(shapeCoord.y - verticalSmoothingLeft, shapeCoord.y + verticalSmoothingLeft, 0.5 * u_BarBounds.x);
	barRight *= 1.0 - smoothstep(1.0 - shapeCoord.y - verticalSmoothingRight, 1 - shapeCoord.y + verticalSmoothingRight, 0.5 * u_BarBounds.x);
#else
	barLeft *= 1.0 - step(shapeCoord.y, 0.5 * u_BarBounds.x);
	barRight *= 1.0 - step(1.0 - shapeCoord.y, 0.5 * u_BarBounds.x);
#endif
#endif
#if CLIP_HIGH == 1
#if ANTIALIAS == 1
	barLeft *= smoothstep(shapeCoord.y - verticalSmoothingLeft, 1 - shapeCoord.y + verticalSmoothingLeft, u_BarBounds.y);
	barRight *= smoothstep(1.0 - shapeCoord.y - verticalSmoothingRight, 1 - shapeCoord.y + verticalSmoothingRight, u_BarBounds.y);
#else
	barLeft *= step(shapeCoord.y, u_BarBounds.y);
	barRight *= step(1.0 - shapeCoord.y, u_BarBounds.y);
#endif
#endif

	float bar = max(barLeft, barRight);


// NON-STEREO *********** NON-STEREO *********** NON-STEREO *********** NON-STEREO *********** NON-STEREO *********** NON-STEREO ***********
#else
	float barVolume1 = (u_AudioSpectrumLeft[barFreq1] + u_AudioSpectrumRight[barFreq1]) * 0.5;
	float barVolume2 = (u_AudioSpectrumLeft[barFreq2] + u_AudioSpectrumRight[barFr