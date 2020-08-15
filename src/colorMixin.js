import Colr from 'colr';
// Mix of implementations from color-js and chroma. Their copyright notice below.
// Copyright (c) 2008-2013, Andrew Brehaut, Tim Baumann, Matt Wilson,
//                          Simon Heimler, Michel Vielmetter
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

// color.js - version 1.0.1
//
// HSV <-> RGB code based on code from http://www.cs.rit.edu/~ncs/color/t_convert.html
// object function created by Douglas Crockford.
// Color scheme degrees taken from the colorjack.com colorpicker
//
// HSL support kindly provided by Tim Baumann - http://github.com/timjb
/*
chroma.js - JavaScript library for color conversions

Copyright (c) 2011-2019, Gregor Aisch
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. The name Gregor Aisch may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

-------------------------------------------------------

chroma.js includes colors from colorbrewer2.org, which are released under
the following license:

Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
and The Pennsylvania State University.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the License for the specific
language governing permissions and limitations under the License.

------------------------------------------------------

Named colors are taken from X11 Color Names.
http://www.w3.org/TR/css3-color/#svg-color

*/

const PI = Math.PI;

const TWOPI = PI * 2;
const PITHIRD = PI/3;
const DEG2RAD = PI / 180;
const RAD2DEG = 180 / PI;


const blend_f = (f) => {
    return (bottom, top) => {
        const c0 = top.toRgbArray();
        const c1 = bottom.toRgbArray();
        return Colr.fromRgbArray(f(c0, c1));
    };
};

const each = (f) => {
    return (c0, c1) => {
        let out = [];
        out[0] = f(c0[0], c1[0]);
        out[1] = f(c0[1], c1[1]);
        out[2] = f(c0[2], c1[2]);
        return out;
    };
};

const normal = (a) => {
    return a;
};

const multiply = (a,b) => {
    return a * b / 255;
};

const darken = (a,b) => {
    return a > b ? b : a;
};

const lighten = (a,b) => {
    return a > b ? a : b;
};

const screen = (a,b) => {
    return 255 * (1 - (1-a/255) * (1-b/255));
};
const overlay = (a,b) => {
    return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255 ) * ( 1 - b / 255 ));
};
const burn = (a,b) => {
    return 255 * (1 - (1 - b / 255) / (a/255));
};
const dodge = (a,b) => {
    if (a === 255) { return 255; }
    a = 255 * (b / 255) / (1 - a / 255);
    return a > 255 ? 255 : a
};

    // # add = (a,b) ->
    // #     if (a + b > 255) then 255 else a + b
// Why is this commented?
    // blend.add = blend_f(each(add));

const blendNormal = blend_f(each(normal));
const blendMultiply = blend_f(each(multiply));
const blendScreen = blend_f(each(screen));
const blendOverlay = blend_f(each(overlay));
const blendDarken = blend_f(each(darken));
const blendLighten = blend_f(each(lighten));
const blendDodge = blend_f(each(dodge));
const blendBurn = blend_f(each(burn));

const labConstants = {
    // Corresponds roughly to RGB brighter/darker
    Kn: 18,

    // D65 standard referent
    Xn: 0.950470,
    Yn: 1,
    Zn: 1.088830,

    t0: 0.137931034,  // 4 / 29
    t1: 0.206896552,  // 6 / 29
    t2: 0.12841855,   // 3 * t1 * t1
    t3: 0.008856452,  // t1 * t1 * t1
};

