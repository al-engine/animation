import {SpriteMapAsset} from "asset";
import {DeltaTime, log, LogLevel} from "core";

interface AnimationDataParam {
  [index: string]: Array<number>
}

export class AnimationData {
  constructor (
    public map: SpriteMapAsset,
    public animations: AnimationDataParam
  ) {

  }

  getAnimation(name: string) {
    const animation = this.animations[name];
    if (!animation) {
      log(`Animation with name ${name} doesn't not exist`, LogLevel.error, 'rendering');
    }
    return animation;
  }

  getSprite(index: number) {
    return this.map.data?.sprites[index];
  }
}

export class Animation {
  name = '';
  timer = 0;
  constructor(public animationData: AnimationData, public speed: number) {}

  play (name: string, delta: DeltaTime){
    if (this.name !== name) {
      return this.start(name);
    } else {
      return this.continue(name, delta, (_, length) => length - 1);
    }
  }

  loop (name: string, delta: DeltaTime){
    if (this.name !== name) {
      return this.start(name);
    } else {
      return this.continue(name, delta, (index, length) => index % length);
    }
  }

  replay (name: string, _: DeltaTime){
    return this.start(name);
  }

  private start(name: string) {
    this.name = name;
    this.timer = 0;

    const animation = this.animationData.getAnimation(name);
    if (!animation) {
      return;
    }
    const spriteIndex = animation[0];
    return this.animationData.getSprite(spriteIndex);
  }

  private continue(name: string, delta: DeltaTime, resolveIndexOverflow: (index: number, length: number) => number) {
    this.timer += delta;
    const animation = this.animationData.getAnimation(name);
    if (!animation) {
      return;
    }
    let frameIndex = this.calculateFrameIndex(delta);
    if (frameIndex >= animation.length) {
      frameIndex = resolveIndexOverflow(frameIndex, animation.length);
    }
    const spriteIndex = animation[frameIndex];
    return this.animationData.getSprite(spriteIndex);
  }

  calculateFrameIndex (_: DeltaTime) {
    const rate = 1000 / this.speed;
    return Math.floor( this.timer / rate);
  }
}