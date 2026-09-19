
	"renderer" : 
	[
		{
			"id" : 1,
			"length" : 0.05,
			"maxlength" : 1,
			"name" : "spritetrail"
		}
	],
	"sequencemultiplier" : null,
	"starttime" : 0
}{
	"dependencies" : 
	[
		"materials/workshop/3373140814/effects/Simple_Audio_Bars.json",
		"shaders/workshop/3373140814/effects/Simple_Audio_Bars.frag",
		"shaders/workshop/3373140814/effects/Simple_Audio_Bars.vert"
	],
	"description" : "Adds a cusomizable audio bar effect to the layer. Supports various positions (left, right, both, center, etc.) and as many bars as you'd like.",
	"group" : "localeffects",
	"name" : "Simple Audio Bars",
	"passes" : 
	[
		{
			"material" : "materials/workshop/3373140814/effects/Simple_Audio_Bars.json"
		}
	],
	"preview" : "preview/project.json",
	"replacementkey" : "Simple_Audio_Bars",
	"version" : 1
}{
	"passes" : 
	[
		{
			"blending" : "normal",
			"cullmode" : "nocull",
			"depthtest" : "disabled",
			"depthwrite" : "disabled",
			"shader" : "workshop/3373140814/effects/Simple_Audio_Bars"
		}
	]
}{
	"passes" : 
	[
		{
			"blending" : "translucent",
			"combos" : 
			{
				"SPRITESHEET" : 1,
				"VERSION" : 2
			},
			"cullmode" : "nocull",
			"depthtest" : "disabled",
			"depthwrite" : "disabled",
			"shader" : "genericimage2",
			"textures" : [ "workshop/2927204211/1962955_3b845" ]
		}
	]
}{
	"dependencies" : 
	[
		"materials/workshop/3373140814/effects/gradient_color.json",
		"shaders/workshop/3373140814/effects/gradient_color.frag",
		"shaders/workshop/3373140814/effects/gradient_color.vert"
	],
	"group" : "localeffects",
	"name" : "Gradient Color",
	"passes" : 
	[
		{
			"material" : "materials/workshop/3373140814/effects/gradient_color.json"
		}
	],
	"replacementkey" : "gradient_color",
	"version" : 1
}{
	"passes" : 
	[
		{
			"blending" : "normal",
			"cullmode" : "nocull",
			"depthtest" : "disabled",
			"depthwrite" : "disabled",
			"shader" : "workshop/3373140814/effects/gradient_color"
		}
	]
}#include "common.h"



uniform m