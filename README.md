# threejs-journey

Learn the ThreeJS journey course

# Lesson 10

- Textures, as you probably know, are images that will cover the surface of your geometries. Many types of textures can have different effects on the appearance of your geometry. It's not just about the color.

- PBR:
  - Physically Based Rendering
  - It regroups many techniques that tend to follow real-life directions to get realistic results.
- NearestFilter is better for performance
- No need mipmapping when using NearestFilter
- When you are preparing your textures, you must keep 3 crucial elements in mind:

  - The weight
    - Don't forget that the users going to your website will have to download those textures. You can use most of the types of images we use on the web like .jpg (lossy compression but usually lighter) or .png (lossless compression but usually heavier).
    - Try to apply the usual methods to get an acceptable image but as light as possible. You can use compression websites like TinyPNG (also works with jpg) or any software.
    - We also have Basis but it's for very specific case
  - The size (or the resolution)
    - Each pixel of the textures you are using will have to be stored on the GPU regardless of the image's weight. And like your hard drive, the GPU has storage limitations. It's even worse because the automatically generated mipmapping increases the number of pixels that have to be stored.
    - Try to reduce the size of your images as much as possible.
    - If you remember what we said about the mipmapping, Three.js will produce a half smaller version of the texture repeatedly until it gets a 1x1 texture. Because of that, your texture width and height must be a power of 2. That is mandatory so that Three.js can divide the size of the texture by 2.
    - Some examples: 512x512, 1024x1024 or 512x2048
    - 512, 1024 and 2048 can be divided by 2 until it reaches 1.
    - If you are using a texture with a width or height different than a power of 2 value, Three.js will try to stretch it to the closest power of 2 number, which can have visually poor results, and you'll also get a warning in the console.
  - The data
    - We haven't tested it yet, because we have other things to see first, but textures support transparency. As you may know, jpg files don't have an alpha channel, so you might prefer using a png.
    - Or you can use an alpha map, as we will see in a future lesson.
    - If you are using a normal texture (the purple one), you will probably want to have the exact values for each pixel's red, green, and blue channels, or you might end up with visual glitches. For that, you'll need to use a png because its lossless compression will preserve the values.

# Lesson 11

- Materials are used to put a color on each visible pixel of the geometries.
- The algorithms that decide on the color of each pixel are written in programs called shaders. Writing shaders is one of the most challenging parts of WebGL and Three.js, but don't worry; Three.js has many built-in materials with pre-made shaders.

- By default, you only get a two-part coloration (one for the shadow and one for the light). To add more steps to the coloration, you can use the gradientTexture we loaded at the start of the lesson on the gradientMap property: `material.gradientMap = gradientTexture`

# Lesson 13

- Lights are great and can be realistic if well used. The problem is that lights can cost a lot when it comes to performance. The GPU will have to do many calculations like the distance from the face to the light, how much that face is facing the light, if the face is in the spot light cone, etc.

- Try to add as few lights as possible and try to use the lights that cost less.

- Minimal cost:

  - AmbientLight
  - HemisphereLight

- Moderate cost:

  - DirectionalLight
  - PointLight

- High cost:
  - SpotLight
  - RectAreaLight

-Baking:

- A good technique for lighting is called baking.
- The idea is that you bake the light into the texture. This can be done in a 3D software.
- The downside is that, once the lighting is baked, we can't move the lights, because there are none and you'll probably need a lot of textures.
