ependencies" : 
	[
		"materials/workshop/3732231168/effects/blur_precise_gaussian_x.json",
		"materials/workshop/3732231168/effects/blur_precise_gaussian_y.json",
		"shaders/workshop/3732231168/effects/blur_precise_gaussian.frag",
		"shaders/workshop/3732231168/effects/blur_precise_gaussian.vert"
	],
	"description" : "ui_editor_effect_blur_precise_description",
	"fbos" : 
	[
		{
			"format" : "rgba_backbuffer",
			"name" : "_rt_FullCompoBuffer1"
		}
	],
	"group" : "blur",
	"name" : "ui_editor_effect_blur_precise_title",
	"passes" : 
	[
		{
			"material" : "materials/workshop/3732231168/effects/blur_precise_gaussian_x.json",
			"target" : "_rt_FullCompoBuffer1"
		},
		{
			"bind" : 
			[
				{
					"index" : 0,
					"name" : "_rt_FullCompoBuffer1"
				},
				{
					"index" : 1,
					"name" : "previous"
				}
			],
			"material" : "materials/workshop/3732231168/effects/blur_precise_gaussian_y.json"
		}
	],
	"performance" : "expensive",
	"preview" : "preview/projec