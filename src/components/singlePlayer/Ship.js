import Bullet from './Bullet';
class Ship {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0;
    this.rotationSpeed = 6;
    this.speed = 0.15;
    this.inertia = 0.99;
    this.radius = 20;
    this.lastShot = 0;
    this.create = args.create;
    this.onDie = args.onDie;
    this.delete = false;
    this.spaceShip = args.spaceShip;
  }

  destroy(){
    this.delete = true;
    this.onDie();
  }

  rotate(dir){
    if (dir === 'LEFT') {
      this.rotation -= this.rotationSpeed;
    }
    if (dir === 'RIGHT') {
      this.rotation += this.rotationSpeed;
    }
  }

  accelerate(val){
    this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;
  }

  render(state){
    // Controls
    if(state.keys.up){
      this.accelerate(1);
    }
    if(state.keys.left){
      this.rotate('LEFT');
    }
    if(state.keys.right){
      this.rotate('RIGHT');
    }
    if(state.keys.space && Date.now() - this.lastShot > 300){
      const bullet = new Bullet({ship: this});
      this.create(bullet, 'bullets');
      this.lastShot = Date.now();
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Rotation
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width) this.position.x = 0;
    else if(this.position.x < 0) this.position.x = state.screen.width;
    if(this.position.y > state.screen.height) this.position.y = 0;
    else if(this.position.y < 0) this.position.y = state.screen.height;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#ffffff';
    switch (this.spaceShip) {
      case '0':
        context.fillStyle = '#000000';
        break;
      case '1':
        context.fillStyle = '#ff0000';
        break;
      case '2':
        context.fillStyle = '#fff000';
        break;
      default:
        context.fillStyle = '#000000';
    }
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -15);
    context.lineTo(10, 10);
    context.lineTo(5, 7);
    context.lineTo(-5, 7);
    context.lineTo(-10, 10);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}

export default Ship;