// TODO - Cubehelix and light map stuff? I don't think it's needed but if I have some free time.
const tMapLightness = (t) => { return t; };
const tMapDomain = (t) => { return t; };
export default {
    methods: {
        convertColor(hexValue) {
            return Colr.fromHex(hexValue);
        },
        schemeFromDegrees(color, degrees) {
            let newColors = [];
            const hslObject = color.toHslObject();
            for (let i = 0, j = degrees.length; i < j; i++) {
                let newColor = hslObject.clone();
                newColor.h = (hslObject.h + degrees[i]) % 360;
                newColors.push(Colr.fromHslObject(newColor));
            }
            return newColors;
        },
        complementaryScheme(color) {
            return this.schemeFromDegrees(color,[0, 180]);
        },

        splitComplementaryScheme(color) {
            return this.schemeFromDegrees(color,[0, 150, 320]);
        },

        splitComplementaryCWScheme(color) {
            return this.schemeFromDegrees(color,[0, 150, 300]);
        },

        splitComplementaryCCWScheme(color) {
            return this.schemeFromDegrees(color,[0, 60, 210]);
        },

        triadicScheme(color) {
            return this.schemeFromDegrees(color,[0, 120, 240]);
        },

        clashScheme(color) {
            return this.schemeFromDegrees(color,[0, 90, 270]);
        },

        tetradicScheme(color) {
            return this.schemeFromDegrees(color,[0, 90, 180, 270]);
        },

        fourToneCWScheme(color) {
            return this.schemeFromDegrees(color,[0, 60, 180, 240]);
        },

        fourToneCCWScheme(color) {
            return this.schemeFromDegrees(color,[0, 120, 180, 300]);
        },

        fiveToneAScheme(color) {
            return this.schemeFromDegrees(color,[0, 115, 155, 205, 245]);
        },

        fiveToneBScheme(color) {
            return this.schemeFromDegrees(color,[0, 40, 90, 130, 245]);
        },

        fiveToneCScheme(color) {
            return this.schemeFromDegrees(color,[0, 50, 90, 205, 320]);
        },

        fiveToneDScheme(color) {
            return this.schemeFromDegrees(color,[0, 40, 155, 270, 310]);
        },

        fiveToneEScheme(color) {
            return this.schemeFromDegrees(color,[0, 115, 230, 270, 320]);
        },

        sixToneCWScheme(color) {
            return this.schemeFromDegrees(color,[0, 30, 120, 150, 240, 270]);
        },

        sixToneCCWScheme(color) {
            return this.schemeFromDegrees(color,[0, 90, 120, 210, 240, 330]);
        },

        neutralScheme(color) {
            return this.schemeFromDegrees(color,[0, 15, 30, 45, 60, 75]);
        },
        analogousScheme(color) {
            return this.schemeFromDegrees(color,[0, 30, 60, 90, 120, 150]);
        },
        temperatureToColor(kelvin) {
            const temp = kelvin / 100;
            let r,g,b;
            if (temp < 66) {
                r = 255;
                g = -155.25485562709179 - 0.44596950469579133 * (g = temp-2) + 104.49216199393888 * Math.log(g);
                b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp-10) + 115.67994401066147 * Math.log(b);
            } else {
                r = 351.97690566805693 + 0.114206453784165 * (r = temp-55) - 40.25366309332127 * Math.log(r);
                g = 325.4494125711974 + 0.07943456536662342 * (g = temp-50) - 28.0852963507957 * Math.log(g);
                b = 255;
            }
            return Colr.fromRgb(r,g,b);
        },
        colorToTemperature(color) {
            const rgb = color.toRgbArray();
            const r = rgb[0], b = rgb[2];
            let minTemp = 1000;
            let maxTemp = 40000;
            const eps = 0.4;
            let temp;
            while (maxTemp - minTemp > eps) {
                temp = (maxTemp + minTemp) * 0.5;
                const nextColor = this.temperatureToColor(temp);
                const nextRGB = nextColor.toRgbArray();
                if ((nextRGB[2] / nextRGB[0]) >= (b / r)) {
                    maxTemp = temp;
                } else {
                    minTemp = temp;
                }
            }
            return Math.round(temp);
        },

        colorToLuminance(color) {
            // relative luminance
            // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            const rgb = color.toRgbArray();
            const r = this.luminance(rgb[0]);
            const g = this.luminance(rgb[1]);
            const b = this.luminance(rgb[2]);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        },

        luminance(x) {
            x /= 255;
            return x <= 0.03928 ? x/12.92 : Math.pow((x+0.055)/1.055, 2.4);
        },
        interpolateColor(start_color, end_color, delta) {
            const start_rgb = start_color.toRgbArray();
            const end_rgb = end_color.toRgbArray();
            return Colr.fromRgb(
                start_rgb[0] + delta * (end_rgb[0]-start_rgb[0]),
                start_rgb[1] + delta * (end_rgb[1]-start_rgb[1]),
                start_rgb[2] + delta * (end_rgb[2]-start_rgb[2]),
            )
        },
        interpolateLinearColor(start_color, end_color, delta) {
            const start_rgb = start_color.toRgbArray();
            const start_r = start_rgb[0];
            const start_b = start_rgb[1];
            const start_g = start_rgb[2];
            const end_rgb = end_color.toRgbArray();
            const end_r = end_rgb[0];
            const end_b = end_rgb[1];
            const end_g = end_rgb[2];
            return Colr.fromRgb(
                Math.sqrt(Math.pow(start_r,2) * (1-delta) + Math.pow(end_r,2) * delta),
                Math.sqrt(Math.pow(start_b,2) * (1-delta) + Math.pow(end_b,2) * delta),
                Math.sqrt(Math.pow(start_g,2) * (1-delta) + Math.pow(end_g,2) * delta)
            );
        },
        alpha(color, amount) {
          if (amount === undefined) {
              if (color.alpha === undefined) color.alpha = 1;
          } else {
              color.alpha = amount;
          }
          return color;
        },
        saturate(color, amount) {
            if ( amount === void 0 ) amount=1;
            const lch = this.colorToLCH(color);
            lch[1] += labConstants.Kn * amount;
            if (lch[1] < 0) { lch[1] = 0; }
            let rgbColor = Colr.fromRgbArray(this.lchToRgb(lch));
            return this.alpha(rgbColor, color.alpha);
        },
        desaturate(color, amount) {
            if ( amount === void 0 ) amount=1;
            return this.saturate(color, -amount);
        },
        // Should probably move all of these conversion functions to the root instead of in the mixin context.
        colorToLCH(color) {
            const rgb = color.toRgbArray();
            const lab = this.rgbToLab(rgb);
            return this.labToLch(lab[0],lab[1],lab[2]);
        },

        /* Looking at his blog article I think the bezier is fine and the caching stuff will need to be sorted,
            since Colr objects don't do that and I'm not sure I want to implement that.
        correctLightness(v) {
            if (v == null) { v = true; }
            _correctLightness = v;
            resetCache();
            if (_correctLightness) {
                tMapLightness = function(t) {
                    var L0 = getColor(0, true).lab()[0];
                    var L1 = getColor(1, true).lab()[0];
                    var pol = L0 > L1;
                    var L_actual = getColor(t, true).lab()[0];
                    var L_ideal = L0 + ((L1 - L0) * t);
                    var L_diff = L_actual - L_ideal;
                    var t0 = 0;
                    var t1 = 1;
                    var max_iter = 20;
                    while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0)) {
                        (function() {
                            if (pol) { L_diff *= -1; }
                            if (L_diff < 0) {
                                t0 = t;
                                t += (t1 - t) * 0.5;
                            } else {
                                t1 = t;
                                t += (t0 - t) * 0.5;
                            }
                            L_actual = getColor(t, true).lab()[0];
                            return L_diff = L_actual - L_ideal;
                        })();
                    }
                    return t;
                };
            } else {
                tMapLightness = function (t) { return t; };
            }
            return f;
        },*/
        lchToRgb(lch) {
            const lab = this.lchToLab(lch);
            const rgb = this.labToRgb(lab);
            const r = rgb[0];
            const g = rgb[1];
            const b = rgb[2];
            return [r, g, b, lch.length > 3 ? lch[3] : 1];
        },
        lchToLab(lch) {
            /*
            Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
            These formulas were invented by David Dalrymple to obtain maximum contrast without going
            out of gamut if the parameters are in the range 0-1.
            A saturation multiplier was added by Gregor Aisch
            */
            const l = lch[0];
            const c = lch[1];
            let h = lch[2];
            if (isNaN(h)) { h = 0; }
            h = h * DEG2RAD;
            return [l, Math.cos(h) * c, Math.sin(h) * c]
        },
        labToLch(lab) {
            const l = lab[0];
            const a = lab[1];
            const b = lab[2];
            const c = Math.sqrt(a * a + b * b);
            let h = ( Math.atan2(b, a) * RAD2DEG + 360) % 360;
            if (Math.round(c*10000) === 0) { h = Number.NaN; }
            return [l, c, h];
        },
        rgbToLab(rgb) {
            const xyz = this.rgbToXyz(rgb[0],rgb[1],rgb[2]);
            const x = xyz[0];
            const y = xyz[1];
            const z = xyz[2];
            const l = 116 * y - 16;
            return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)];
        },

        /*
         * L* [0..100]
         * a [-100..100]
         * b [-100..100]
         */
        labToRgb(lab) {
            const l = lab[0];
            const a = lab[1];
            const b = lab[2];
            let x,y,z, r,g,b_;

            y = (l + 16) / 116;
            x = isNaN(a) ? y : y + a / 500;
            z = isNaN(b) ? y : y - b / 200;

            y = labConstants.Yn * this.lab_xyz(y);
            x = labConstants.Xn * this.lab_xyz(x);
            z = labConstants.Zn * this.lab_xyz(z);

            r = this.xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);  // D65 -> sRGB
            g = this.xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
            b_ = this.xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);

            return [r,g,b_,lab.length > 3 ? lab[3] : 1];
        },
        xyz_rgb(r) {
            return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - 0.055)
        },

        lab_xyz(t) {
            return t > labConstants.t1 ? t * t * t : labConstants.t2 * (t - labConstants.t0)
        },
        rgb_xyz(r) {
            if ((r /= 255) <= 0.04045) { return r / 12.92; }
            return Math.pow((r + 0.055) / 1.055, 2.4);
        },

        xyz_lab(t) {
            if (t > labConstants.t3) { return Math.pow(t, 1 / 3); }
            return t / labConstants.t2 + labConstants.t0;
        },
        rgbToXyz(r,g,b) {
            r = this.rgb_xyz(r);
            g = this.rgb_xyz(g);
            b = this.rgb_xyz(b);
            const x = this.xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn);
            const y = this.xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn);
            const z = this.xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn);
            return [x,y,z];
        },
        bezier(colors) {
            let I, lab0, lab1, lab2;
            //colors = colors.map(c => new Color(c)); // Going to assume that I'm passing in a colr object...
            if (colors.length === 2) {
                // linear interpolation
                [lab0, lab1] = colors.map(c => this.rgbToLab(c.toRgbArray()));
                I = (t) => {
                    const lab = ([0, 1, 2].map((i) => lab0[i] + (t * (lab1[i] - lab0[i]))));
                    return Colr.fromRgbArray(this.labToRgb(lab));
                };
            } else if (colors.length === 3) {
                // quadratic bezier interpolation
                [lab0, lab1, lab2] = colors.map(c => this.rgbToLab(c.toRgbArray()));
                I = (t) => {
                    const lab = ([0, 1, 2].map((i) => ((1 - t) * (1 - t) * lab0[i]) + (2 * (1 - t) * t * lab1[i]) + (t * t * lab2[i])));
                    return Colr.fromRgbArray(this.labToRgb(lab));
                };
            } else if (colors.length === 4) {
                // cubic bezier interpolation
                let lab3;
                [lab0, lab1, lab2, lab3] = colors.map(c => this.rgbToLab(c.toRgbArray()));
                I = (t) => {
                    const lab = ([0, 1, 2].map((i) => ((1 - t) * (1 - t) * (1 - t) * lab0[i]) + (3 * (1 - t) * (1 - t) * t * lab1[i]) + (3 * (1 - t) * t * t * lab2[i]) + (t * t * t * lab3[i])));
                    return Colr.fromRgbArray(this.labToRgb(lab));
                };
            } else if (colors.length === 5) {
                const I0 = this.bezier(colors.slice(0, 3));
                const I1 = this.bezier(colors.slice(2, 5));
                I = (t) => {
                    if (t < 0.5) {
                        return I0(t * 2);
                    } else {
                        return I1((t - 0.5) * 2);
                    }
                };
            }
            return I;
        },
        bezierScale(colors) {
            const f = this.bezier(colors);
            // Scale implements the light correction and cache stuff which adds more weight (memory) to color objects. Avoiding for now.
            //f.scale = () => scale(f);
            return f;
        },
         blendNormal(c1, c2) {
           return blendNormal(c1, c2)
         },
         blendMultiply(c1, c2) {
           return blendMultiply(c1, c2)
         },
         blendScreen(c1, c2) {
           return blendScreen(c1, c2)
         },
         blendOverlay(c1, c2) {
           return blendOverlay(c1, c2)
         },
         blendDarken(c1, c2) {
           return blendDarken(c1, c2)
         },
         blendLighten(c1, c2) {
           return blendLighten(c1, c2)
         },
         blendDodge(c1, c2) {
           return blendDodge(c1, c2)
         },
         blendBurn(c1, c2) {
           return blendBurn(c1, c2)
         }
    }
}