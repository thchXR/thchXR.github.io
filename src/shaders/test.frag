precision highp float;

uniform float uTime;
uniform vec2 uResolution;

vec3 hash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(mix(mix(dot(hash(i + vec3(0,0,0)), f - vec3(0,0,0)),
                       dot(hash(i + vec3(1,0,0)), f - vec3(1,0,0)), f.x),
                   mix(dot(hash(i + vec3(0,1,0)), f - vec3(0,1,0)),
                       dot(hash(i + vec3(1,1,0)), f - vec3(1,1,0)), f.x), f.y),
               mix(mix(dot(hash(i + vec3(0,0,1)), f - vec3(0,0,1)),
                       dot(hash(i + vec3(1,0,1)), f - vec3(1,0,1)), f.x),
                   mix(dot(hash(i + vec3(0,1,1)), f - vec3(0,1,1)),
                       dot(hash(i + vec3(1,1,1)), f - vec3(1,1,1)), f.x), f.y), f.z);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = (gl_FragCoord.xy - uResolution.xy * 0.5) / uResolution.y;
    
    float t = uTime * 0.3;
    
    // 多层噪波
    float n1 = noise(vec3(p * 3.0 + t * 0.5, t * 0.2));
    float n2 = noise(vec3(p * 8.0 - t * 0.8, t * 0.7));
    
    float value = n1 * 0.6 + n2 * 0.4;
    
    // 颜色
    vec3 color1 = vec3(0.0, 0.8, 1.0);   // 青色
    vec3 color2 = vec3(1.0, 0.2, 0.8);   // 品红
    
    vec3 col = mix(color1, color2, value);
    
    // 添加轻微网格
    vec2 grid = abs(fract(p * 10.0) - 0.5) / 0.02;
    float gridLine = 1.0 - min(grid.x, grid.y);
    col += gridLine * 0.15;
    
    // 轻微 vignette
    float vig = 1.0 - length(uv - 0.5) * 0.6;
    col *= vig * 1.1;
    
    gl_FragColor = vec4(col, 1.0);
}