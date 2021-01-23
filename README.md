# Al engine
## SpriteAnimation

This is module for Sprite Animation for Al engine.

```nashorn js
  // You need asset which is PNG file with frames lined vertically
  // and object where keys is a animation names and value is array of indexes of frames in PNG
  const animationData = new AnimationData(
    asset,
    { animationName: framesIndexes }
  );
  
  // You use animationData and set speed for animation
  const animation = new SpriteAnimation(animationData, animationSpeed);

  // each game frame you call [loop] method to get sprite for this frame
  const sprite = animation.loop('animationName', delta);
```  