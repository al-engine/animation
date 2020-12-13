import {DeltaTime, log, LogLevel, Asset, SpriteMap, Sprite} from "core";

interface AnimationDataParam {
  [index: string]: Array<number>
}

interface AnimationResult {
  timer: number,
  sprite?: Sprite,
}

export class AnimationData {
  constructor (
    public map: Asset<SpriteMap>,
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
      this.timer = 0;
      return this.start(name);
    } else {
      this.timer += delta;
      return this.continue(name, delta, this.timer, (_, length) => length - 1);
    }
  }

  loop (name: string, delta: DeltaTime){
    if (this.name !== name) {
      this.timer = 0;
      return this.start(name);
    } else {
      this.timer += delta;
      return this.continue(name, delta, this.timer, (index, length) => index % length);
    }
  }

  isolatedPlay (name: string, delta: DeltaTime, timer: number): AnimationResult {
    if (this.name !== name) {
      return {
        timer: 0,
        sprite: this.start(name)
      }
    } else {
      timer += delta;
      return {
        timer,
        sprite: this.continue(name, delta, timer, (_, length) => length - 1)
      }
    }
  }

  isolatedLoop (name: string, delta: DeltaTime, timer: number): AnimationResult {
    if (this.name !== name) {
      return {
        timer: 0,
        sprite: this.start(name)
      }
    } else {
      timer += delta;
      return {
        timer,
        sprite: this.continue(name, delta, timer, (index, length) => index % length)
      }
    }
  }

  replay (name: string, _: DeltaTime){
    return this.start(name);
  }

  private start(name: string) {
    this.name = name;

    const animation = this.animationData.getAnimation(name);
    if (!animation) {
      return;
    }
    const spriteIndex = animation[0];
    return this.animationData.getSprite(spriteIndex);
  }

  private continue(name: string, delta: DeltaTime, timer: number, resolveIndexOverflow: (index: number, length: number) => number) {
    const animation = this.animationData.getAnimation(name);
    if (!animation) {
      return;
    }
    let frameIndex = this.calculateFrameIndex(delta, timer);
    if (frameIndex >= animation.length) {
      frameIndex = resolveIndexOverflow(frameIndex, animation.length);
    }
    const spriteIndex = animation[frameIndex];
    return this.animationData.getSprite(spriteIndex);
  }

  calculateFrameIndex (_: DeltaTime, timer: number) {
    const rate = 1000 / this.speed;
    return Math.floor( timer / rate);
  }
}